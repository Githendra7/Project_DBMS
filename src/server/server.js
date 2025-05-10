
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
// In a real application, this should be stored in environment variables
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'attendance_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database with dummy data
const initializeDb = async () => {
  try {
    const connection = pool.promise();
    
    // Create tables if they don't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS classes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        class_number VARCHAR(10) NOT NULL UNIQUE
      )
    `);
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        roll_no VARCHAR(10) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        class_id INT NOT NULL,
        FOREIGN KEY (class_id) REFERENCES classes(id)
      )
    `);
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        date DATE NOT NULL,
        status ENUM('Present', 'Absent') NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(id),
        UNIQUE KEY (student_id, date)
      )
    `);
    
    // Insert dummy data for classes
    const [classes] = await connection.execute('SELECT * FROM classes');
    if (classes.length === 0) {
      await connection.execute(`
        INSERT INTO classes (class_number) VALUES 
        ('CS101'),
        ('CS102'),
        ('MA101')
      `);
      
      // Get inserted classes
      const [insertedClasses] = await connection.execute('SELECT * FROM classes');
      
      // Insert dummy students for each class
      for (const cls of insertedClasses) {
        if (cls.class_number === 'CS101') {
          await connection.execute(`
            INSERT INTO students (roll_no, name, class_id) VALUES
            ('CS101-01', 'John Doe', ?),
            ('CS101-02', 'Jane Smith', ?),
            ('CS101-03', 'Alice Johnson', ?)
          `, [cls.id, cls.id, cls.id]);
        } else if (cls.class_number === 'CS102') {
          await connection.execute(`
            INSERT INTO students (roll_no, name, class_id) VALUES
            ('CS102-01', 'Bob Brown', ?),
            ('CS102-02', 'Charlie Davis', ?)
          `, [cls.id, cls.id]);
        } else if (cls.class_number === 'MA101') {
          await connection.execute(`
            INSERT INTO students (roll_no, name, class_id) VALUES
            ('MA101-01', 'David Wilson', ?),
            ('MA101-02', 'Emma Harris', ?),
            ('MA101-03', 'Frank Miller', ?)
          `, [cls.id, cls.id, cls.id]);
        }
      }
    }
    
    console.log('Database initialized with dummy data');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize DB when server starts
initializeDb();

// API Routes

// POST /submit-attendance
app.post('/submit-attendance', async (req, res) => {
  const { class_id, date, attendance } = req.body;
  
  if (!class_id || !date || !attendance || !Array.isArray(attendance)) {
    return res.status(400).json({ error: 'Invalid request data' });
  }
  
  const connection = await pool.promise().getConnection();
  
  try {
    await connection.beginTransaction();
    
    for (const record of attendance) {
      const { student_id, status } = record;
      
      // Delete any existing attendance record for this student on this date
      await connection.execute(
        'DELETE FROM attendance WHERE student_id = ? AND date = ?',
        [student_id, date]
      );
      
      // Insert the new attendance record
      await connection.execute(
        'INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)',
        [student_id, date, status]
      );
    }
    
    await connection.commit();
    res.status(201).json({ message: 'Attendance records created successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error submitting attendance:', error);
    res.status(500).json({ error: 'Failed to submit attendance' });
  } finally {
    connection.release();
  }
});

// GET /absentees
app.get('/absentees', async (req, res) => {
  const { class_id, date } = req.query;
  
  if (!class_id || !date) {
    return res.status(400).json({ error: 'Class ID and date are required' });
  }
  
  try {
    const [rows] = await pool.promise().execute(`
      SELECT s.id, s.roll_no, s.name, a.date
      FROM students s
      INNER JOIN attendance a ON s.id = a.student_id
      WHERE s.class_id = ? AND a.date = ? AND a.status = 'Absent'
      ORDER BY s.roll_no
    `, [class_id, date]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching absentees:', error);
    res.status(500).json({ error: 'Failed to fetch absentee data' });
  }
});

// GET /students-by-class
app.get('/students-by-class', async (req, res) => {
  const { class_id } = req.query;
  
  if (!class_id) {
    return res.status(400).json({ error: 'Class ID is required' });
  }
  
  try {
    const [rows] = await pool.promise().execute(`
      SELECT id, roll_no, name, class_id
      FROM students
      WHERE class_id = ?
      ORDER BY roll_no
    `, [class_id]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students data' });
  }
});

// GET /classes
app.get('/classes', async (req, res) => {
  try {
    const [rows] = await pool.promise().execute('SELECT * FROM classes ORDER BY class_number');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
