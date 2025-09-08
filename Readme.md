# backendGame-project

This repository is the **backend setup for Chai-Code**, a Node.js/Express-based server application that manages user authentication, file uploads, and user-related functionalities for a game or media platform.

## Features

- **User Authentication**: Register, login, password change, and secure JWT-based authentication.
- **User Profiles**: Manage user information, avatars, and cover images.
- **File Uploads**: Handle image and video uploads using Multer middleware and Cloudinary integration.
- **Standardized API Responses**: Consistent API response format for easy frontend integration.
- **MongoDB Integration**: Models for users and videos, using Mongoose schemas and methods.
- **Watch History & Channel Info**: Endpoints for user channel profiles and watch history.
- **Clean Project Structure**: Separation of concerns using controllers, models, routes, and middlewares.

## Technologies Used

- **Node.js** & **Express**: REST API server framework.
- **MongoDB** with **Mongoose**: Database for storing users, videos, and related data.
- **JWT**: For authentication and refresh tokens.
- **Multer**: For handling file uploads.
- **Cloudinary**: Cloud storage for images/videos.
- **dotenv**: Environment variable management.
- **bcrypt**: Password hashing for security.
- **CORS & Cookie Parser**: Middleware for security and session handling.

## Project Structure

```
src/
  ├── app.js                # Express app setup and middleware
  ├── index.js              # Main entry point (server startup)
  ├── controllers/          # Business logic (user, video, etc.)
  ├── models/               # Mongoose schemas (User, Video)
  ├── routes/               # API route definitions
  ├── middlewares/          # Custom middlewares (Multer, etc.)
  ├── utils/                # Utilities (Cloudinary, API Response)
  └── constants.js          # Project-wide constants
```

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alivinshiva/backendGame-project.git
   cd backendGame-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   - Create a `.env` file in the root directory with your MongoDB, JWT, and Cloudinary credentials.

   ```env
   MONGODB_URI=your_mongodb_connection
   JWT_ACCESS_TOKEN=your_jwt_access_token
   ACCESS_TOKEN_EXPRY=1d
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Run the server:**
   ```bash
   npm start
   ```

## API Endpoints

- `POST /users/register` — Register a new user (with avatar and optional cover image).
- `POST /users/login` — User login.
- `POST /users/change-password` — Change password.
- `GET /users/me` — Get current user profile.
- `GET /users/:username/channel` — Get user channel info.
- `GET /users/watch-history` — Get user watch history.

## Notes

- File uploads are stored temporarily on the server before being uploaded to Cloudinary.
- All business logic is handled in controllers; route files only map URLs to controllers for maintainability.

## License

This project is for learning and demonstration purposes.
