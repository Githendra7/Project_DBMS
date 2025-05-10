const db = require('../config/db');

class AttendanceModel {
    static async getClasses() {
        const query = 'SELECT id, class_number FROM classes ORDER BY class_number';
        const { rows } = await db.query(query);
        return rows;
    }

    static async getStudentsByClass(classId) {
        const query = `
            SELECT id, roll_no, name 
            FROM students 
            WHERE class_id = $1
            ORDER BY roll_no
        `;
        const result = await db.query(query, [classId]);
        return result.rows;
    }

    static async submitAttendance(records) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');
            
            for (const record of records) {
                const query = `
                    INSERT INTO attendance (student_id, date, status)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (student_id, date) 
                    DO UPDATE SET status = EXCLUDED.status
                `;
                await client.query(query, [
                    record.studentId,
                    record.date,
                    record.status
                ]);
            }
            
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    static async getAbsentees(classId, date) {
        const query = `
            SELECT s.id, s.roll_no, s.name
            FROM students s
            JOIN attendance a ON s.id = a.student_id
            WHERE s.class_id = $1
            AND a.date = $2
            AND a.status = 'Absent'
            ORDER BY s.roll_no
        `;
        const result = await db.query(query, [classId, date]);
        return result.rows;
    }
}

module.exports = AttendanceModel;