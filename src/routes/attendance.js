const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/attendance');

router.get('/classes', AttendanceController.getClasses);
router.get('/students/:classId', AttendanceController.getStudentsByClass);
router.post('/attendance/submit', AttendanceController.submitAttendance);
router.get('/attendance/absentees', AttendanceController.getAbsentees);

module.exports = router;