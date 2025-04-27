import type { Express } from "express";
import { createServer, type Server } from "http";
import ExcelJS from "exceljs";
import nodemailer from "nodemailer";
import { z } from "zod";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

import {
  insertUserSchema,
  insertDriveSchema,
  insertFileSchema,
  insertUploadSchema,
} from "@shared/schema";

import { storage } from "./storage";

dotenv.config();

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify transporter connection
transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // ------------------ Auth ------------------
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
        'your_secret_key', 
        { expiresIn: '1h' }
      );
  
      return res.json({ token }); // <-- THIS
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ------------------ Drives ------------------
  app.get("/api/drives", async (_req, res) => {
    try {
      const userId = 1;
      const drives = await storage.getDrives(userId);
      return res.json(drives);
    } catch {
      return res.status(500).json({ message: "Failed to fetch drives" });
    }
  });

  app.get("/api/drives/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

      const drive = await storage.getDrive(id);
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

  app.patch("/api/drives/:id/toggle", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

      const { isConnected } = req.body;
      if (typeof isConnected !== "boolean") {
        return res
          .status(400)
          .json({ message: "isConnected must be a boolean" });
      }

      const drive = await storage.toggleDriveConnection(id, isConnected);
      if (!drive) return res.status(404).json({ message: "Drive not found" });

      return res.json(drive);
    } catch {
      return res.status(500).json({ message: "Error updating drive" });
    }
  });

  // ------------------ Files ------------------
  app.get("/api/files", async (_req, res) => {
    try {
      const userId = 1;
      const files = await storage.getFiles(userId);
      return res.json(files);
    } catch {
      return res.status(500).json({ message: "Error fetching files" });
    }
  });

  app.get("/api/files/deleted", async (_req, res) => {
    try {
      const userId = 1;
      const deletedFiles = await storage.getDeletedFiles(userId);
      return res.json(deletedFiles);
    } catch {
      return res.status(500).json({ message: "Error fetching deleted files" });
    }
  });

  app.delete("/api/files/trash/empty", async (_req, res) => {
    try {
      const userId = 1;
      const success = await storage.emptyTrash(userId);
      return res.json({ success });
    } catch {
      return res.status(500).json({ message: "Failed to empty trash" });
    }
  });

  app.post("/api/files/trash/restore", async (req, res) => {
    try {
      const { fileIds } = req.body;
      if (!Array.isArray(fileIds)) {
        return res.status(400).json({ message: "fileIds must be an array" });
      }
      const results = await Promise.all(
        fileIds.map((id) => storage.restoreFile(id)),
      );
      return res.json({ success: true, results });
    } catch {
      return res.status(500).json({ message: "Restore failed" });
    }
  });

  app.post("/api/files/trash/delete", async (req, res) => {
    try {
      const { fileIds } = req.body;
      if (!Array.isArray(fileIds)) {
        return res.status(400).json({ message: "fileIds must be an array" });
      }
      const results = await Promise.all(
        fileIds.map((id) => storage.permanentlyDeleteFile(id)),
      );
      return res.json({ success: true, results });
    } catch {
      return res.status(500).json({ message: "Permanent delete failed" });
    }
  });

  app.get("/api/files/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ message: "Invalid file ID" });

      const file = await storage.getFile(id);
      if (!file) return res.status(404).json({ message: "File not found" });

      return res.json(file);
    } catch {
      return res.status(500).json({ message: "Error fetching file" });
    }
  });

  app.get("/api/drives/:driveId/files", async (req, res) => {
    try {
      const driveId = Number(req.params.driveId);
      if (isNaN(driveId))
        return res.status(400).json({ message: "Invalid drive ID" });

      const files = await storage.getFilesByDrive(driveId);
      return res.json(files);
    } catch {
      return res.status(500).json({ message: "Error fetching drive files" });
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

  app.delete("/api/files/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const file = await storage.deleteFile(id);
      if (!file) return res.status(404).json({ message: "File not found" });

      return res.json(file);
    } catch {
      return res.status(500).json({ message: "Failed to delete file" });
    }
  });

  app.patch("/api/files/:id/restore", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const file = await storage.restoreFile(id);
      if (!file) return res.status(404).json({ message: "File not found" });

      return res.json(file);
    } catch {
      return res.status(500).json({ message: "Restore failed" });
    }
  });

  app.delete("/api/files/:id/permanent", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.permanentlyDeleteFile(id);
      if (!success) return res.status(404).json({ message: "File not found" });

      return res.json({ success });
    } catch {
      return res.status(500).json({ message: "Permanent delete failed" });
    }
  });

  app.get("/api/files/search", async (req, res) => {
    try {
      const userId = 1;
      const searchTerm = req.query.q as string;
      if (!searchTerm)
        return res.status(400).json({ message: "Search term is required" });

      const files = await storage.searchFiles(userId, searchTerm);
      return res.json(files);
    } catch {
      return res.status(500).json({ message: "Search failed" });
    }
  });

  // ------------------ Upload Stats ------------------
  app.get("/api/uploads", async (_req, res) => {
    try {
      const userId = 1;
      const uploads = await storage.getUploads(userId);
      return res.json(uploads);
    } catch {
      return res.status(500).json({ message: "Failed to get uploads" });
    }
  });

  app.post("/api/uploads", async (req, res) => {
    try {
      const uploadData = insertUploadSchema.parse(req.body);
      const upload = await storage.createUpload(uploadData);
      return res.status(201).json(upload);
    } catch (error) {
      return res.status(400).json({ message: "Invalid upload data", error });
    }
  });

  // ------------------ Feedback System ------------------
  
  app.post("/api/stats", async (_req, res) => {
    const filePath = path.join(__dirname, "../data/stats.json");
    const statsRaw = await fs.readFile(filePath, "utf-8");
    const stats = JSON.parse(statsRaw);
    return res.json(stats);
  });

  app.post("/api/visit", async (_req, res) => {
    try {
      const filePath = path.join(__dirname, "../data/stats.json");

      // Read the stats.json file
      const statsRaw = await fs.readFile(filePath, "utf-8");
      const stats = JSON.parse(statsRaw);

      // Update the visit count
      stats.visits++;
      stats.lastUpdated = new Date().toISOString();

      // Write the updated stats back to the file
      await fs.writeFile(filePath, JSON.stringify(stats, null, 2));

      return res.json({ visits: stats.visits });
    } catch (error) {
      console.error("Error updating visit count:", error);
      return res.status(500).json({ error: "Failed to update visit count" });
    }
  });

  app.post("/api/preregister", async (req, res) => {
    try {
      const { email, ...data } = req.body;
  
      if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Valid recipient email is required." });
      }
  
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Preregistration");
  
      const allKeys = new Set<string>();
      const rows = Array.isArray(data) ? data : [data];
  
      // Flatten feedback structure before collecting keys
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
  
      // Update allKeys based on flattened structure
      flattenedRows.forEach((entry) => {
        Object.keys(entry).forEach((key) => allKeys.add(key));
      });
  
      sheet.columns = Array.from(allKeys).map((key) => ({
        header: key,
        key,
        width: 20,
      }));
  
      // Add flattened rows
      flattenedRows.forEach((entry) => sheet.addRow(entry));
  
      const buffer = await workbook.xlsx.writeBuffer();
  
      // Send email with attachment
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        subject: "New Preregistration Data",
        text: "Attached is the Excel sheet with preregistration data.",
        attachments: [
          {
            filename: "preregistration.xlsx",
            content: buffer,
            contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        ],
      });
  
      const filePath = path.join(__dirname, "../data/stats.json");
      const statsRaw = await fs.readFile(filePath, "utf-8");
      const stats = JSON.parse(statsRaw);
  
      stats.registrations++;
  
      if (
        data.feedback ||
        Object.values(data).some((val) => val?.feedback || val?.rating)
      ) {
        stats.feedbacks++;
      }
  
      stats.overallRating = data.overallRating ?? stats.overallRating;
      stats.lastUpdated = new Date().toISOString();
  
      await fs.writeFile(filePath, JSON.stringify(stats, null, 2));
  
      return res.json({
        success: true,
        registrations: stats.registrations,
        overallRating: stats.overallRating,
        feedbacks: stats.feedbacks,
      });
    } catch (err) {
      console.error("Email sending error:", err);
      return res.status(500).json({
        message: "Failed to process preregistration",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
