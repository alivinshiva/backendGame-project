/*
==================== NOTES ====================
File: multer.middleware.js

Why use this file:
- Handles file uploads from client requests using Multer middleware.
- Centralizes upload logic for images, videos, and other files to a temporary server directory.
- Ensures consistent file naming and storage location for further processing (e.g., upload to Cloudinary).

How it works:
- Configures Multer to store files in './public/temp' with their original names.
- Exports an 'upload' middleware to be used in Express routes for handling file uploads.

What if we don't use this file:
- File uploads would need to be handled manually in each route/controller.
- Increased risk of inconsistent file handling and naming.
- Harder to maintain and update upload logic across the project.
==============================================
*/
import multer from "multer"



// Configure Multer storage: destination and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  // Store uploaded files in './public/temp'
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
  // Use the original file name for storage
    cb(null, file.originalname)
  }
})

// Export the upload middleware for use in routes
export const upload = multer({ storage })