
# College Attendance Management System

A complete attendance management system for colleges with features for marking attendance and generating absentee reports.

## Project Structure

- Frontend: React with Tailwind CSS
- Backend: Node.js with Express.js
- Database: MySQL

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL database

### Setting Up the Database

1. Create a MySQL database named `attendance_db`
2. Configure the database connection in `src/server/server.js`

### Running the Backend Server

1. Install necessary dependencies:
```
npm install express cors body-parser mysql2
```

2. Navigate to the server directory:
```
cd src/server
```

3. Start the backend server:
```
node server.js
```
The server will run on port 3001.

### Running the Frontend Application

1. In a new terminal, start the frontend:
```
npm run dev
```
The application will be accessible at http://localhost:8080

## Features

- Mark attendance for students by class
- View absentee reports by class and date
- Simple and intuitive user interface

## Database Schema

- **classes**: id, class_number
- **students**: id, roll_no, name, class_id
- **attendance**: id, student_id, date, status

## API Endpoints

- **POST /submit-attendance**: Record attendance data
- **GET /absentees**: Get list of absent students by class and date
- **GET /students-by-class**: Get list of students in a class
- **GET /classes**: Get list of all classes

## Frontend Pages

1. **Dashboard**: Navigate to attendance marking or absentee reports
2. **Mark Attendance**: Select class, date and mark students as present/absent
3. **Absentee Report**: View absent students by class and date
