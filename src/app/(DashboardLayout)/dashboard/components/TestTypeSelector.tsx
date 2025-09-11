// 'use client'
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Alert,
//   CircularProgress,
//   Chip,
//   Divider,
//   Tabs,
//   Tab,
//   Button
// } from '@mui/material';
// import { School as SchoolIcon, Book as BookIcon, MenuBook as MenuBookIcon, PlayArrow as PlayIcon } from '@mui/icons-material';

// interface TestTypeSelectorProps {
//   onTestStart: (testType: string, course: string, subject?: string, chapter?: string) => void;
// }

// interface CourseOption {
//   name: string;
//   count: number;
// }

// interface SubjectOption {
//   course: string;
//   name: string;
//   count: number;
// }

// interface ChapterOption {
//   course: string;
//   subject: string;
//   name: string;
//   count: number;
// }

// interface AvailableOptions {
//   courses: CourseOption[];
//   subjects: SubjectOption[];
//   chapters: ChapterOption[];
// }

// const TestTypeSelector: React.FC<TestTypeSelectorProps> = ({ onTestStart }) => {
//   const [loading, setLoading] = useState(false);
//   const [availableOptions, setAvailableOptions] = useState<AvailableOptions>({ courses: [], subjects: [], chapters: [] });
//   const [loadingOptions, setLoadingOptions] = useState(true);
//   const [selectedTab, setSelectedTab] = useState(0);

//   // Fetch available options on component mount
//   useEffect(() => {
//     fetchAvailableOptions();
//   }, []);

//   const fetchAvailableOptions = async () => {
//     try {
//       const response = await fetch('/api/Get-Available-Options');
//       const data = await response.json();
      
//       if (data.success) {
//         setAvailableOptions(data);
//       }
//     } catch (error) {
//       console.error('Error fetching options:', error);
//     } finally {
//       setLoadingOptions(false);
//     }
//   };

//   const getTestTypeIcon = (type: string) => {
//     switch (type) {
//       case 'mock':
//         return <SchoolIcon />;
//       case 'subject':
//         return <BookIcon />;
//       case 'chapter':
//         return <MenuBookIcon />;
//       default:
//         return <SchoolIcon />;
//     }
//   };

//   const getTestTypeDescription = (type: string) => {
//     switch (type) {
//       case 'mock':
//         return '180 questions distributed across all subjects';
//       case 'subject':
//         return '90 questions distributed across all chapters';
//       case 'chapter':
//         return '45 random questions from specific chapter';
//       default:
//         return '';
//     }
//   };

//   const handleStartTest = async (testType: string, course: string, subject?: string, chapter?: string) => {
//     setLoading(true);

//     try {
//       // Check if questions are available by calling the API
//       const response = await fetch('/api/Get-Questions-By-Type', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           testType,
//           course,
//           subject,
//           chapter,
//         }),
//       });

//       const data = await response.json();

//       if (data.success && data.hasQuestions) {
//         // Questions are available, start the test
//         onTestStart(testType, course, subject, chapter);
//       } else {
//         alert('No questions available for this test. Please try a different option.');
//       }
//     } catch (error) {
//       console.error('Error starting test:', error);
//       alert('Error occurred while starting the test. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderMockTestTable = () => (
//     <TableContainer>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
//             <TableCell sx={{ fontWeight: 'bold' }}>Available Questions</TableCell>
//             <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {availableOptions.courses.map((course) => (
//             <TableRow key={course.name} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
//               <TableCell>
//                 <Chip 
//                   label={course.name} 
//                   color="primary" 
//                   variant="outlined"
//                   size="small"
//                 />
//               </TableCell>
//               <TableCell>
//                 <Chip 
//                   label={`${course.count} questions`} 
//                   color="success" 
//                   size="small"
//                 />
//               </TableCell>
//               <TableCell>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="small"
//                   startIcon={<PlayIcon />}
//                   onClick={() => handleStartTest('mock', course.name)}
//                   disabled={loading}
//                   sx={{ minWidth: 120 }}
//                 >
//                   {loading ? 'Starting...' : 'Start Test'}
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//           {availableOptions.courses.length === 0 && (
//             <TableRow>
//               <TableCell colSpan={3} align="center">
//                 <Typography color="text.secondary">
//                   No courses available with sufficient questions (minimum 180 required)
//                 </Typography>
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );

//   const renderSubjectTestTable = () => (
//     <TableContainer>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
//             <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
//             <TableCell sx={{ fontWeight: 'bold' }}>Available Questions</TableCell>
//             <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {availableOptions.subjects.map((subject) => (
//             <TableRow key={`${subject.course}-${subject.name}`} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
//               <TableCell>
//                 <Chip 
//                   label={subject.course} 
//                   color="primary" 
//                   variant="outlined"
//                   size="small"
//                 />
//               </TableCell>
//               <TableCell>
//                 <Chip 
//                   label={subject.name} 
//                   color="secondary" 
//                   variant="outlined"
//                   size="small"
//                 />
//               </TableCell>
//               <TableCell>
//                 <Chip 
//                   label={`${subject.count} questions`} 
//                   color="success" 
//                   size="small"
//                 />
//               </TableCell>
//               <TableCell>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="small"
//                   startIcon={<PlayIcon />}
//                   onClick={() => handleStartTest('subject', subject.course, subject.name)}
//                   disabled={loading}
//                   sx={{ minWidth: 120 }}
//                 >
//                   {loading ? 'Starting...' : 'Start Test'}
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//           {availableOptions.subjects.length === 0 && (
//             <TableRow>
//               <TableCell colSpan={4} align="center">
//                 <Typography color="text.secondary">
//                   No subjects available with sufficient questions (minimum 90 required)
//                 </Typography>
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );

//   const renderChapterTestTable = () => (
//     <TableContainer>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
//             <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
//             <TableCell sx={{ fontWeight: 'bold' }}>Chapter</TableCell>
//             <TableCell sx={{ fontWeight: 'bold' }}>Available Questions</TableCell>
//             <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {availableOptions.chapters.map((chapter) => (
//             <TableRow key={`${chapter.course}-${chapter.subject}-${chapter.name}`} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
//               <TableCell>
//                 <Chip 
//                   label={chapter.course} 
//                   color="primary" 
//                   variant="outlined"
//                   size="small"
//                 />
//               </TableCell>
//               <TableCell>
//                 <Chip 
//                   label={chapter.subject} 
//                   color="secondary" 
//                   variant="outlined"
//                   size="small"
//                 />
//               </TableCell>
//               <TableCell>
//                 <Chip 
//                   label={chapter.name} 
//                   color="info" 
//                   variant="outlined"
//                   size="small"
//                 />
//               </TableCell>
//               <TableCell>
//                 <Chip 
//                   label={`${chapter.count} questions`} 
//                   color="success" 
//                   size="small"
//                 />
//               </TableCell>
//               <TableCell>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="small"
//                   startIcon={<PlayIcon />}
//                   onClick={() => handleStartTest('chapter', chapter.course, chapter.subject, chapter.name)}
//                   disabled={loading}
//                   sx={{ minWidth: 120 }}
//                 >
//                   {loading ? 'Starting...' : 'Start Test'}
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//           {availableOptions.chapters.length === 0 && (
//             <TableRow>
//               <TableCell colSpan={5} align="center">
//                 <Typography color="text.secondary">
//                   No chapters available with sufficient questions (minimum 30 required)
//                 </Typography>
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );

//   if (loadingOptions) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//         <CircularProgress size={40} />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
//       <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, color: '#1976d2' }}>
//         Select Your Test Type
//       </Typography>

//       <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
//         <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
//           <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
//             <Tab label="Mock Test" icon={<SchoolIcon />} iconPosition="start" />
//             <Tab label="Subject Test" icon={<BookIcon />} iconPosition="start" />
//             <Tab label="Chapter Test" icon={<MenuBookIcon />} iconPosition="start" />
//           </Tabs>
//         </Box>

//         {selectedTab === 0 && (
//           <Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
//               <Typography variant="h6" gutterBottom>
//                 Available Mock Tests
//               </Typography>
//               <Chip 
//                 label="180 questions per test" 
//                 color="info" 
//                 variant="outlined"
//               />
//             </Box>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//               {getTestTypeDescription('mock')}
//             </Typography>
//             {renderMockTestTable()}
//           </Box>
//         )}

//         {selectedTab === 1 && (
//           <Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
//               <Typography variant="h6" gutterBottom>
//                 Available Subject Tests
//               </Typography>
//               <Chip 
//                 label="90 questions per test" 
//                 color="info" 
//                 variant="outlined"
//               />
//             </Box>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//               {getTestTypeDescription('subject')}
//             </Typography>
//             {renderSubjectTestTable()}
//           </Box>
//         )}

//         {selectedTab === 2 && (
//           <Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
//               <Typography variant="h6" gutterBottom>
//                 Available Chapter Tests
//               </Typography>
//               <Chip 
//                 label="45 questions per test" 
//                 color="info" 
//                 variant="outlined"
//               />
//             </Box>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//               {getTestTypeDescription('chapter')}
//             </Typography>
//             {renderChapterTestTable()}
//           </Box>
//         )}
//       </Paper>

//       {loading && (
//         <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
//           <CircularProgress size={40} sx={{ mb: 2 }} />
//           <Typography variant="h6" color="primary">
//             Starting your test...
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Please wait while we prepare your questions.
//           </Typography>
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default TestTypeSelector;

