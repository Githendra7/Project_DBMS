
export interface Student {
  id: number;
  roll_no: string;
  name: string;
  class_id: number;
}

export interface Class {
  id: number;
  class_number: string;
}

export interface AbsenteeRecord {
  id: number;
  roll_no: string;
  name: string;
  date: string;
}

export interface AttendanceRecord {
  student_id: number;
  status: 'Present' | 'Absent';
}
