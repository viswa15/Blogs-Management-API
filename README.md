# Blog Management System API

This is a RESTful API built with Node.js and Express.js. The API supports user authentication, role-based access control, and comprehensive blog and comment management functionalities.

## API Endpoints

### User Routes

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | /api/users/register | Register a new user | Public |
| POST | /api/users/login | Login and get JWT token | Public |
| GET | /api/users/profile | Get user profile | Private |

### Blog Routes

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | /api/blogs | Create a new blog | Admin |
| GET | /api/blogs | Get all blogs | Public |
| GET | /api/blogs/:id | Get a single blog | Public |
| PUT | /api/blogs/:id | Update a blog | Admin/Editor |
| DELETE | /api/blogs/:id | Delete a blog | Admin |

### Comment Routes

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | /api/blogs/:blogId/comments | Add a comment to a blog | User |
| DELETE | /api/blogs/:blogId/comments/:commentId | Delete a user's own comment | User |

## Project Setup

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory and install dependencies: `npm install`
3. Create a `.env` file with the following variables:

The following packages are used in this project, as specified in the `package.json` file:

- **bcrypt**: "^5.1.1" - For password hashing.
- **bcryptjs**: "^2.4.3" - Alternative library for password hashing.
- **body-parser**: "^1.20.3" - Middleware for parsing incoming request bodies.
- **cors**: "^2.8.5" - Middleware for enabling Cross-Origin Resource Sharing.
- **dotenv**: "^16.4.7" - Loads environment variables from a `.env` file.
- **express**: "^4.21.2" - Web framework for Node.js.
- **jsonwebtoken**: "^9.0.2" - For creating and verifying JWT tokens.
- **mongoose**: "^8.9.5" - MongoDB object modeling tool.
- **nodemailer**: "^6.9.16" - For sending emails.
- **nodemon**: "^3.1.9" - Utility for automatically restarting the server when file changes are detected.