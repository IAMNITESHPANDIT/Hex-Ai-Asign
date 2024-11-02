# UI

This project is a frontend application built with React. It serves as the user interface for the backend services and allows users to interact with the application seamlessly.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
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
   REACT_APP_BASE_AUTH=https://hex-ai-asign.onrender.com
   ```

   - **`REACT_APP_BASE_AUTH`**: Base URL for the backend authentication service.

4. **Run the application:**

   ```bash
   npm start
   ```

   By default, the application will start on [http://localhost:3000](http://localhost:3000).

## Project Structure

The project structure follows a standard React setup:

```plaintext
├── src
│   ├── components      # Reusable React components
│   ├── pages           # Application pages
│   ├── redux           # Redux store and slices
│   ├── utils           # Utility functions and helpers
│   ├── assets          # Static assets (images, fonts, etc.)
│   └── App.js          # Main application component
├── public              # Public assets
└── package.json        # Project metadata and dependencies
```

## Features

- User authentication (login, registration)
- User profile management
- Activity logging
- Responsive design

## API Documentation

The frontend communicates with the following API endpoints:

- **Authentication**

  - `POST /api/auth/login` - Log in a user and retrieve a JWT token.
  - `POST /api/auth/register` - Register a new user.

- **User Data**
  - `GET /api/user/profile` - Retrieve user profile data.

## Running Tests

To run the test suite for this application, use:

```bash
npm test
```

## Security Recommendations

- Ensure that sensitive information (like API keys) is stored securely and not exposed in the codebase.
- Use HTTPS for API requests in production environments.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
