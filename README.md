# Intelligent Task Manager

The **Intelligent Task Manager** is a project designed to streamline task management and collaboration. It includes both a frontend (built with React) and a backend (implemented in Node.js). The goal is to enhance productivity through efficient task organization, real-time updates, and user-friendly features.

## Features

1. **Task Management:**
   - Create, edit, delete, and search tasks.
   - Filter tasks by status and priority.
   - Add collaborators to tasks.

2. **Real-Time Updates:**
   - Utilizes Socket.io for real-time task updates.

3. **User Authentication:**
   - Secure authentication with JSON Web Tokens (JWT).

4. **Responsive Design:**
   - User-friendly interface for both desktop and mobile.

## Live Demo

Check out the live demo: [Intelligent Task Manager](https://intelligent-task-manager.netlify.app/)

You can register as a user and explore the site and all its features. The backend is live at: [Backend API](https://intelligent-task-manager-2.onrender.com)

## Frontend (React)

### Client Installation

1. Clone the frontend repository:

    ```bash
    git clone https://github.com/maheshmeenabalot/intelligent-task-manager-frontend
    ```

2. Navigate into the client directory:

    ```bash
    cd intelligent-task-manager-frontend
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Run the development server:

    ```bash
    npm start
    ```

    You can now view the app in your browser:

    - Local: http://localhost:3000
    - On Your Network: http://192.168.137.1:3000

    Note that the development build is not optimized. To create a production build, use:

    ```bash
    npm run build
    ```

## Backend (Node.js)

### Server Installation
#### Prerequisites

- Node.js
- npm (Node Package Manager)
- MongoDB (local or cloud instance)

1. Navigate into the server directory:

    ```bash
    cd server
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the server in development mode:

    ```bash
    npm run dev
    ```

### Project Structure


### Dependencies

- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database.
- **Mongoose**: MongoDB object modeling tool.
- **Socket.io**: Real-time bidirectional event-based communication.
- **Bcrypt.js**: Library for hashing passwords.
- **JSON Web Token (jsonwebtoken)**: Implementation of JSON Web Tokens.
- **Dotenv**: Module for loading environment variables from a `.env` file.
- **config/**: Configuration files for database and other settings.
- **controllers/**: Request handlers for various routes.
- **models/**: Mongoose models for MongoDB collections.
- **routes/**: API route definitions.
- **middleware/**: Custom middleware functions.

## Deployment

The frontend is deployed using Netlify, and the backend is deployed using Render.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code adheres to the project's coding standards and passes all tests.

## License

This project is licensed under the ISC License. See the LICENSE file for details.

## Additional Resources

For the full project, including the backend code and detailed documentation, visit the main repository: [Intelligent Task Manager](https://github.com/maheshmeenabalot/intelligent-task-manager)
