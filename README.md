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

1. Clone the repository:

    ```bash
    git clone https://github.com/maheshmeenabalot/intelligent-task-manager/
    ```

2. Navigate into the client directory:

    ```bash
    cd client
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

### Dependencies

- Express
- MongoDB
- Mongoose
- Socket.io
- Bcrypt.js
- JSON Web Token (jsonwebtoken)
- Dotenv

## Deployment

The frontend is deployed using Netlify, and the backend is deployed using Render.

## License

This project is licensed under the ISC License. See the LICENSE file for details.
