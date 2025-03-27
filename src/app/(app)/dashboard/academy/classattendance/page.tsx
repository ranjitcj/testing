// "use client";

// import React, { useState, useEffect } from 'react';
// import { submitAttendance } from '@/app/api/classattendance/route';

// // Define types for class data structure
// interface ClassroomData {
//   branches: {
//     branchName: string;
//     code: string;
//     years: {
//       [year: string]: {
//         code: string;
//         [division: string]: {
//           strength: number;
//           starting_roll: number;
//           ending_roll: number;
//           subjects: string[];
//         }
//       }
//     }
//   }[];
// }

// // Initial class data (same structure as the HTML file)
// const classData: ClassroomData = {
//   branches: [
//     {
//       branchName: "Computer",
//       code: "C",
//       years: {
//         "SE": { 
//           code: "S", 
//           "A": { 
//             strength: 74,
//             starting_roll: 1,
//             ending_roll: 74,
//             subjects: ["M3", "PPL", "SE", "MP", "DSA"]
//           }, 
//           "B": { 
//             strength: 74,
//             starting_roll: 75,
//             ending_roll: 148,
//             subjects: ["M3", "PPL", "SE", "MP", "DSA"]
//           }, 
//           "C": { 
//             strength: 75,
//             starting_roll: 149,
//             ending_roll: 223,
//             subjects: ["M3", "PPL", "SE", "MP", "DSA"]
//           } 
//         },
//         "TE": { 
//           code: "T", 
//           "A": { 
//             strength: 42,
//             starting_roll: 1,
//             ending_roll: 42,
//             subjects: ["ML", "AI", "IoT", "SPOS", "DAA"]
//           } 
//         },
//         "BE": { 
//           code: "B", 
//           "A": { 
//             strength: 45,
//             starting_roll: 1,
//             ending_roll: 45,
//             subjects: ["M3", "PPL", "SE", "MP", "DSA"]
//           } 
//         }
//       }
//     },
//     {
//       branchName: "Electronics",
//       code: "E",
//       years: {
//         "SE": { 
//           code: "S", 
//           "A": { 
//             strength: 35,
//             starting_roll: 1,
//             ending_roll: 35,
//             subjects: ["M3", "PPL", "SE", "MP", "DSA"]
//           }, 
//           "B": { 
//             strength: 30,
//             starting_roll: 36,
//             ending_roll: 65,
//             subjects: ["M3", "PPL", "SE", "MP", "DSA"]
//           } 
//         },
//         "TE": { 
//           code: "T", 
//           "A": { 
//             strength: 38,
//             starting_roll: 1,
//             ending_roll: 38,
//             subjects: ["M3", "PPL", "SE", "MP", "DSA"]
//           } 
//         },
//         "BE": { 
//           code: "B",
//           "A": {
//             strength: 40,
//             starting_roll: 1,
//             ending_roll: 40,
//             subjects: ["M3", "PPL", "SE", "MP", "DSA"]
//           }
//         }
//       }
//     }
//   ]
// };

// export default function AttendanceManagementSystem() {
//   const [selections, setSelections] = useState({
//     Branch: '',
//     Year: '',
//     Division: '',
//     Subject: ''
//   });

//   const [studentData, setStudentData] = useState<{
//     totalStudents: number;
//     startRoll: number;
//     attendanceData: string[];
//   }>({
//     totalStudents: 0,
//     startRoll: 1,
//     attendanceData: []
//   });

//   const [presentCount, setPresentCount] = useState(0);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');
//   const [isError, setIsError] = useState(false);

//   // Function to update selections
//   const updateSelection = (key: keyof typeof selections, value: string) => {
//     const newSelections = { ...selections, [key]: value };
    
//     // Reset lower-level selections when a higher-level selection changes
//     switch (key) {
//       case 'Branch':
//         newSelections.Year = '';
//         newSelections.Division = '';
//         newSelections.Subject = '';
//         break;
//       case 'Year':
//         newSelections.Division = '';
//         newSelections.Subject = '';
//         break;
//       case 'Division':
//         newSelections.Subject = '';
//         break;
//     }

