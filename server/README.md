
# Backend Project

This project is a backend application built with Node.js, MongoDB, and JWT authentication. It provides API endpoints and middleware for secure user authentication and other backend services.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or hosted instance)
- npm (comes with Node.js) or [Yarn](https://yarnpkg.com/)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/IAMNITESHPANDIT/Hex-Ai-Asign
   cd Hex-Ai-Asign
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root of the project and add the following:

   ```plaintext
   MONGO_URI=mongodb://mongoadmin:secret@localhost:27017
   JWT_SECRET=JWT_SECRET_SUPER_SECRET
   SERVER_URL=whereserverhosted
   ```

   - **`MONGO_URI`**: Connection URI for MongoDB. Replace `localhost:27017` with your MongoDB host and `secret` with your MongoDB password.
   - **`JWT_SECRET`**: Secret key used for signing JWT tokens. Choose a strong, unique value.
   - **`SERVER_URL`**: URL where your backend server is hosted (e.g., `http://localhost:3000` for local development).

4. **Run the application:**

   ```bash
   npm start
   ```

   By default, the server will start on port `5000` (or specified in your server configuration).

## API Documentation

The backend provides the following primary API endpoints:

- **Authentication**
  - `POST /api/auth/login` - Log in a user and retrieve a JWT token.
  - `POST /api/auth/register` - Register a new user.

- **Protected Routes**
  - These routes require a valid JWT token.
  - Example: `GET /api/user/profile` - Retrieve user profile data.

## Project Structure

The project structure follows a standard Node.js backend setup:

```plaintext
├── controllers      # Contains all the request handlers
├── models           # MongoDB models
├── routes           # Express routes
├── middleware       # Authentication and other middleware
├── config           # Configuration files (e.g., database connection)
└── server.js        # Entry point of the application
```

## Environment Variables

Ensure you have the following variables set in your `.env` file:

| Variable     | Description                           |
|--------------|---------------------------------------|
| MONGO_URI    | MongoDB connection string             |
| JWT_SECRET   | Secret key for JWT token generation   |
| SERVER_URL   | The URL where your server is hosted   |

## Security Recommendations

- **Never expose `JWT_SECRET`** in public repositories.
- Use strong and unique values for your environment variables, especially for sensitive keys like `JWT_SECRET`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
