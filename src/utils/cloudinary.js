/*
==================== NOTES ====================
File: cloudinary.js

Why use this file:
- Handles file uploads to Cloudinary, a cloud-based media management service.
- Centralizes upload logic for images, videos, and other files.
- Ensures files are removed from local server if upload fails, keeping storage clean.

How it works:
- Configures Cloudinary with credentials from environment variables.
- Defines an async function to upload a local file to Cloudinary.
- Returns the uploaded file's URL on success, or removes the file locally on failure.

What if we don't use this file:
- File uploads would need to be handled manually in each route/controller.
- Increased risk of inconsistent upload logic and server storage issues.
- Harder to maintain and update upload logic across the project.
==============================================
*/
// import { v2 } from "cloudinary";
// import fs from 'fs'

// // Configure Cloudinary with credentials from .env
// v2.config({ 
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY, 
//   api_secret: process.env.API_SECRET
// });
import dotenv from 'dotenv'
dotenv.config({
    path: './.env'
})
import { v2 } from "cloudinary";
import fs from 'fs';

v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Async function to upload a file to Cloudinary
const uploadFileCloudinary = async (localFilePath) => {
    try {
        // if file path not found. return null
        if(!localFilePath) return null
        // uploading to cloudinary.
        const response = await v2.uploader.upload(localFilePath, {
            resource_type: "auto",
        })
        // file upload succesful.
        console.log("File upload on cloudinary");
        return response.url
    } catch (error) {
    // Remove file from local server if upload fails
        fs.unlinkSync(localFilePath) // it will remove the file from the server if it not uploaded to cloudinary.
        console.log("uploading error: ", error);
        
    }
}

console.log(process.env.CLOUD_NAME, process.env.API_KEY, process.env.API_SECRET);

// Export the upload function for use in controllers/routes
export {uploadFileCloudinary}