//     setSelections(newSelections);
//   };

//   // Generate student grid when subject is selected
//   useEffect(() => {
//     if (selections.Branch && selections.Year && selections.Division && selections.Subject) {
//       const branch = classData.branches.find(b => b.branchName === selections.Branch);
//       const divisionData = branch?.years[selections.Year][selections.Division];
      
//       if (divisionData) {
//         const totalStudents = divisionData.strength;
//         const startRoll = divisionData.starting_roll;
//         const attendanceData = new Array(totalStudents).fill('A');
        
//         setStudentData({
//           totalStudents,
//           startRoll,
//           attendanceData
//         });
//         setPresentCount(0);
//         setIsSubmitted(false);
//       }
//     }
//   }, [selections.Branch, selections.Year, selections.Division, selections.Subject]);

//   // Toggle attendance for a student
//   const toggleAttendance = (index: number) => {
//     if (isSubmitted) return;

//     const newAttendanceData = [...studentData.attendanceData];
//     newAttendanceData[index] = newAttendanceData[index] === 'P' ? 'A' : 'P';
    
//     setStudentData(prev => ({
//       ...prev,
//       attendanceData: newAttendanceData
//     }));

//     setPresentCount(newAttendanceData.filter(status => status === 'P').length);
//   };

//   // Mark all students present/absent
//   const toggleAllAttendance = () => {
//     if (isSubmitted) return;

//     const newAttendanceData = studentData.attendanceData.map(() => 
//       studentData.attendanceData.some(status => status === 'A') ? 'P' : 'A'
//     );

//     setStudentData(prev => ({
//       ...prev,
//       attendanceData: newAttendanceData
//     }));

//     setPresentCount(newAttendanceData.filter(status => status === 'P').length);
//   };

//   // Submit attendance
//   const handleSubmit = async () => {
//     if (!selections.Branch || !selections.Year || !selections.Division || !selections.Subject) {
//       setStatusMessage('Please complete all selections first.');
//       setIsError(true);
//       return;
//     }

//     setIsSubmitted(true);
//     setStatusMessage('Submitting...');

//     try {
//       const branch = classData.branches.find(b => b.branchName === selections.Branch);
//       const yearCode = branch?.years[selections.Year]?.code || 'X';
//       const classCode = `${branch?.code || 'X'}${yearCode}${selections.Division}`;

//       const response = await submitAttendance({
//         classCode,
//         subjectName: selections.Subject,
//         startRoll: studentData.startRoll,
//         attendance: studentData.attendanceData
//       });

//       if (response.error) {
//         setStatusMessage(`Error: ${response.error}`);
//         setIsError(true);
//         setIsSubmitted(false);
//       } else {
//         setStatusMessage(response.message || 'Attendance submitted successfully!');
//         setIsError(false);
//       }
//     } catch (error) {
//       setStatusMessage('Network error occurred. Please try again.');
//       setIsError(true);
//       setIsSubmitted(false);
//     }
//   };

//   // Get available options for each selection level
//   const getBranchOptions = () => classData.branches.map(b => b.branchName);
//   const getYearOptions = () => {
//     const branch = classData.branches.find(b => b.branchName === selections.Branch);
//     return branch ? Object.keys(branch.years) : [];
//   };
//   const getDivisionOptions = () => {
//     const branch = classData.branches.find(b => b.branchName === selections.Branch);
//     return branch && selections.Year 
//       ? Object.keys(branch.years[selections.Year]).filter(k => k !== 'code')
//       : [];
//   };
//   const getSubjectOptions = () => {
//     const branch = classData.branches.find(b => b.branchName === selections.Branch);
//     return branch && selections.Year && selections.Division
//       ? branch.years[selections.Year][selections.Division].subjects
//       : [];
//   };

//   // Calculate class code and summary
//   const calculateClassCode = () => {
//     const branch = classData.branches.find(b => b.branchName === selections.Branch);
//     const yearCode = branch?.years[selections.Year]?.code || 'X';
//     return `${branch?.code || 'X'}${yearCode}${selections.Division}`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center">
//       <header className="w-full bg-green-500 text-white text-center py-4">
//         <h1 className="text-2xl font-bold">Attendance Management System</h1>
//       </header>

