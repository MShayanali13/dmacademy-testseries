"use client";

import {
  Box,
  Button,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  InputAdornment,
  IconButton,
  MenuItem,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionTypeSelector from "../../components/questionTypeSelector";

interface QuestionType {
  _id: string;
  questionType: string;
  question: {imgUrl:string,text:string};
  answer: string;
  chapter: string;
  course: string;
  subject: string;
}

const marksPerQuestion = 4;

export default function AddTestPaper() {
  const router = useRouter();

  const [duration, setDuration] = useState(60);
  
  
  const [name, setName] = useState("");
  
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));

  
const [testType, setTestType] = useState("");

const [course, setCourse] = useState("");
const [subject, setSubject] = useState("");
const [chapter, setChapter] = useState("");
const [showModal, setShowModal] = useState(false);

const [questions, setQuestions] = useState<QuestionType[]>([]);
const [filteredQuestions, setFilteredQuestions] = useState<QuestionType[]>([]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchQuestions = async () => {
   
    const res = await fetch(`/api/Fetch-QuestionBank`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (json.questions) setQuestions(json.questions);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const toggleSelect = (id: string) => {
    
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(questions.map((q) => q._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSaveTest = async () => {
    if (!date||!name || selectedIds.length === 0) {
      alert("Please enter date, teacher's name and select questions");
      return;
    }

    const res = await fetch("/api/Set-QuestionPaper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        
        duration,
        date,
        name,
        totalMarks: selectedIds.length * marksPerQuestion,
        questionIds: selectedIds,
        course,
        subject,
        chapter,
        level: "Easy",
      }),
    });

    if (res.ok) {
      alert("Test created successfully");
      setSelectedIds([])
      setChapter("")
      setCourse("")
      setDate(new Date().toISOString().slice(0, 10))
      setDuration(60)
      setFilteredQuestions([])
      setName("")
      setSelectedIds([])
      setTestType("")
      setSubject("")
      
      setShowModal(false)
      const data = await res.json();
      return data?.test; 
      router.push("/dashboard");
    } else {
      alert("Failed to create test paper");
    }
  };
  
  const handleSaveAndGeneratePDF = async () => {
  const test = await handleSaveTest(); // return test data (with questions) from DB

 if (!test || !test?._id) return;

  router.push(`/dashboard/admin/printable-question-paper/${test?._id}`);
};
const filterQuestions = (
  questions: QuestionType[],
  course: string,
  subject: string,
  chapter: string
): QuestionType[] => {
  let filter=questions.filter((q) => {
    const matchCourse = course ? q.course?.toLowerCase() === course.toLowerCase() : true;
    const matchSubject = subject ? q.subject?.toLowerCase() === subject.toLowerCase() : true;
    const matchChapter = chapter ? q.chapter?.toLowerCase() === chapter.toLowerCase() : true;
    return matchCourse && matchSubject && matchChapter;
  })
  setFilteredQuestions(filter)
  return filter
};
useEffect(()=>{filterQuestions(questions,course,subject,chapter)},[course,questions,subject,chapter])
// let sortedQuestions=filteredQuestions;
// useEffect(()=>{

//   sortedQuestions = [
//     ...filteredQuestions.filter((q) => selectedIds.includes(q._id)), // selected first
//     ...filteredQuestions.filter((q) => !selectedIds.includes(q._id)), // then others
//   ];
// },[selectedIds])
  return (
    <Box p={4}>
      <Box sx={{display:"flex",justifyContent:"space-between"}}>
        <Typography variant="h5" mb={3}>
      Create New Question Paper
      </Typography>
 {selectedIds.length > 0 && (
          <Grid item xs={12} md={4} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowModal(true)}
            >
              Generate Question Paper ({selectedIds.length})
            </Button>
          </Grid>
        )}
        </Box>
      <Grid container spacing={2}>

         <Grid item xs={12}>
          <QuestionTypeSelector
            onCourseChange={setCourse}
            onSubjectChange={setSubject}
            onChapterChange={setChapter}
            onLevelChange={() => {}}
            isSubmitted={true}
            title={null}
          />
        </Grid>


        {/* <Grid item xs={12} md={4}>
          <TextField
            label="Test Date"
            fullWidth
            type="date"
            value={typeof date === "string" ? date : new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            label="Duration (min)"
            type="number"
            fullWidth
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            label="Total Marks"
            value={selectedIds.length * marksPerQuestion}
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
     <Grid item xs={12} md={4}> 
 <TextField
            label="Teacher's Name"
            placeholder="Teacher's Name"
            fullWidth
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            
          />
        </Grid> */}
       
 {/* <Grid container spacing={2}> */}
  {/* Your selector + inputs stay the same... */}

  {/* 🆕 Selected Questions Preview Section */}
  {/* {selectedIds.length > 0 && (
    <Grid item xs={12}>
      {/* <Typography variant="h6" style={{width:"",background:"#efefef"}} gutterBottom>
        ✅ Selected Questions ({selectedIds.length})
      </Typography> */}
       {/* <TableContainer component={Paper} sx={{ borderRadius: 3, maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                     Remove

                  </TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Question</TableCell>
                  <TableCell>Correct Answer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuestions.map((q) => (
                  <TableRow
                    key={q._id}
                    sx={{
                      backgroundColor: selectedIds.includes(q._id)
                        ? "#e3f2fd"
                        : undefined,
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(q._id)}
                        onChange={() => toggleSelect(q._id)}
                      />
                    </TableCell>
                    <TableCell>{q.subject}</TableCell>
                    <TableCell>{q.course}</TableCell>
                   <TableCell>
  {q.questionType === "image" ? (
    <img src={q.question?.imgUrl || ""} style={{ maxWidth: 180 }} />
  ) : (
    q.question?.text || "-"
  )}
</TableCell>

                    <TableCell>{q.answer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
      </TableContainer>
    </Grid>
  )}
</Grid> */} 
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ borderRadius: 3, maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow style={{background:"#efefef"}}> 
                  <TableCell padding="checkbox">
                    <Checkbox
  checked={
    filteredQuestions.length > 0 &&
    filteredQuestions.every((q) => selectedIds.includes(q._id))
  }
  onChange={(e) => {
    if (e.target.checked) {
      // Add only filtered questions that are not already selected
      const newSelected = [...selectedIds];
      filteredQuestions.forEach((q) => {
        if (!newSelected.includes(q._id)) {
          newSelected.push(q._id);
        }
      });
      setSelectedIds(newSelected);
    } else {
      // Remove all filtered question IDs from selectedIds
      const newSelected = selectedIds.filter(
        (id) => !filteredQuestions.find((q) => q._id === id)
      );
      setSelectedIds(newSelected);
    }
  }}
/>

                  </TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Subject</TableCell>
                  
                  <TableCell>Chapter</TableCell>
                  <TableCell>Question</TableCell>
                  <TableCell>Correct Answer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
               {filteredQuestions
  .filter((q) => selectedIds.includes(q._id))
  .map((q)=>(
     <TableRow
                    key={q._id}
                    sx={{
                      backgroundColor: selectedIds.includes(q._id)
                        ? "#e3f2fd"
                        : undefined,
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(q._id)}
                        onChange={() => toggleSelect(q._id)}
                      />
                    </TableCell>
                    <TableCell>{q.subject}</TableCell>
                    <TableCell>{q.course}</TableCell>
                    
                    <TableCell>{q.chapter}</TableCell>
                   <TableCell>
  {q.questionType === "image" ? (
    <img src={q.question?.imgUrl || ""} style={{ maxWidth: 180 }} />
  ) : (
    q.question?.text || "-"
  )}
</TableCell>

                    <TableCell>{q.answer}</TableCell>
                  </TableRow>
                ))}
                {filteredQuestions
                
  .filter((q) => !selectedIds.includes(q._id))
  .map((q) => (
                  <TableRow
                    key={q._id}
                    sx={{
                      backgroundColor: selectedIds.includes(q._id)
                        ? "#e3f2fd"
                        : undefined,
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(q._id)}
                        onChange={() => toggleSelect(q._id)}
                      />
                    </TableCell>
                    <TableCell>{q.course}</TableCell>
                    <TableCell>{q.subject}</TableCell>
                    
                    <TableCell>{q.chapter}</TableCell>
                   <TableCell>
  {q.questionType === "image" ? (
    <img src={q.question?.imgUrl || ""} style={{ maxWidth: 180 }} />
  ) : (
    q.question?.text || "-"
  )}
</TableCell>

                    <TableCell>{q.answer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        
      </Grid>
      <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="sm">
  <DialogTitle>Confirm Question Paper Details</DialogTitle>
  <DialogContent dividers>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField label="Teacher Name" 
            onChange={(e) => setName(e.target.value)} value={name} fullWidth  />
      </Grid>
      {/* <Grid item xs={12}>
         <TextField
          label="Test Type"
          select
          fullWidth
          value={testType} 
          onChange={(e)=>setTestType(e.target.value)}
             SelectProps={{
            IconComponent: course ? () => null : undefined, // show arrow only if not selected
          }}
          InputProps={{
            endAdornment: course && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => { setTestType("");}}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        >
          {["Course-Wise","Subject-Wise","Chapter-Wise"].map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </Grid> */}
      <Grid item xs={6}>
        <TextField label="Date" type="date" value={typeof date === "string" ? date : new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }} fullWidth  />
      </Grid>
      <Grid item xs={6}>
        <TextField label="Duration (minutes)" value={duration} 
            onChange={(e) => setDuration(Number(e.target.value))} fullWidth  />
      </Grid>
      <Grid item xs={6}>
        <TextField label="Total Question" value={selectedIds.length}
            InputProps={{ readOnly: true }}  fullWidth  />
      </Grid>
      
      <Grid item xs={6}>
        <TextField label="Total Marks" value={selectedIds.length * marksPerQuestion}
            InputProps={{ readOnly: true }}  fullWidth  />
      </Grid>
      {/* <Grid item xs={4}>
        <TextField label="Course" value={course} fullWidth  />
      </Grid>
      <Grid item xs={4}>
        <TextField label="Subject" value={subject} fullWidth  />
      </Grid>
      <Grid item xs={4}>
        <TextField label="Chapter" value={chapter} fullWidth  />
      </Grid> */}
    </Grid>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowModal(false)} color="secondary">Cancel</Button>
    <Button onClick={handleSaveTest} color="primary" variant="contained">Save</Button>
    
    <Button onClick={handleSaveAndGeneratePDF} color="primary" variant="contained">Save & Generate PDF</Button>
  </DialogActions>
</Dialog>

    </Box>
  );
}
