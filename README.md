# TaskManager (MERN Stack Project)

**TaskManager** is a full-featured task management web application built with the MERN stack (MongoDB, Express.js, React, Node.js). It supports user authentication, task assignment, progress tracking, reporting, and file uploads, making it ideal for teams and individuals to manage their workflow efficiently.

## 🚀 Features

- User authentication (JWT-based)
- Role-based access (Admin & User)
- Create, assign, and manage tasks
- Task status tracking and progress visualization
- File attachments for tasks
- Interactive dashboard with charts and statistics
- Export reports (Excel support)
- Modern, responsive UI (React + TailwindCSS)

## 🛠️ Technologies Used

- MongoDB
- Express.js
- React
- Node.js
- JWT
- Mongoose
- TailwindCSS
- Axios
- Recharts
- Multer
- ExcelJS

## 📁 Folder Structure

```
.
├── Backend
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
├── Frontend
│   └── Task-Manager
│       ├── public/
│       ├── src/
│       ├── package.json
│       └── ...
├── screenshots/
│   ├── Screenshot 2025-06-27 221138.png
│   ├── Screenshot 2025-06-27 221211.png
│   ├── Screenshot 2025-06-27 221232.png
│   ├── Screenshot 2025-06-27 221250.png
│   ├── Screenshot 2025-06-27 221256.png
│   ├── Screenshot 2025-06-27 221332.png
│   ├── Screenshot 2025-06-27 221356.png
│   ├── Screenshot 2025-06-27 221412.png
│   ├── Screenshot 2025-06-27 221421.png
│   └── Screenshot 2025-06-27 221434.png
└── README.md (this file)
```

## ⚙️ Setup Instructions

### Backend

1. Navigate to `Backend/` and install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file with your MongoDB URI and other configs (see `config/db.js`).
3. Start the server:
   ```sh
   npm run dev
   ```

### Frontend

1. Navigate to `Frontend/Task-Manager/` and install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
3. Visit [http://localhost:5173](http://localhost:5173) (or as shown in your terminal)

## 🖥️ Usage

- Sign up or log in as a user or admin
- Create and assign tasks
- Track progress and update statuses
- Upload attachments to tasks
- View analytics and reports on the dashboard

## 📸 Screenshots

### User Pages

| ![User Page 1](screenshots/Screenshot%202025-06-27%20221138.png) | ![User Page 2](screenshots/Screenshot%202025-06-27%20221211.png) | ![User Page 3](screenshots/Screenshot%202025-06-27%20221232.png) |
| :--------------------------------------------------------------: | :--------------------------------------------------------------: | :--------------------------------------------------------------: |
|                           User Page 1                            |                           User Page 2                            |                           User Page 3                            |

### Auth Pages

| ![Auth Page 1](screenshots/Screenshot%202025-06-27%20221250.png) | ![Auth Page 2](screenshots/Screenshot%202025-06-27%20221256.png) |
| :--------------------------------------------------------------: | :--------------------------------------------------------------: |
|                           Auth Page 1                            |                           Auth Page 2                            |

### Admin Pages

| ![Admin Page 1](screenshots/Screenshot%202025-06-27%20221332.png) | ![Admin Page 2](screenshots/Screenshot%202025-06-27%20221356.png) | ![Admin Page 3](screenshots/Screenshot%202025-06-27%20221412.png) |
| :---------------------------------------------------------------: | :---------------------------------------------------------------: | :---------------------------------------------------------------: |
|                           Admin Page 1                            |                           Admin Page 2                            |                           Admin Page 3                            |
| ![Admin Page 4](screenshots/Screenshot%202025-06-27%20221421.png) | ![Admin Page 5](screenshots/Screenshot%202025-06-27%20221434.png) |
|                           Admin Page 4                            |                           Admin Page 5                            |

_All screenshots are from the `screenshots/` folder in the project root._

## 📄 License

This project is licensed under the MIT License.

## 🙌 Credits

Developed by **Omar.T.Temsah** and contributors.