//       <main className="w-full max-w-4xl p-4 bg-white shadow-md rounded-lg mt-4">
//         <div className="space-y-4">
//           {/* Branch Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Branch</label>
//             <div className="flex space-x-2">
//               {getBranchOptions().map(branch => (
//                 <button
//                   key={branch}
//                   onClick={() => updateSelection('Branch', branch)}
//                   className={`px-4 py-2 rounded ${
//                     selections.Branch === branch 
//                       ? 'bg-green-500 text-white' 
//                       : 'bg-gray-200 text-gray-800'
//                   }`}
//                 >
//                   {branch}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Year Selection */}
//           {selections.Branch && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Year</label>
//               <div className="flex space-x-2">
//                 {getYearOptions().map(year => (
//                   <button
//                     key={year}
//                     onClick={() => updateSelection('Year', year)}
//                     className={`px-4 py-2 rounded ${
//                       selections.Year === year 
//                         ? 'bg-green-500 text-white' 
//                         : 'bg-gray-200 text-gray-800'
//                     }`}
//                   >
//                     {year}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Division Selection */}
//           {selections.Branch && selections.Year && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Division</label>
//               <div className="flex space-x-2">
//                 {getDivisionOptions().map(division => (
//                   <button
//                     key={division}
//                     onClick={() => updateSelection('Division', division)}
//                     className={`px-4 py-2 rounded ${
//                       selections.Division === division 
//                         ? 'bg-green-500 text-white' 
//                         : 'bg-gray-200 text-gray-800'
//                     }`}
//                   >
//                     {division}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Subject Selection */}
//           {selections.Branch && selections.Year && selections.Division && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Subject</label>
//               <div className="flex space-x-2">
//                 {getSubjectOptions().map(subject => (
//                   <button
//                     key={subject}
//                     onClick={() => updateSelection('Subject', subject)}
//                     className={`px-4 py-2 rounded ${
//                       selections.Subject === subject 
//                         ? 'bg-green-500 text-white' 
//                         : 'bg-gray-200 text-gray-800'
//                     }`}
//                   >
//                     {subject}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Student Grid */}
//           {selections.Subject && (
//             <div>
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-semibold">
//                   {`${selections.Year} ${selections.Branch} ${selections.Division}`}
//                 </h2>
//                 <button 
//                   onClick={toggleAllAttendance}
//                   className="bg-blue-500 text-white px-4 py-2 rounded"
//                   disabled={isSubmitted}
//                 >
//                   {studentData.attendanceData.some(status => status === 'A') 
//                     ? 'Mark All Present' 
//                     : 'Mark All Absent'}
//                 </button>
//               </div>

//               <div className="grid grid-cols-10 gap-2">
//                 {studentData.attendanceData.map((status, index) => (
//                   <div
//                     key={index}
//                     onClick={() => toggleAttendance(index)}
//                     className={`
//                       w-12 h-12 flex items-center justify-center 
//                       rounded cursor-pointer font-bold
//                       ${status === 'P' 
//                         ? 'bg-green-500 text-white' 
//                         : 'bg-red-500 text-white'}
//                       ${isSubmitted ? 'cursor-default' : ''}
//                     `}
//                   >
//                     {studentData.startRoll + index}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Attendance Summary */}
//           {selections.Subject && (
//             <div className="bg-blue-100 p-4 rounded-lg mt-4">
//               <div className="grid grid-cols-2 gap-2">
//                 <p>Selected: {Object.values(selections).filter(Boolean).join(' ')}</p>
//                 <p>Class Code: {calculateClassCode()}</p>
//                 <p>Subject: {selections.Subject}</p>
//                 <p>Total Students: {studentData.totalStudents}</p>
//                 <p>Present Students: {presentCount}</p>
//                 <p>Absent Students: {studentData.totalStudents - presentCount}</p>
//                 <p>
//                   Attendance Percentage: {
//                     studentData.totalStudents > 0 
//                       ? `${Math.round((presentCount / studentData.totalStudents) * 100)}%`
//                       : '0%'
//                   }
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Status Message */}
//           {statusMessage && (
//             <div 
//               className={`
//                 p-4 rounded-lg text-center 
//                 ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
//               `}
//             >
//               {statusMessage}
//             </div>
//           )}

