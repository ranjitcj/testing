import { NextRequest, NextResponse } from 'next/server';

// Define interfaces for type safety
interface AttendanceRecord {
  status: string;
}

interface SubjectAttendance {
  subject: string;
  attendance: AttendanceRecord[];
  attendancePercentage?: number;
}

interface AttendanceData {
  attendance_data: SubjectAttendance[];
}

// Function to determine class code and start roll
function getClassAssignment(rollno: string): { classcode: string; startroll: string } {
  const roll = Number(rollno);

  if (roll >= 1 && roll <= 74) {
    return { classcode: "CSA", startroll: "1" };
  } else if (roll >= 75 && roll <= 148) {
    return { classcode: "CSB", startroll: "75" };
  } else if (roll >= 149 && roll <= 223) {
    return { classcode: "CSC", startroll: "149" };
  }

  throw new Error("Invalid roll number");
}

// Fetch attendance from Google Apps Script or backend
async function fetchAttendanceData(rollno: string): Promise<AttendanceData> {
  try {
    // Get class assignment details
    const { classcode, startroll } = getClassAssignment(rollno);

    const url = `https://script.google.com/macros/s/AKfycbxCtcHvxpj_uQTDhwwAsE5ItuVqArRerEemFQXWmH1fOJkXkOiffRTHFBf9ZA9TS7QW/exec?mode=fetch&class_code=${classcode}&start_roll=${startroll}&roll=${rollno}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AttendanceData = await response.json();

    // Process attendance percentages
    const processedData: AttendanceData = {
      ...data,
      attendance_data: data.attendance_data
        .filter((item) => item.subject !== "MAIN")
        .map((subject) => ({
          ...subject,
          attendancePercentage: subject.attendance.length > 0 
            ? (subject.attendance.filter((record) => record.status === "P").length / subject.attendance.length) * 100 
            : 0
        }))
    };

    return processedData;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rollno = searchParams.get('roll');

  // Validate roll number
  if (!rollno) {
    return NextResponse.json(
      { error: 'Roll number is required' }, 
      { status: 400 }
    );
  }

  try {
    // Validate roll number format and range
    const parsedRollno = Number(rollno);
    if (isNaN(parsedRollno) || parsedRollno < 1 || parsedRollno > 223) {
      return NextResponse.json(
        { error: 'Invalid roll number' }, 
        { status: 400 }
      );
    }

    const attendanceData = await fetchAttendanceData(rollno);
    return NextResponse.json(attendanceData);
  } catch (error) {
    console.error('Attendance fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve attendance data' }, 
      { status: 500 }
    );
  }
}