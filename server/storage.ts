import { 
  users, drives, files, uploads, 
  type User, type InsertUser, 
  type Drive, type InsertDrive,
  type File, type InsertFile,
  type Upload, type InsertUpload
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Drive operations
  getDrives(userId: number): Promise<Drive[]>;
  getDrive(id: number): Promise<Drive | undefined>;
  createDrive(drive: InsertDrive): Promise<Drive>;
  updateDrive(id: number, data: Partial<Drive>): Promise<Drive | undefined>;
  toggleDriveConnection(id: number, isConnected: boolean): Promise<Drive | undefined>;
  
  // File operations
  getFiles(userId: number): Promise<File[]>;
  getFile(id: number): Promise<File | undefined>;
  getFilesByDrive(driveId: number): Promise<File[]>;
  getDeletedFiles(userId: number): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
  deleteFile(id: number): Promise<File | undefined>;
  restoreFile(id: number): Promise<File | undefined>;
  permanentlyDeleteFile(id: number): Promise<boolean>;
  searchFiles(userId: number, searchTerm: string): Promise<File[]>;
  
  // Upload operations
  getUploads(userId: number): Promise<Upload[]>;
  createUpload(upload: InsertUpload): Promise<Upload>;
}

export class MemStorage implements IStorage {
  emptyTrash(userId: number) {
    throw new Error("Method not implemented.");
  }
  private users: Map<number, User>;
  private drives: Map<number, Drive>;
  private files: Map<number, File>;
  private uploads: Map<number, Upload>;
  
  private userId: number;
  private driveId: number;
  private fileId: number;
  private uploadId: number;

