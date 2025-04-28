import type { Express } from "express";
import { createServer, type Server } from "http";
import ExcelJS from "exceljs";
import nodemailer from "nodemailer";
import { z } from "zod";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

// Load environment variables from a .env file
dotenv.config();

// Import schemas for validation
import {
  insertUserSchema,
  insertDriveSchema,
  insertFileSchema,
  insertUploadSchema,
} from "@shared/schema";

// Import storage utilities (assumed to be custom storage handler)
import { storage } from "./storage";

// Set up constants for paths and configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SMTP transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify SMTP connection
transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

// Google Sheets API setup using environment variables for Google Cloud credentials
const credentials = JSON.parse(process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT || '{}');
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = process.env.SPREADSHEET_ID || ''; // Spreadsheet ID from environment

// Route handler for registering routes
export async function registerRoutes(app: Express): Promise<Server> {

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);

      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your_secret_key',
        { expiresIn: '1h' }
      );

      return res.json({ token });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Drive-related routes
  app.get("/api/drives", async (_req, res) => {
    try {
      const drives = await storage.getDrives(1); // Assume userId is 1
      return res.json(drives);
    } catch {
      return res.status(500).json({ message: "Failed to fetch drives" });
    }
  });

  app.get("/api/drives/:id", async (req, res) => {
    try {
      const driveId = Number(req.params.id);
      if (isNaN(driveId)) return res.status(400).json({ message: "Invalid drive ID" });

      const drive = await storage.getDrive(driveId);
      if (!drive) return res.status(404).json({ message: "Drive not found" });

      return res.json(drive);
    } catch {
      return res.status(500).json({ message: "Error fetching drive" });
    }
  });

  app.post("/api/drives", async (req, res) => {
    try {
      const driveData = insertDriveSchema.parse(req.body);
      const drive = await storage.createDrive(driveData);
      return res.status(201).json(drive);
    } catch (error) {
      return res.status(400).json({ message: "Invalid drive data", error });
    }
  });

  // File-related routes
  app.get("/api/files", async (_req, res) => {
    try {
      const files = await storage.getFiles(1); // Assume userId is 1
      return res.json(files);
    } catch {
      return res.status(500).json({ message: "Error fetching files" });
    }
  });

  app.post("/api/files", async (req, res) => {
    try {
      const fileData = insertFileSchema.parse(req.body);
      const file = await storage.createFile(fileData);
      return res.status(201).json(file);
    } catch (error) {
      return res.status(400).json({ message: "Invalid file data", error });
    }
  });

  app.get("/api/files/search", async (req, res) => {
    try {
      const searchTerm = req.query.q as string;
      if (!searchTerm) return res.status(400).json({ message: "Search term is required" });

      const files = await storage.searchFiles(1, searchTerm); // Assume userId is 1
      return res.json(files);
    } catch {
      return res.status(500).json({ message: "Search failed" });
    }
  });

  // Preregistration route (Google Sheets integration)
  app.post("/api/preregister", async (req, res) => {
    try {
      const { email, ...data } = req.body;

      if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Valid recipient email is required." });
      }

      const rows = Array.isArray(data) ? data : [data];

      const flattenedRows = rows.map((entry) => {
        const { feedback, ...rest } = entry;
        const flatFeedback = {};

        if (feedback && typeof feedback === "object") {
          for (const [key, value] of Object.entries(feedback)) {
            flatFeedback[`${key}_rating`] = value.rating ?? "";
            flatFeedback[`${key}_feedback`] = value.feedback ?? "";
          }
        }

        return { ...rest, ...flatFeedback };
      });

      const sheetRows = flattenedRows.map((entry) => Object.values(entry));

      // Append to Google Sheets
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: { values: sheetRows },
      });

      // Send email notification
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        subject: "New Preregistration Received",
        text: `New preregistration submitted by ${email}`,
      });

      // Update stats.json
      const filePathStats = path.join(__dirname, '../data/stats.json');
      const statsRaw = await fs.readFile(filePathStats, 'utf-8');
      const stats = JSON.parse(statsRaw);

      stats.registrations++;

      if (data.feedback || Object.values(data).some((val) => val?.feedback || val?.rating)) {
        stats.feedbacks++;
      }

      stats.overallRating = data.overallRating ?? stats.overallRating;
      stats.lastUpdated = new Date().toISOString();

      await fs.writeFile(filePathStats, JSON.stringify(stats, null, 2));

      return res.json({
        success: true,
        message: 'Registration successful and data saved to Google Sheet.',
        registrations: stats.registrations,
        overallRating: stats.overallRating,
        feedbacks: stats.feedbacks,
      });

    } catch (err) {
      console.error("Error saving preregistration:", err);
      return res.status(500).json({
        message: "Failed to process preregistration",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  });

  // Feedback and stats routes
  app.post("/api/stats", async (_req, res) => {
    try {
      const filePath = path.join(__dirname, "../data/stats.json");
      const statsRaw = await fs.readFile(filePath, "utf-8");
      const stats = JSON.parse(statsRaw);
      return res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      return res.status(500).json({ message: "Error fetching stats" });
    }
  });

  app.post("/api/visit", async (_req, res) => {
    try {
      const filePath = path.join(__dirname, "../data/stats.json");
      const statsRaw = await fs.readFile(filePath, "utf-8");
      const stats = JSON.parse(statsRaw);

      stats.visits++;
      stats.lastUpdated = new Date().toISOString();

      await fs.writeFile(filePath, JSON.stringify(stats, null, 2));

      return res.json({ visits: stats.visits });
    } catch (error) {
      console.error("Error updating visit count:", error);
      return res.status(500).json({ error: "Failed to update visit count" });
    }
  });

  // Create and return HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
