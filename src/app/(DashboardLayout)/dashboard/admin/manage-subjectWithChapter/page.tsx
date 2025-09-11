"use client";

export const dynamic = 'force-dynamic'


import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  IconButton,
  Grid,
} from "@mui/material";
import { Edit, Delete, Cancel } from "@mui/icons-material";
import PageContainer from "../../components/container/PageContainer";
import Loading from "../../loading";
import QuestionTypeSelector from "../../components/questionTypeSelector";

import * as XLSX from "xlsx";

import { unstable_noStore as noStore } from "next/cache";

interface SubjectChapterType {
  _id?: string;
  course: string;
  subject: string;
  chapter: string;
}

export default function ManageSubjectWithChapters() {

    noStore()

  const [data, setData] = useState<SubjectChapterType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<SubjectChapterType>({ course: "", subject: "", chapter: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const [level, setLevel] = useState("");
  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);



  const fetchData = async () => {
    const res = await fetch("/api/Fetch-All-SubjectWithChapter", { cache: "no-store" });
    const json = await res.json();
    if (json.success) setData(json.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    const url = editingId ? `/api/Edit-SubjectWithChapter/${editingId}` : "/api/Set-SubjectWithChapters";
    const method = editingId ? "PUT" : "POST";

 if (!course || !subject || !chapter) {
    alert("Please fill all fields before submitting.");
    return;
  }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      fetchData();
      setOpen(false);
      setForm({ course: "", subject: "", chapter: "" });
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/Delete-SubjectWithChapter/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleBulkDelete = async () => {
    if (!confirm("Delete selected entries?")) return;
    await fetch("/api/Bulk-Delete-SubjectWithChapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected }),
    });
    fetchData();
    setSelected([]);
  };

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel); // not used in filtering here
  };

  const handleCourseChange = (newCourse: string) => {
    setCourse(newCourse);
    setSubject("");
    setChapter("");
  };

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    setChapter("");
  };

  const handleChapterChange = (newChapter: string) => {
    setChapter(newChapter);
  };


  const filteredData = data.filter((item) => {
    const courseMatch = !course || item.course === course;
    const subjectMatch = !subject || item.subject === subject;
    const chapterMatch = !chapter || item.chapter === chapter;
    return courseMatch && subjectMatch && chapterMatch;
  })


  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
     const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });



      // Call your API to save subjectWithChapter
      const res = await fetch("/api/Import-SubjectWithChapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectWithChapter: jsonData }),
      });

      if (res.ok) {
        alert("subjectWithChapter imported successfully!");
        location.reload(); // or re-fetch subjectWithChapter
      } else {
        alert("Failed to import subjectWithChapter.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownloadExcel = () => {
    const exportData = filteredData.map((item) => ({

      course: item.course ?? "",
      subject: item.subject ?? "",
      chapter: item.chapter ?? "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: [

        "course",
        "subject",
        "chapter",

      ],
    });

    const workbook = XLSX.utils.book_new();
    const dateStr = new Date().toISOString().slice(0, 10); // e.g. "2024-06-09"
    XLSX.utils.book_append_sheet(workbook, worksheet, `SubjectWiseChapters_${dateStr}`);

    XLSX.writeFile(workbook, `SubjectWiseChapters_${dateStr}.xlsx`);
  };



  if (isLoading) return <Loading />;

  return (
    <PageContainer title="Manage Subject with Chapters" description="Manage subject and chapter data">
      <Box mb={3}>
        <Typography variant="h4" mb={4}>Subject Wise Chapter</Typography>


     <Grid container spacing={2} sx={{ mt: 2 }}>
  {/* Question Type Selector - Full Width */}
  <Grid item xs={12}>
    <QuestionTypeSelector
      onLevelChange={handleLevelChange}
      onCourseChange={handleCourseChange}
      onSubjectChange={handleSubjectChange}
      onChapterChange={handleChapterChange}
      new
      title={null}
      isSubmitted={isSubmitted}
    />
  </Grid>

  {/* Buttons Row - Responsive */}
  <Grid
    item
    xs={12}
    md={6}
    display="flex"
    flexDirection={{ xs: "column", md: "row" }}
    alignItems="flex-start"
    gap={1}
    p={2}
    borderRadius={2}
  >
    <Button
      variant="outlined"
      color="secondary"
      onClick={() => {
        setLevel("");
        setCourse("");
        setSubject("");
        setChapter("");
        setIsSubmitted(true);
      }}
      disabled={!course && !subject && !chapter}
    >
      <Cancel sx={{ mr: 1 }} color="error" />
      <Typography
        variant="body1"
        sx={{
          color: "#d32f2f",
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
        }}
      >
        Clear Filters
      </Typography>
    </Button>

    <Button variant="contained" onClick={() => setOpen(true)} sx={{ backgroundColor: "#004a8b" }}>
      Add New
    </Button>
  </Grid>

  <Grid
    item
    xs={12}
    md={6}
    display="flex"
    flexDirection={{ xs: "column", md: "row" }}
    alignItems="flex-start"
    justifyContent="flex-end"
    gap={1}
    p={2}
    borderRadius={2}
  >
    <Button variant="contained" component="label" sx={{ backgroundColor: "#1976d2" }}>
      Import Chapters
      <input
        type="file"
        accept=".xlsx, .xls"
        hidden
        onChange={handleExcelUpload}
      />
    </Button>

    <Button
      variant="contained"
      
      onClick={handleDownloadExcel}
      sx={{ backgroundColor: "#1976d2" }}
    >
      Export Chapters
    </Button>

    {selected.length > 0 && (
      <Button
        variant="contained"
        color="error"
        onClick={handleBulkDelete}
      >
        Delete Selected ({selected.length})
      </Button>
    )}
  </Grid>
</Grid>



        <TableContainer component={Paper} elevation={1} sx={{ maxHeight: 500, borderRadius: 3, overflow: "auto", mt: 3 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ paddingLeft: 2 }}>
                  <input
                    type="checkbox"
                    checked={selected.length === data.length}
                    onChange={(e) => {
                      setSelected(e.target.checked ? data.map((d) => d._id!) : []);
                    }}
                  />
                </TableCell>
                {['Course', 'Subject', 'Chapter', 'Actions'].map(header => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item._id}>
                  <TableCell padding="checkbox" sx={{ paddingLeft: 2 }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(item._id!)}
                      onChange={(e) => {
                        setSelected((prev) =>
                          e.target.checked ? [...prev, item._id!] : prev.filter(id => id !== item._id!)
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>{item.course}</TableCell>
                  <TableCell>{item.subject}</TableCell>
                  <TableCell>{item.chapter}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => {
                      setForm({ course: item.course, subject: item.subject, chapter: item.chapter });
                      setEditingId(item._id!);
                      setOpen(true);
                    }} color="info">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(item._id!)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal open={open} onClose={() => { setOpen(false); setEditingId(null); }}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, p: 4 }}>
            <Typography mb={2}>{editingId ? "Edit Entry" : "Add Entry"}</Typography>
            <TextField fullWidth label="Course" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Chapter" value={form.chapter} onChange={(e) => setForm({ ...form, chapter: e.target.value })} sx={{ mb: 2 }} />
            <Button variant="contained" fullWidth onClick={handleSubmit}>{editingId ? "Update" : "Add"}</Button>
          </Box>
        </Modal>
      </Box>
    </PageContainer>
  );
}