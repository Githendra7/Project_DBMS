
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-primary text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">College Attendance System</h1>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="shadow-md transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Mark Attendance</CardTitle>
              <CardDescription>Record attendance for a class</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">
                Select a class, enter the date, and mark students as present or absent.
              </p>
              <Button onClick={() => navigate("/mark-attendance")} className="w-full">
                Go to Attendance
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Absentee Report</CardTitle>
              <CardDescription>View absentee data for classes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">
                Check which students were absent by selecting a class and date.
              </p>
              <Button onClick={() => navigate("/absentee-report")} className="w-full">
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
