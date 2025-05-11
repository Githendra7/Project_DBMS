
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { API_URL } from "@/config/constants";
import { Student, Class } from "@/types/types";

const MarkAttendance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceData, setAttendanceData] = useState<
    {
      id: number;
      roll_no: string;
      name: string;
      isPresent: boolean;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Replace the first useEffect with real API call
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/classes`);
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast({
          title: "Error",
          description: "Failed to fetch classes. Please try again.",
          variant: "destructive"
        });
      }
    };
    fetchClasses();
  }, []);
  
  // Replace the second useEffect with real API call
  useEffect(() => {
    if (selectedClass) {
      setIsLoading(true);
      const fetchStudents = async () => {
        try {
          const response = await fetch(`${API_URL}/api/students/${selectedClass}`);
          const students = await response.json();
          
          const initialAttendanceData = students.map(student => ({
            id: student.id,
            roll_no: student.roll_no,
            name: student.name,
            isPresent: true
          }));
          
          setStudents(students);
          setAttendanceData(initialAttendanceData);
        } catch (error) {
          console.error('Error fetching students:', error);
          toast({
            title: "Error",
            description: "Failed to fetch students. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchStudents();
    }
  }, [selectedClass]);

  const handleToggleAttendance = (studentId: number) => {
    setAttendanceData(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, isPresent: !student.isPresent }
          : student
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedClass || !attendanceDate) {
      toast({
        title: "Validation Error",
        description: "Please select a class and date",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const records = attendanceData.map(student => ({
        studentId: student.id,
        date: attendanceDate,
        status: student.isPresent ? 'Present' : 'Absent'
      }));

      const response = await fetch(`${API_URL}/api/attendance/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(records)
      });

      if (!response.ok) {
        throw new Error('Failed to submit attendance');
      }

      toast({
        title: "Success",
        description: "Attendance submitted successfully"
      });

      // Navigate to absentee report with query parameters
      navigate(`/absentee-report?classId=${selectedClass}&date=${attendanceDate}`);
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast({
        title: "Error",
        description: "Failed to submit attendance. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAll = (present: boolean) => {
    setAttendanceData(prev =>
      prev.map(student => ({
        ...student,
        isPresent: present
      }))
    );
  };

  // Add these buttons in the JSX before the student list
  <div className="flex gap-4 mb-4">
    <Button onClick={() => handleMarkAll(true)} variant="outline">
      Mark All Present
    </Button>
    <Button onClick={() => handleMarkAll(false)} variant="outline">
      Mark All Absent
    </Button>
  </div>

  const handleViewAbsenteeReport = () => {
    if (!selectedClass || !attendanceDate) {
      toast({
        title: "Validation Error",
        description: "Please select a class and date",
        variant: "destructive"
      });
      return;
    }
    navigate(`/absentee-report?classId=${selectedClass}&date=${attendanceDate}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-primary text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Mark Attendance</h1>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={handleViewAbsenteeReport} 
              className="text-white border-white hover:text-primary hover:bg-white"
              disabled={!selectedClass || !attendanceDate || isSubmitting}
            >
              View Absentee Report
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")} 
              className="text-white border-white hover:text-primary hover:bg-white"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Card className="p-6 shadow-md max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="class-select">Select Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class-select" className="mt-2">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.class_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-input">Date</Label>
              <Input
                id="date-input"
                type="date"
                className="mt-2"
                value={attendanceDate}
                onChange={e => setAttendanceDate(e.target.value)}
              />
            </div>
          </div>

          {selectedClass && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Student Attendance
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleMarkAll(true)}>
                    Mark All Present
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleMarkAll(false)}>
                    Mark All Absent
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8">Loading students...</div>
              ) : attendanceData.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="py-3 px-4 text-left font-medium">Roll No.</th>
                        <th className="py-3 px-4 text-left font-medium">Name</th>
                        <th className="py-3 px-4 text-center font-medium">Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map(student => (
                        <tr key={student.id} className="border-t">
                          <td className="py-3 px-4">{student.roll_no}</td>
                          <td className="py-3 px-4">{student.name}</td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center items-center gap-3">
                              <span className={`text-sm ${student.isPresent ? 'text-green-600' : 'text-red-600'}`}>
                                {student.isPresent ? 'Present' : 'Absent'}
                              </span>
                              <Switch
                                checked={student.isPresent}
                                onCheckedChange={() => handleToggleAttendance(student.id)}
                                className={student.isPresent ? "bg-green-600" : ""}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No students found for this class.
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || attendanceData.length === 0}
                  className="px-8"
                >
                  {isSubmitting ? "Submitting..." : "Submit Attendance"}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default MarkAttendance;
