
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname).toLowerCase()}`;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed."));
    }
  },
});

const Application = require("./models/Application");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}
app.use((req, res, next) => {
  console.log("INCOMING REQUEST:", req.method, req.url);
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Basic route
app.get("/", (req, res) => {
  res.json({ message: "AICTE Workflow Backend is running!" });
});

// Health-check route
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, institutionName, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
  name: name.trim(),
  institutionName: institutionName?.trim() || "",
  email: normalizedEmail,
  password: hashedPassword,
  role: "institution",
});

    return res.status(201).json({
      success: true,
      message: "Institution account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        institutionName: user.institutionName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not create the account.",
    });
  }
});

console.log("LOGIN ROUTE REGISTERED");
app.post("/api/auth/login", async (req, res) => {
  console.log("LOGIN REQUEST RECEIVED");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from backend environment.");
      return res.status(500).json({
        success: false,
        message: "Server authentication is not configured.",
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not log in.",
    });
  }
});
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
  });
});

// Get all applications
app.get("/api/applications", verifyToken, async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch applications",
    });
  }
});


 // Create an application

app.post("/api/applications", verifyToken, async (req, res) => {
  try {
    const {
      institutionName,
      institutionId,
      address,
      state,
      affiliation,
      applicationType,
      academicYear,
      courses,
      intake,
      status,
    } = req.body;

    if (
      !institutionName?.trim() ||
      !applicationType?.trim() ||
      !academicYear?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Institution name, application type, and academic year are required",
      });
    }

    const application = await Application.create({
      institutionName: institutionName.trim(),
      institutionId: institutionId || "",
      address: address || "",
      state: state || "",
      affiliation: affiliation || "",
      applicationType: applicationType.trim(),
      academicYear,
      courses: courses || "",
      intake: intake === "" || intake == null ? null : Number(intake),
      status: status === "Submitted" ? "Submitted" : "Draft",
    });

    res.status(201).json({
      success: true,
      message: "Application saved successfully",
      data: application,
    });
  } catch (error) {
    console.error("Create application error:", error.message);

    res.status(400).json({
      success: false,
      message: "Could not save application. Please check the details.",
    });
  }
});

// Update an application

app.put("/api/applications/:id",verifyToken, async (req, res) => {
  try {
    const {
      institutionName,
      institutionId,
      address,
      state,
      affiliation,
      applicationType,
      academicYear,
      courses,
      intake,
      status,
      reviewerComments,
    } = req.body;

    const updateData = {
      institutionName,
      institutionId,
      address,
      state,
      affiliation,
      applicationType,
      academicYear,
      courses,
      intake: intake === "" || intake == null ? null : Number(intake),
    };

    if (
  [
    "Draft",
    "Submitted",
    "Under Review",
    "Approved",
    "Rejected",
    "Returned for Corrections",
  ].includes(status)
) {
  updateData.status = status;
}

if (typeof reviewerComments === "string") {
  updateData.reviewerComments = reviewerComments;
}

if (typeof reviewerComments === "string") {
  updateData.reviewerComments = reviewerComments;
}
    if (typeof reviewerComments === "string") {
      updateData.reviewerComments = reviewerComments;
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      message: "Application updated successfully",
      data: application,
    });
  } catch (error) {
    console.error("Update application error:", error.message);

    res.status(400).json({
      success: false,
      message: "Could not update application",
    });
  }
});



// Delete an application
app.delete("/api/applications/:id", verifyToken, async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not delete application",
    });
  }
});

// Upload a supporting document

app.post(
  "/api/applications/:id/upload",verifyToken,
  (req, res, next) => {
    upload.single("document")(req, res, (error) => {
      if (error) {
        if (
          error instanceof multer.MulterError &&
          error.code === "LIMIT_FILE_SIZE"
        ) {
          return res.status(400).json({
            success: false,
            message: "File size must not exceed 5 MB.",
          });
        }

        return res.status(400).json({
          success: false,
          message: error.message || "Document upload failed.",
        });
      }

      next();
    });
  },
  async (req, res) => {
    let uploadedPath;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a document to upload.",
        });
      }

      uploadedPath = path.join(__dirname, "uploads", req.file.filename);

      const application = await Application.findById(req.params.id);

      if (!application) {
        const fs = require("fs");
        fs.unlink(uploadedPath, () => {});

        return res.status(404).json({
          success: false,
          message: "Application not found.",
        });
      }

      application.document = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size,
      };

      await application.save();

      res.status(200).json({
        success: true,
        message: "Document uploaded and linked successfully!",
        data: application,
      });
    } catch (error) {
      console.error("Document upload error:", error.message);

      if (uploadedPath) {
        const fs = require("fs");
        fs.unlink(uploadedPath, () => {});
      }

      res.status(500).json({
        success: false,
        message: "Could not link the document to the application.",
      });
    }
  }
);

// Start server after MongoDB connects
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
