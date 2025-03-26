'use server';

// Define the shape of the attendance submission request
interface AttendanceSubmissionProps {
  classCode: string;
  subjectName: string;
  startRoll: number;
  attendance: string[];
}

// Define the response type
interface SubmissionResponse {
  message?: string;
  error?: string;
}

export async function submitAttendance(data: AttendanceSubmissionProps): Promise<SubmissionResponse> {
  try {
    // Current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Prepare attendance data with date
    const attendanceString = [currentDate, ...data.attendance].join(',');
    
    // Construct the URL with query parameters
    const url = new URL("https://script.google.com/macros/s/AKfycbxCtcHvxpj_uQTDhwwAsE5ItuVqArRerEemFQXWmH1fOJkXkOiffRTHFBf9ZA9TS7QW/exec");
    url.searchParams.append("mode", "push");
    url.searchParams.append("class_code", data.classCode);
    url.searchParams.append("subject_name", data.subjectName);
    url.searchParams.append("start_roll", data.startRoll.toString());
    url.searchParams.append("attendance", attendanceString);
    
    // Send request
    const response = await fetch(url.toString(), {
      method: "GET",
      cache: 'no-store', // Disable caching for real-time submissions
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const result = await response.json();
    
    // Check if the response indicates an error
    if (result.error) {
      return { error: result.error };
    }
    
    return { message: result.message || 'Attendance submitted successfully!' };
  } catch (error) {
    console.error('Submission error:', error);
    return { error: 'An unexpected error occurred during submission.' };
  }
}