  constructor() {
    this.users = new Map();
    this.drives = new Map();
    this.files = new Map();
    this.uploads = new Map();
    
    this.userId = 1;
    this.driveId = 1;
    this.fileId = 1;
    this.uploadId = 1;
    
    // Create a default demo user
    this.createUser({
      username: "demo",
      email: "demo@linkmydrives.com",
      password: "demo123"
    });
    
    // Create demo drives
    this.createDrive({
      userId: 1,
      name: "Google Drive",
      type: "google",
      email: "demo@gmail.com",
      totalSpace: 15360, // 15 GB in MB
      usedSpace: 7372, // 7.2 GB in MB
      isConnected: true
    });
    
    this.createDrive({
      userId: 1,
      name: "OneDrive",
      type: "onedrive",
      email: "demo@outlook.com",
      totalSpace: 5120, // 5 GB in MB
      usedSpace: 3891, // 3.8 GB in MB
      isConnected: true
    });
    
    this.createDrive({
      userId: 1,
      name: "Dropbox",
      type: "dropbox",
      email: "demo@email.com",
      totalSpace: 2048, // 2 GB in MB
      usedSpace: 1536, // 1.5 GB in MB
      isConnected: true
    });
    
    this.createDrive({
      userId: 1,
      name: "iCloud",
      type: "icloud",
      email: "demo@icloud.com",
      totalSpace: 5120, // 5 GB in MB
      usedSpace: 4301, // 4.2 GB in MB
      isConnected: true
    });
    
    const Id = this.fileId++;

    // Create demo files
    this.files.set(Id, {
      id: Id,
      driveId: 1, // Google Drive
      userId: 1,
      name: "Project Proposal.pdf",
      path: "/Projects/2023/Proposals/",
      type: "pdf",
      size: 2457, // 2.4 MB in KB
      lastModified: String(new Date("2023-05-15")),
      createdAt: new Date("2023-05-15"),
      deletedAt: null
    });
    
    this.createFile({
      driveId: 2, // OneDrive
      userId: 1,
      name: "Product Mockup.png",
      path: "/Designs/Products/",
      type: "image",
      size: 4915, // 4.8 MB in KB
      lastModified: String(new Date("2023-05-12"))
    });
    
    this.createFile({
      driveId: 3, // Dropbox
      userId: 1,
      name: "Product Demo.mp4",
      path: "/Videos/Demos/",
      type: "video",
      size: 39117, // 38.2 MB in KB
      lastModified: String(new Date("2023-05-10"))
    });
    
    this.createFile({
      driveId: 2, // OneDrive
      userId: 1,
      name: "Meeting Notes.docx",
      path: "/Documents/Meetings/",
      type: "doc",
      size: 1228, // 1.2 MB in KB
      lastModified: String(new Date("2023-05-08"))
    });
    
    this.createFile({
      driveId: 1, // Google Drive
      userId: 1,
      name: "Budget 2023.xlsx",
      path: "/Finance/2023/",
      type: "spreadsheet",
      size: 3686, // 3.6 MB in KB
      lastModified: String(new Date("2023-05-05"))
    });
    
    // Add more varied file types
    this.createFile({
      driveId: 4, // iCloud
      userId: 1,
      name: "Vacation Photos.zip",
      path: "/Archives/Photos/",
      type: "archive",
      size: 45875, // 44.8 MB in KB
      lastModified: String(new Date("2023-06-25"))
    });
    
    this.createFile({
      driveId: 3, // Dropbox
      userId: 1,
      name: "Company Branding.ai",
      path: "/Design/Branding/",
      type: "image",
      size: 15360, // 15 MB in KB
      lastModified: String(new Date("2023-06-22"))
    });
    
    this.createFile({
      driveId: 1, // Google Drive
      userId: 1,
      name: "Quarterly Report.pptx",
      path: "/Presentations/Quarterly/",
      type: "presentation",
      size: 8192, // 8 MB in KB
      lastModified: String(new Date("2023-07-05"))
    });
    
    this.createFile({
      driveId: 2, // OneDrive
      userId: 1,
      name: "Background Music.mp3",
      path: "/Media/Audio/",
      type: "audio",
      size: 5120, // 5 MB in KB
      lastModified: String(new Date("2023-07-10"))
    });
    
    this.createFile({
      driveId: 4, // iCloud
      userId: 1,
      name: "System Backup.dmg",
      path: "/Backups/System/",
      type: "other",
      size: 51200, // 50 MB in KB
      lastModified: String(new Date("2023-07-15"))
    });
    
    this.createFile({
      driveId: 3, // Dropbox
      userId: 1,
      name: "Conference Notes.txt",
      path: "/Notes/Conferences/",
      type: "text",
      size: 128, // 0.125 MB in KB
      lastModified: String(new Date("2023-07-20"))
    });
    
    this.createFile({
      driveId: 1, // Google Drive
      userId: 1,
      name: "Project Timeline.pdf",
      path: "/Projects/Timeline/",
      type: "pdf",
      size: 3072, // 3 MB in KB
      lastModified: String(new Date("2023-07-28"))
    });
    
    // Create demo uploads for statistics
    // Google Drive uploads
    this.createUpload({
      userId: 1,
      driveId: 1,
      fileId: 1,
      fileName: "document.pdf",
      fileSize: 2048, // 2 MB in KB
      uploadTime: 3.2,
      fileType: "pdf"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 1,
      fileId: 1,
      fileName: "presentation.pptx",
      fileSize: 15360, // 15 MB in KB
      uploadTime: 5.1,
      fileType: "pptx"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 1,
      fileId: 1,
      fileName: "photo.jpg",
      fileSize: 25600, // 25 MB in KB
      uploadTime: 8.5,
      fileType: "jpg"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 1,
      fileId: 1,
      fileName: "video_clip.mp4",
      fileSize: 40960, // 40 MB in KB
      uploadTime: 12.3,
      fileType: "mp4"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 1,
      fileId: 1,
      fileName: "backup.zip",
      fileSize: 66560, // 65 MB in KB
      uploadTime: 15.7,
      fileType: "zip"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 1,
      fileId: 1,
      fileName: "design_assets.psd",
      fileSize: 87040, // 85 MB in KB
      uploadTime: 17.2,
      fileType: "psd"
    });
    
    // OneDrive uploads
    this.createUpload({
      userId: 1,
      driveId: 2,
      fileId: 2,
      fileName: "notes.txt",
      fileSize: 1024, // 1 MB in KB
      uploadTime: 1.8,
      fileType: "txt"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 2,
      fileId: 2,
      fileName: "report.docx",
      fileSize: 15360, // 15 MB in KB
      uploadTime: 6.9,
      fileType: "docx"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 2,
      fileId: 2,
      fileName: "spreadsheet.xlsx",
      fileSize: 25600, // 25 MB in KB
      uploadTime: 10.3,
      fileType: "xlsx"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 2,
      fileId: 2,
      fileName: "music.mp3",
      fileSize: 40960, // 40 MB in KB
      uploadTime: 13.8,
      fileType: "mp3"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 2,
      fileId: 2,
      fileName: "software.exe",
      fileSize: 66560, // 65 MB in KB
      uploadTime: 19.1,
      fileType: "exe"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 2,
      fileId: 2,
      fileName: "project_files.zip",
      fileSize: 87040, // 85 MB in KB
      uploadTime: 22.6,
      fileType: "zip"
    });
    
    // Dropbox uploads
    this.createUpload({
      userId: 1,
      driveId: 3,
      fileId: 3,
      fileName: "invoice.pdf",
      fileSize: 2048, // 2 MB in KB
      uploadTime: 4.9,
      fileType: "pdf"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 3,
      fileId: 3,
      fileName: "image.png",
      fileSize: 15360, // 15 MB in KB
      uploadTime: 8.7,
      fileType: "png"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 3,
      fileId: 3,
      fileName: "contract.pdf",
      fileSize: 25600, // 25 MB in KB
      uploadTime: 12.1,
      fileType: "pdf"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 3,
      fileId: 3,
      fileName: "recording.wav",
      fileSize: 40960, // 40 MB in KB
      uploadTime: 17.3,
      fileType: "wav"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 3,
      fileId: 3,
      fileName: "archive.zip",
      fileSize: 66560, // 65 MB in KB
      uploadTime: 20.5,
      fileType: "zip"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 3,
      fileId: 3,
      fileName: "movie.mp4",
      fileSize: 87040, // 85 MB in KB
      uploadTime: 24.1,
      fileType: "mp4"
    });
    
    // iCloud uploads - 10 uploads
    this.createUpload({
      userId: 1,
      driveId: 4,
      fileId: 4,
      fileName: "screenshot.png",
      fileSize: 2048, // 2 MB in KB
      uploadTime: 2.4,
      fileType: "png"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 4,
      fileId: 4,
      fileName: "calendar.ics",
      fileSize: 10240, // 10 MB in KB
      uploadTime: 5.5,
      fileType: "ics"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 4,
      fileId: 4,
      fileName: "contacts.vcf",
      fileSize: 20480, // 20 MB in KB
      uploadTime: 7.2,
      fileType: "vcf"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 4,
      fileId: 4,
      fileName: "presentation.keynote",
      fileSize: 35840, // 35 MB in KB
      uploadTime: 14.7,
      fileType: "keynote"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 4,
      fileId: 4,
      fileName: "photolibrary.photoslibrary",
      fileSize: 61440, // 60 MB in KB
      uploadTime: 18.3,
      fileType: "photoslibrary"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 4,
      fileId: 4,
      fileName: "movie.mov",
      fileSize: 81920, // 80 MB in KB
      uploadTime: 23.4,
      fileType: "mov"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 4,
      fileId: 4,
      fileName: "family_photos.heic",
      fileSize: 15360, // 15 MB in KB
      uploadTime: 6.8,
      fileType: "heic"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 4,
      fileId: 4,
      fileName: "book.epub",
      fileSize: 5120, // 5 MB in KB
      uploadTime: 3.9,
      fileType: "epub"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 4,
      fileId: 4,
      fileName: "sketch_design.sketch",
      fileSize: 30720, // 30 MB in KB
      uploadTime: 11.2,
      fileType: "sketch"
    });
    
    this.createUpload({
      userId: 1,
      driveId: 4,
      fileId: 4,
      fileName: "backup.pkg",
      fileSize: 43008, // 42 MB in KB
      uploadTime: 16.7,
      fileType: "pkg"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { 
      ...user, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, newUser);
    return newUser;
  }

  // Drive operations
  async getDrives(userId: number): Promise<Drive[]> {
    return Array.from(this.drives.values())
      .filter(drive => drive.userId === userId);
  }

  async getDrive(id: number): Promise<Drive | undefined> {
    return this.drives.get(id);
  }

  async createDrive(drive: InsertDrive): Promise<Drive> {
    const id = this.driveId++;
    const newDrive: Drive = { 
      ...drive, 
      id, 
      createdAt: new Date(),
      isConnected: drive.isConnected ?? true
    };
    this.drives.set(id, newDrive);
    return newDrive;
  }

  async updateDrive(id: number, data: Partial<Drive>): Promise<Drive | undefined> {
    const drive = this.drives.get(id);
    if (!drive) return undefined;
    
    const updatedDrive: Drive = { ...drive, ...data };
    this.drives.set(id, updatedDrive);
    return updatedDrive;
  }

  async toggleDriveConnection(id: number, isConnected: boolean): Promise<Drive | undefined> {
    return this.updateDrive(id, { isConnected });
  }

  // File operations
  async getFiles(userId: number): Promise<File[]> {
    return Array.from(this.files.values())
      .filter(file => file.userId === userId && !file.deletedAt);
  }

  async getFile(id: number): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getFilesByDrive(driveId: number): Promise<File[]> {
    return Array.from(this.files.values())
      .filter(file => file.driveId === driveId && !file.deletedAt);
  }

  async getDeletedFiles(userId: number): Promise<File[]> {
    return Array.from(this.files.values())
      .filter(file => file.userId === userId && file.deletedAt);
  }

  async createFile(file: InsertFile): Promise<File> {
    const id = this.fileId++;
    const newFile: File = { 
      ...file, 
      id, 
      createdAt: new Date(),
      deletedAt: null 
    };
    this.files.set(id, newFile);
    return newFile;
  }

  async deleteFile(id: number): Promise<File | undefined> {
    const file = this.files.get(id);
    if (!file || file.deletedAt) return undefined;
    
    // Mark as deleted instead of actually deleting
    const updatedFile = { ...file, deletedAt: new Date() };
    this.files.set(id, updatedFile);
    return updatedFile;
  }
  
  async restoreFile(id: number): Promise<File | undefined> {
    const file = this.files.get(id);
    if (!file || !file.deletedAt) return undefined;
    
    // Mark as not deleted
    const updatedFile = { ...file, deletedAt: null };
    this.files.set(id, updatedFile);
    return updatedFile;
  }
  
  async permanentlyDeleteFile(id: number): Promise<boolean> {
    const file = this.files.get(id);
    if (!file || !file.deletedAt) return false;
    return this.files.delete(id);
  }

  async searchFiles(userId: number, searchTerm: string): Promise<File[]> {
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    return Array.from(this.files.values())
      .filter(file => 
        file.userId === userId && 
        !file.deletedAt &&
        (file.name.toLowerCase().includes(lowercaseSearchTerm) || 
        file.path.toLowerCase().includes(lowercaseSearchTerm) ||
        file.type.toLowerCase().includes(lowercaseSearchTerm))
      );
  }

  // Upload operations
  async getUploads(userId: number): Promise<Upload[]> {
    return Array.from(this.uploads.values())
      .filter(upload => upload.userId === userId);
  }

  async createUpload(upload: InsertUpload): Promise<Upload> {
    const id = this.uploadId++;
    const newUpload: Upload = { 
      ...upload, 
      id, 
      uploadDate: new Date() 
    };
    this.uploads.set(id, newUpload);
    return newUpload;
  }
}

export const storage = new MemStorage();