//           {/* Submit Button */}
//           {selections.Subject && (
//             <button
//               onClick={handleSubmit}
//               disabled={isSubmitted}
//               className={`
//                 w-full py-3 rounded text-white font-bold 
//                 ${isSubmitted 
//                   ? 'bg-gray-400 cursor-not-allowed' 
//                   : 'bg-green-500 hover:bg-green-600'}
//               `}
//             >
//               {isSubmitted ? 'Attendance Submitted' : 'Submit Attendance'}
//             </button>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect } from 'react';
import { submitAttendance } from '@/app/api/classattendance/route';
// Remove the unsupported import and replace with a mock function
// const submitAttendance = async (attendanceData: {
//   classCode: string,
//   subjectName: string,
//   startRoll: number,
//   attendance: string[]
// }) => {
//   // Simulate an API call
//   return new Promise<{message?: string, error?: string}>(resolve => {
//     setTimeout(() => {
//       // Simulating a successful submission
//       resolve({
//         message: 'Attendance submitted successfully!'
//       });
//     }, 1000);
//   });
// };

// Define types for class data structure
interface ClassroomData {
  branches: {
    branchName: string;
    code: string;
    years: {
      [year: string]: {
        code: string;
        [division: string]: {
          strength: number;
          starting_roll: number;
          ending_roll: number;
          subjects: string[];
        }
      }
    }
  }[];
}

// Initial class data (same structure as the HTML file)
const classData: ClassroomData = {
  branches: [
    {
      branchName: "Computer",
      code: "C",
      years: {
        "SE": { 
          code: "S", 
          "A": { 
            strength: 74,
            starting_roll: 1,
            ending_roll: 74,
            subjects: ["M3", "PPL", "SE", "MP", "DSA"]
          }, 
          "B": { 
            strength: 74,
            starting_roll: 75,
            ending_roll: 148,
            subjects: ["M3", "PPL", "SE", "MP", "DSA"]
          }, 
          "C": { 
            strength: 75,
            starting_roll: 149,
            ending_roll: 223,
            subjects: ["M3", "PPL", "SE", "MP", "DSA"]
          } 
        },
        "TE": { 
          code: "T", 
          "A": { 
            strength: 42,
            starting_roll: 1,
            ending_roll: 42,
            subjects: ["ML", "AI", "IoT", "SPOS", "DAA"]
          } 
        },
        "BE": { 
          code: "B", 
          "A": { 
            strength: 45,
            starting_roll: 1,
            ending_roll: 45,
            subjects: ["M3", "PPL", "SE", "MP", "DSA"]
          } 
        }
      }
    },
    {
      branchName: "Electronics",
      code: "E",
      years: {
        "SE": { 
          code: "S", 
          "A": { 
            strength: 35,
            starting_roll: 1,
            ending_roll: 35,
            subjects: ["M3", "PPL", "SE", "MP", "DSA"]
          }, 
          "B": { 
            strength: 30,
            starting_roll: 36,
            ending_roll: 65,
            subjects: ["M3", "PPL", "SE", "MP", "DSA"]
          } 
        },
        "TE": { 
          code: "T", 
          "A": { 
            strength: 38,
            starting_roll: 1,
            ending_roll: 38,
            subjects: ["M3", "PPL", "SE", "MP", "DSA"]
          } 
        },
        "BE": { 
          code: "B",
          "A": {
            strength: 40,
            starting_roll: 1,
            ending_roll: 40,
            subjects: ["M3", "PPL", "SE", "MP", "DSA"]
          }
        }
      }
    }
  ]
};