'use client'
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import {
  School as SchoolIcon,
  Book as BookIcon,
  MenuBook as MenuBookIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';

interface TestTypeSelectorProps {
  onTestStart: (
    testType: 'mock' | 'subject' | 'chapter',
    course: string,
    subject?: string,
    chapter?: string
  ) => void;
}

interface CourseOption {
  name: string;
  count: number;
}
interface SubjectOption {
  course: string;
  name: string;
  count: number;
}
interface ChapterOption {
  course: string;
  subject: string;
  name: string;
  count: number;
}
interface AvailableOptions {
  courses: CourseOption[];
  subjects: SubjectOption[];
  chapters: ChapterOption[];
}

const TestTypeSelector: React.FC<TestTypeSelectorProps> = ({ onTestStart }) => {
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [availableOptions, setAvailableOptions] = useState<AvailableOptions>({
    courses: [],
    subjects: [],
    chapters: [],
  });

// Add this state for filter input
const [filterText, setFilterText] = useState('');

// Filter function
const filterRows = (rows: (CourseOption | SubjectOption | ChapterOption)[]) => {
  if (!filterText.trim()) return rows;
  const lower = filterText.toLowerCase();
  return rows.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(lower)
    )
  );
};



  // fetch available options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch('/api/Get-Available-Options');
        const data = await res.json();
        if (data.success) setAvailableOptions(data);
      } catch (e) {
        console.error('Error fetching options:', e);
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const handleStartTest = async (
    type: 'mock' | 'subject' | 'chapter',
    course: string,
    subject?: string,
    chapter?: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch('/api/Get-Questions-By-Type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testType: type, course, subject, chapter }),
      });
      const data = await res.json();

      if (data.success && data.hasQuestions) {
        onTestStart(type, course, subject, chapter);
      } else {
        alert('Not enough questions available for this test.');
      }
    } catch (err) {
      console.error('Error starting test:', err);
      alert('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (
    headers: string[],
    rows: (CourseOption | SubjectOption | ChapterOption)[],
    type: 'mock' | 'subject' | 'chapter'
  ) => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((h) => (
              <TableCell key={h} sx={{ fontWeight: 'bold' }}>
                {h}
              </TableCell>
            ))}
            <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
              {'course' in row && (
                <TableCell>
                  <Chip label={row.course} color="primary" size="small" variant="outlined" />
                </TableCell>
              )}
              {'name' in row && (!('subject' in row) ? (
                <TableCell>
                  <Chip label={row.name} color="secondary" size="small" variant="outlined" />
                </TableCell>
              ) : null)}
              {'subject' in row && (
                <TableCell>
                  <Chip label={row.subject} color="secondary" size="small" variant="outlined" />
                </TableCell>
              )}
              {'subject' in row && (
                <TableCell>
                  <Chip label={row.name} color="info" size="small" variant="outlined" />
                </TableCell>
              )}
              <TableCell>
                <Chip label={`${row.count} questions`} color="success" size="small" />
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PlayIcon />}
                  disabled={loading}
                  onClick={() =>
                    handleStartTest(
                      type,
                      'course' in row ? row.course : (row as CourseOption).name,
                      'subject' in row ? row.subject : ('name' in row && !('subject' in row) ? row.name : undefined),
                      'subject' in row ? row.name : undefined
                    )
                  }
                >
                  {loading ? 'Starting...' : 'Start Test'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={headers.length + 1} align="center">
                <Typography color="text.secondary">No options available.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loadingOptions)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4, color: '#1976d2' }}>
        Select Your Test Type
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 ,}}>
  <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)}>
    <Tab label="Mock Test" icon={<SchoolIcon />} iconPosition="start" />
    <Tab label="Subject Test" icon={<BookIcon />} iconPosition="start" />
    <Tab label="Chapter Test" icon={<MenuBookIcon />} iconPosition="start" />
  </Tabs>

  <Box sx={{ margin:"auto",}}>
    <input
      type="text"
      placeholder="Filter course/subject/chapter"
      value={filterText}
      onChange={(e) => setFilterText(e.target.value)}
      style={{
        padding: '6px 12px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        minWidth: '250px',
       
      }}
    />
  </Box>
</Box>

{/* // Then modify the renderTable calls to use the filtered data: */}
{selectedTab === 0 &&
  renderTable(
    ['Course', 'Available Questions'],
    filterRows(availableOptions.courses),
    'mock'
  )}
{selectedTab === 1 &&
  renderTable(
    ['Course', 'Subject', 'Available Questions'],
    filterRows(availableOptions.subjects),
    'subject'
  )}
{selectedTab === 2 &&
  renderTable(
    ['Course', 'Subject', 'Chapter', 'Available Questions'],
    filterRows(availableOptions.chapters),
    'chapter'
  )}
        {/* <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)} sx={{ mb: 3 }}>
          <Tab label="Mock Test" icon={<SchoolIcon />} iconPosition="start" />
          <Tab label="Subject Test" icon={<BookIcon />} iconPosition="start" />
          <Tab label="Chapter Test" icon={<MenuBookIcon />} iconPosition="start" />
        </Tabs>


        {selectedTab === 0 &&
          renderTable(['Course', 'Available Questions'], availableOptions.courses, 'mock')}
        {selectedTab === 1 &&
          renderTable(['Course', 'Subject', 'Available Questions'], availableOptions.subjects, 'subject')}
        {selectedTab === 2 &&
          renderTable(['Course', 'Subject', 'Chapter', 'Available Questions'], availableOptions.chapters, 'chapter')} */}

      </Paper>
    </Box>
  );
};

export default TestTypeSelector;
