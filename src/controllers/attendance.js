const AttendanceModel = require('../models/attendance');

class AttendanceController {
    static async getClasses(req, res) {
        try {
            const classes = await AttendanceModel.getClasses();
            if (!classes || classes.length === 0) {
                return res.status(404).json({ error: 'No classes found' });
            }
            res.json(classes);
        } catch (error) {
            console.error('Error in getClasses:', error);
            res.status(500).json({ error: 'Failed to fetch classes' });
        }
    }

    static async getStudentsByClass(req, res) {
        try {
            const classId = parseInt(req.params.classId);
            const students = await AttendanceModel.getStudentsByClass(classId);
            res.json(students);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async submitAttendance(req, res) {
        try {
            const records = req.body;
            await AttendanceModel.submitAttendance(records);
            res.json({ message: 'Attendance submitted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAbsentees(req, res) {
        try {
            const { classId, date } = req.query;
            const absentees = await AttendanceModel.getAbsentees(
                parseInt(classId),
                date
            );
            res.json(absentees);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = AttendanceController;