export default function AttendanceManagementSystem() {
  const [selections, setSelections] = useState({
    Branch: '',
    Year: '',
    Division: '',
    Subject: ''
  });

  const [studentData, setStudentData] = useState<{
    totalStudents: number;
    startRoll: number;
    attendanceData: string[];
  }>({
    totalStudents: 0,
    startRoll: 1,
    attendanceData: []
  });

  const [presentCount, setPresentCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Function to update selections
  const updateSelection = (key: keyof typeof selections, value: string) => {
    const newSelections = { ...selections, [key]: value };
    
    // Reset lower-level selections when a higher-level selection changes
    switch (key) {
      case 'Branch':
        newSelections.Year = '';
        newSelections.Division = '';
        newSelections.Subject = '';
        break;
      case 'Year':
        newSelections.Division = '';
        newSelections.Subject = '';
        break;
      case 'Division':
        newSelections.Subject = '';
        break;
    }

    setSelections(newSelections);
  };

  // Generate student grid when subject is selected
  useEffect(() => {
    if (selections.Branch && selections.Year && selections.Division && selections.Subject) {
      const branch = classData.branches.find(b => b.branchName === selections.Branch);
      const divisionData = branch?.years[selections.Year][selections.Division];
      
      if (divisionData) {
        const totalStudents = divisionData.strength;
        const startRoll = divisionData.starting_roll;
        const attendanceData = new Array(totalStudents).fill('A');
        
        setStudentData({
          totalStudents,
          startRoll,
          attendanceData
        });
        setPresentCount(0);
        setIsSubmitted(false);
      }
    }
  }, [selections.Branch, selections.Year, selections.Division, selections.Subject]);

  // Toggle attendance for a student
  const toggleAttendance = (index: number) => {
    if (isSubmitted) return;

    const newAttendanceData = [...studentData.attendanceData];
    newAttendanceData[index] = newAttendanceData[index] === 'P' ? 'A' : 'P';
    
    setStudentData(prev => ({
      ...prev,
      attendanceData: newAttendanceData
    }));

    setPresentCount(newAttendanceData.filter(status => status === 'P').length);
  };

  // Mark all students present/absent
  const toggleAllAttendance = () => {
    if (isSubmitted) return;

    const newAttendanceData = studentData.attendanceData.map(() => 
      studentData.attendanceData.some(status => status === 'A') ? 'P' : 'A'
    );

    setStudentData(prev => ({
      ...prev,
      attendanceData: newAttendanceData
    }));

    setPresentCount(newAttendanceData.filter(status => status === 'P').length);
  };

  // Submit attendance
  const handleSubmit = async () => {
    if (!selections.Branch || !selections.Year || !selections.Division || !selections.Subject) {
      setStatusMessage('Please complete all selections first.');
      setIsError(true);
      return;
    }

    setIsSubmitted(true);
    setStatusMessage('Submitting...');

    try {
      const branch = classData.branches.find(b => b.branchName === selections.Branch);
      const yearCode = branch?.years[selections.Year]?.code || 'X';
      const classCode = `${branch?.code || 'X'}${yearCode}${selections.Division}`;

      const response = await submitAttendance({
        classCode,
        subjectName: selections.Subject,
        startRoll: studentData.startRoll,
        attendance: studentData.attendanceData
      });

      if (response.error) {
        setStatusMessage(`Error: ${response.error}`);
        setIsError(true);
        setIsSubmitted(false);
      } else {
        setStatusMessage(response.message || 'Attendance submitted successfully!');
        setIsError(false);
      }
    } catch (error) {
      setStatusMessage(`Error: ${error}`);
      setIsError(true);
      setIsSubmitted(false);
    }
  };

  // Get available options for each selection level
  const getBranchOptions = () => classData.branches.map(b => b.branchName);
  const getYearOptions = () => {
    const branch = classData.branches.find(b => b.branchName === selections.Branch);
    return branch ? Object.keys(branch.years) : [];
  };
  const getDivisionOptions = () => {
    const branch = classData.branches.find(b => b.branchName === selections.Branch);
    return branch && selections.Year 
      ? Object.keys(branch.years[selections.Year]).filter(k => k !== 'code')
      : [];
  };
  const getSubjectOptions = () => {
    const branch = classData.branches.find(b => b.branchName === selections.Branch);
    return branch && selections.Year && selections.Division
      ? branch.years[selections.Year][selections.Division].subjects
      : [];
  };

  // Calculate class code and summary
  const calculateClassCode = () => {
    const branch = classData.branches.find(b => b.branchName === selections.Branch);
    const yearCode = branch?.years[selections.Year]?.code || 'X';
    return `${branch?.code || 'X'}${yearCode}${selections.Division}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="w-full bg-green-500 text-white text-center py-4">
        <h1 className="text-xl font-bold sm:text-2xl">Attendance Management System</h1>
      </header>

      <main className="w-full flex-grow px-4 py-2 sm:p-4">
        <div className="max-w-full mx-auto space-y-4">
          {/* Branch Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {getBranchOptions().map(branch => (
                <button
                  key={branch}
                  onClick={() => updateSelection('Branch', branch)}
                  className={`w-full py-2 rounded text-sm ${
                    selections.Branch === branch 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>

          {/* Year Selection */}
          {selections.Branch && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {getYearOptions().map(year => (
                  <button
                    key={year}
                    onClick={() => updateSelection('Year', year)}
                    className={`w-full py-2 rounded text-sm ${
                      selections.Year === year 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Division Selection */}
          {selections.Branch && selections.Year && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Division</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {getDivisionOptions().map(division => (
                  <button
                    key={division}
                    onClick={() => updateSelection('Division', division)}
                    className={`w-full py-2 rounded text-sm ${
                      selections.Division === division 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {division}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subject Selection */}
          {selections.Branch && selections.Year && selections.Division && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {getSubjectOptions().map(subject => (
                  <button
                    key={subject}
                    onClick={() => updateSelection('Subject', subject)}
                    className={`w-full py-2 rounded text-sm ${
                      selections.Subject === subject 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Student Grid */}
          {selections.Subject && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-base sm:text-lg font-semibold">
                  {`${selections.Year} ${selections.Branch} ${selections.Division}`}
                </h2>
                <button 
                  onClick={toggleAllAttendance}
                  className="bg-blue-500 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
                  disabled={isSubmitted}
                >
                  {studentData.attendanceData.some(status => status === 'A') 
                    ? 'Mark All Present' 
                    : 'Mark All Absent'}
                </button>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 sm:gap-2">
                {studentData.attendanceData.map((status, index) => (
                  <div
                    key={index}
                    onClick={() => toggleAttendance(index)}
                    className={`
                      w-full aspect-square flex items-center justify-center 
                      rounded cursor-pointer font-bold text-xs sm:text-base
                      ${status === 'P' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'}
                      ${isSubmitted ? 'cursor-default' : ''}
                    `}
                  >
                    {studentData.startRoll + index}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attendance Summary */}
          {selections.Subject && (
            <div className="bg-blue-100 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>Selected: {Object.values(selections).filter(Boolean).join(' ')}</p>
                <p>Class Code: {calculateClassCode()}</p>
                <p>Subject: {selections.Subject}</p>
                <p>Total Students: {studentData.totalStudents}</p>
                <p>Present Students: {presentCount}</p>
                <p>Absent Students: {studentData.totalStudents - presentCount}</p>
                <p>
                  Attendance Percentage: {
                    studentData.totalStudents > 0 
                      ? `${Math.round((presentCount / studentData.totalStudents) * 100)}%`
                      : '0%'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Status Message */}
          {statusMessage && (
            <div 
              className={`
                p-4 rounded-lg text-center text-sm
                ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
              `}
            >
              {statusMessage}
            </div>
          )}

          {/* Submit Button */}
          {selections.Subject && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitted}
              className={`
                w-full py-3 rounded text-white font-bold text-sm
                ${isSubmitted 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600'}
              `}
            >
              {isSubmitted ? 'Attendance Submitted' : 'Submit Attendance'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}