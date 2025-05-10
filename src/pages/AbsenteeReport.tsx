
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/config/constants";
import { Class, AbsenteeRecord } from "@/types/types";

const AbsenteeReport = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [absentees, setAbsentees] = useState<AbsenteeRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Replace the first useEffect with real API call
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/classes`);
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);
  
  // Update fetchAbsentees to use real API
  const fetchAbsentees = async () => {
    if (!selectedClass || !date) return;
  
    setIsLoading(true);
    setHasSearched(true);
  
    try {
      const response = await fetch(
        `${API_URL}/api/attendance/absentees?classId=${selectedClass}&date=${date}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch absentees');
      }
      
      const data = await response.json();
      setAbsentees(data);
    } catch (error) {
      console.error('Error fetching absentees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-primary text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Absentee Report</h1>
          <Button variant="outline" onClick={() => navigate("/")} className="text-white border-white hover:text-primary hover:bg-white">
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Card className="p-6 shadow-md max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={fetchAbsentees} 
                disabled={!selectedClass || !date || isLoading}
                className="w-full"
              >
                {isLoading ? "Loading..." : "Get Report"}
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Absentee List</h2>
            
            {isLoading ? (
              <div className="text-center py-8">Loading data...</div>
            ) : hasSearched ? (
              absentees.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="py-3 px-4 text-left font-medium">Roll No.</th>
                        <th className="py-3 px-4 text-left font-medium">Name</th>
                        <th className="py-3 px-4 text-left font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {absentees.map(student => (
                        <tr key={student.id} className="border-t">
                          <td className="py-3 px-4">{student.roll_no}</td>
                          <td className="py-3 px-4">{student.name}</td>
                          <td className="py-3 px-4">{new Date(student.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg bg-gray-50">
                  <p className="text-gray-500">No absences found for the selected date and class.</p>
                  <p className="text-gray-500 text-sm mt-1">All students were present.</p>
                </div>
              )
            ) : (
              <div className="text-center py-8 border rounded-lg bg-gray-50">
                <p className="text-gray-500">Select a class and date, then click "Get Report" to view absences.</p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AbsenteeReport;
