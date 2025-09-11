
// const [questions, setQuestions] = useState<Question[]>([]);
// const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
// const [timeLeft, setTimeLeft] = useState<number>(0);
// const [subjectTab, setSubjectTab] = useState<string>("");
// const [loading, setLoading] = useState<boolean>(true);

// pagination per subject
// const [panelPageBySubject, setPanelPageBySubject] = useState<Record<string, number>>({});

// Fetch questions
// useEffect(() => {
//   const fetchQuestions = async () => {
//     setLoading(true);
//     const res = await fetch("/api/Get-Questions-By-Type", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ testType, course, subject, chapter }),
//     });
//     const data = await res.json();
//     if (data.success) {
//       setQuestions(data.questions);
//       const subjectsInTest = Array.from(new Set(data.questions.map((q: Question) => q.subject)));
//       setSubjectTab(typeof subjectsInTest[0] === "string" ? subjectsInTest[0] : "");
//       const endTime = Date.now() + data.duration * 1000;
//       sessionStorage.setItem("testEndTime", String(endTime));
//       setTimeLeft(data.duration); // trigger timer
//     }
//     setLoading(false);
//   };
//   fetchQuestions();
// }, [testType, course, subject, chapter]);


// const handleSelectOption = (qid: string, idx: number) => {
//   setSelectedOptions((prev) => ({ ...prev, [qid]: idx }));
// };

// const handleSubmit = () => {
//   console.log("Submitted:", selectedOptions);
//   alert("Test submitted!");
// };



"use client";
import { IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useEffect, useState, useRef } from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import QuestionCard from "../../components/questionCard";
import { Question } from "@/types/questionType";
import Loading from "@/app/loading";

const QUESTIONS_PER_PANEL_PAGE = 25;

export default function TestPage() {
  const searchParams = useSearchParams();
  const testType = searchParams.get("testType") || "mock";
  const course = searchParams.get("course") || "jee";
  const subject = searchParams.get("subject") || "";
  const chapter = searchParams.get("chapter") || "";
  
  // ----------------- STATE -----------------
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [subjectTab, setSubjectTab] = useState<string>("");
  const [panelPageBySubject, setPanelPageBySubject] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const [duration, setDuration] = useState<number>(0); // in sec

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);



// ----------------- TAB CHANGE -----------------
  const handleTabChange = (_: any, val: string) => {
    setSubjectTab(val);
    setPanelPageBySubject((prev) => ({ ...prev, [val]: prev[val] || 1 }));
  };

// ----------------- ACTIVE PAGE -----------------
  const activePage = panelPageBySubject[subjectTab] || 1;
  const changePage = (page: number) => {
    setPanelPageBySubject((prev) => ({ ...prev, [subjectTab]: page }));
  };

// ----------------- RESTORE SAVED DATA -----------------
useEffect(() => {
  const saved = sessionStorage.getItem("testState");
  if (saved) {
    const parsed = JSON.parse(saved);
    setQuestions(parsed.questions || []);
    setSelectedOptions(parsed.selectedOptions || {});
    setSubjectTab(parsed.subjectTab || "");
    setPanelPageBySubject(parsed.panelPageBySubject || {});
    const endTime = parsed.endTime;
    if (endTime) {
      sessionStorage.setItem("testEndTime", String(endTime));
      setTimeLeft(Math.max(0, Math.floor((endTime - Date.now()) / 1000)));
    }
    setLoading(false);
    return;
  }
}, []);

// ----------------- FETCH QUESTIONS (ONLY IF NOT RESTORED) -----------------
useEffect(() => {
  const saved = sessionStorage.getItem("testState");
  if (saved) return; // already restored

  const fetchQuestions = async () => {
    setLoading(true);
    const res = await fetch("/api/Get-Questions-By-Type", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testType, course, subject, chapter }),
    });
    const data = await res.json();
    if (data.success) {
      setQuestions(data.questions);
      const subjectsInTest = Array.from(new Set(data.questions.map((q: Question) => q.subject)));
      setSubjectTab(String(subjectsInTest[0] || ""));
      const endTime = Date.now() + data.duration * 1000;
      setDuration(data.duration)
console.log("Test duration (sec):", data.duration);
      sessionStorage.setItem("testEndTime", String(endTime));
      setTimeLeft(data.duration);
      // Save initial state
      sessionStorage.setItem(
        "testState",
        JSON.stringify({
          questions: data.questions,
          selectedOptions: {},
          subjectTab: subjectsInTest[0] || "",
          panelPageBySubject: {},
          endTime,
        })
      );
    }
    setLoading(false);
  };
  fetchQuestions();
}, [testType, course, subject, chapter]);

// ----------------- AUTO-SAVE STATE -----------------
useEffect(() => {
  if (!questions.length) return;
  const endTime = parseInt(sessionStorage.getItem("testEndTime") || "0", 10);
  sessionStorage.setItem(
    "testState",
    JSON.stringify({
      questions,
      selectedOptions,
      subjectTab,
      panelPageBySubject,
      endTime,
    })
  );
}, [questions, selectedOptions, subjectTab, panelPageBySubject]);

// ----------------- TIMER -----------------
useEffect(() => {
  const savedEnd = sessionStorage.getItem("testEndTime");
  if (!savedEnd) return;
  const endTime = parseInt(savedEnd, 10);

  const interval = setInterval(() => {
    const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    setTimeLeft(diff);
    if (diff <= 0) clearInterval(interval);
  }, 1000);

  return () => clearInterval(interval);
}, [questions.length]);

// ----------------- SELECT OPTION -----------------
const handleSelectOption = (qid: string, idx: number) => {
  setSelectedOptions((prev) => ({ ...prev, [qid]: idx }));
  console.log("Selected:", { ...selectedOptions, [qid]: idx })
};


// ----------------- Format Time -----------------
  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  // ----------------- FILTERED QUESTIONS & PAGINATION -----------------
  const subjects = Array.from(new Set(questions.map((q) => q.subject)));
  const filteredQuestions = questions.filter((q) => q.subject === subjectTab);

  const totalPanelPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PANEL_PAGE);
  const panelQuestions = filteredQuestions.slice(
    (activePage - 1) * QUESTIONS_PER_PANEL_PAGE,
    activePage * QUESTIONS_PER_PANEL_PAGE
  );

  // ----------------- SCROLL TO QUESTION -----------------
  const scrollToQuestion = (idx: number) => {
    questionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ----------------- Timer sticky -----------------
  const [isTimerSticky, setIsTimerSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsTimerSticky(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ----------------- Panel sticky -----------------
  const [isPanelSticky, setIsPanelSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsPanelSticky(window.scrollY > 95);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Answered/unanswered for active tab only
  const answeredCount = filteredQuestions.filter((q) => selectedOptions[q._id] !== undefined).length;
  const unansweredCount = filteredQuestions.length - answeredCount;


//  ------------------ Render Pagination ----------------
const renderPagination = (total: number, current: number) => {
  const pages: (number | "...")[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, "...", total);
    } else if (current >= total - 2) {
      pages.push(1, "...", total - 2, total - 1, total);
    } else {
      pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {/* Prev Arrow */}
      <IconButton
        size="small"
        disabled={current === 1}
        onClick={() => changePage(current - 1)}
        sx={{
          bgcolor: "#f1f1f1",
          "&:hover": { bgcolor: "#ddd" },
          border: "1px solid #ccc",
        }}
      >
        <ArrowBack fontSize="small" />
      </IconButton>

      {/* Page Numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <Typography key={i} px={1}>
            ...
          </Typography>
        ) : (
          <Button
            key={i}
            onClick={() => changePage(p)}
            sx={{
              minWidth: 38,
              height: 38,
              borderRadius: "50%",
              fontWeight: 600,
              bgcolor: p === current ? "primary.main" : "#f5f5f5",
              color: p === current ? "white" : "black",
              border: "1px solid #ccc",
              "&:hover": {
                bgcolor: p === current ? "primary.dark" : "#e0e0e0",
              },
              boxShadow:
                p === current ? "0 2px 6px rgba(33,150,243,0.4)" : "none",
            }}
          >
            {p}
          </Button>
        )
      )}

      {/* Next Arrow */}
      <IconButton
        size="small"
        disabled={current === total}
        onClick={() => changePage(current + 1)}
        sx={{
          bgcolor: "#f1f1f1",
          "&:hover": { bgcolor: "#ddd" },
          border: "1px solid #ccc",
        }}
      >
        <ArrowForward fontSize="small" />
      </IconButton>
    </Box>
  );
};

// ----------------- TIMER -----------------
useEffect(() => {
  const savedEnd = sessionStorage.getItem("testEndTime");
  if (!savedEnd) return;
  const endTime = parseInt(savedEnd, 10);

  const interval = setInterval(() => {
    const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    setTimeLeft(diff);

    if (diff <= 0) {
      clearInterval(interval);
      handleSubmit(); // ⬅️ Auto-submit when time over
    }
  }, 1000);

  return () => clearInterval(interval);
}, [questions.length]);

// ----------------- SUBMIT -----------------
const handleSubmit = () => {
  if (!questions.length) return;

  // Build the result object
  // const answers = questions.map((q) => ({
  //   id: q._id,
  //   ans: q.answer || "",
  //   selected: selectedOptions[q._id] !== undefined
  //     ? q.options[selectedOptions[q._id]]?.text || "Skipped"
  //     : "Skipped",
  // }));
  const answers = questions.map((q) => {
  const selectedIdx = selectedOptions[q._id];
  return {
    id: q._id,
    ans: q.answer !== undefined ? q.answer : "",
    selected:
      selectedIdx !== undefined
        ? String.fromCharCode(65 + selectedIdx) // "A", "B", "C", ...
        : "Skipped",
  };
});

console.log("Submitting answers:", answers);
  const correct = answers.filter(a => a.selected.toLocaleLowerCase() !== "skipped" && a.ans === a.selected).length;
  const incorrect = answers.filter(a => a.selected.toLocaleLowerCase() !== "skipped" && a.ans !== a.selected).length;
  const unanswered = answers.filter(a => a.selected.toLocaleLowerCase() === "skipped");

  const score = correct * 4 - incorrect; // Or calculate marks if needed
  const percentage = questions.length > 0 ? (score / questions.length * 100) : 0;

  // Save to sessionStorage
  sessionStorage.setItem(
    "testResult",
    JSON.stringify({
      result: { correct, incorrect, unanswered, score, percentage, Answers: answers },
      questions,
      submittedAnswers: selectedOptions,
      testDetails: {
        course,
        subject,
        chapter,
        questionIds: questions.map(q => q._id),
        date: new Date().toISOString(),
        duration: duration, // in sec
        totalMarks: questions.length,
        testType
      }
    })
  );

  // Clean sessionStorage test state
  sessionStorage.removeItem("testState");
  sessionStorage.removeItem("testEndTime");

  // Redirect to result page
  window.location.href = "/dashboard/student/result";
};


useEffect(() => {
  // Prevent Back/Forward navigation
  window.history.pushState(null, "", window.location.href);
  const handlePopState = () => {
    window.history.pushState(null, "", window.location.href);
    alert("You cannot navigate away during the test!");
  };
  window.addEventListener("popstate", handlePopState);

  // Block reload (F5 / Ctrl+R / Right-click reload)
  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      (e.key === "F5") ||
      ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r")
    ) {
      e.preventDefault();
      alert("Reload is disabled during the test!");
    }
  };
  window.addEventListener("keydown", handleKeyDown);

  // Optional: block context menu reload
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };
  window.addEventListener("contextmenu", handleContextMenu);

  return () => {
    window.removeEventListener("popstate", handlePopState);
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("contextmenu", handleContextMenu);
  };
}, []);

  if (loading)
    return (
   <Loading />
    );

    const totalQuestions = questions.length;
const answeredQuesCount = Object.keys(selectedOptions).length;
const leftCount = totalQuestions - answeredQuesCount;

// alert(`${testType === "mock" } ${subjects.length > 1} ${questions.length>25}`)
  return (
    <Box>
      {/* Top sticky div with Tabs + Pagination */}
      {(testType === "mock" || subjects.length > 1 || questions.length>25) && (<Box
        sx={{

          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: testType === "mock" && subjects.length > 1 ?"space-between":"end",
          border: "1px solid #ddd",
          borderRadius: 2,
          bgcolor: "#fff",
          px: 2,
          py: 1,
          mx: 2,
          // position: "sticky",
          top: 0,
          mb: 1,
          zIndex: 99,
        }}
      >
        {testType === "mock" && subjects.length > 1 && (
        <Tabs
          value={subjectTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ flexGrow: 1 }}
        >
          {subjects.map((sub) => (
            
            <Tab key={sub} label={sub} value={sub} />
          ))}
        </Tabs>
        )}
        {totalPanelPages > 1 && (
          <Box mt={{ xs: 1, md: 0 }} >{renderPagination(totalPanelPages, activePage)}</Box>
        )}
      </Box>
      )}

      <Grid container spacing={2} sx={{ px: 2 }}>
        {/* Left Side - Questions */}
        <Grid item xs={12} md={8} alignItems={"center"} display={"flex"} flexDirection={"column"}>
          {/* Timer */}
          <Box
            sx={{
              fontWeight: 500,
              py: 1,
              px: window.innerWidth > 400 ? 10 : 3,
              textAlign: "center",
              borderRadius: 2,
              position: isTimerSticky ? "fixed" : "unset",
              top: isTimerSticky ? 80 : "auto",
              width: isTimerSticky
                ? { xs: "95%", md: "550px", lg: "700px" }
                : { xs: "100%", md: "100%" },
              zIndex: 100,
              bgcolor: "#fff59d",
              border: "1px solid #fdd835",
              display:"flex",
              justifyContent:"space-between",
              mb: 2,
              transition: "top 0.5s",
            }}
          >
            <Box>Time Left: {formatTime(timeLeft)}</Box>
            <Box>Ques. Left: {leftCount}</Box>

          </Box>

          {/* Questions */}
          {panelQuestions.map((q, idx) => {
            const globalIdx = (activePage - 1) * QUESTIONS_PER_PANEL_PAGE + idx;
            return (
              <div key={q._id} style={{width:"100%"}} ref={(el) => (questionRefs.current[globalIdx] = el)}>
                <QuestionCard
                  index={globalIdx}
                  data={q}
                  selectedOption={selectedOptions[q._id] ?? null}
                  onSelect={(optionIdx) => handleSelectOption(q._id, optionIdx)}
                />
              </div>
            );
          })}

          {/* Mobile Submit */}
          <Box display={{ xs: "block", md: "none" }} sx={{width:"100%"}} mt={2}>
            <Button fullWidth color="error" variant="contained" onClick={handleSubmit}>
              Submit Test
            </Button>
          </Box>
        </Grid>

        {/* Right Side - Navigator */}
        <Grid item xs={0} md={4} sx={{ px: 2 }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              boxShadow: 3,
              position: isPanelSticky ? "fixed" : "relative",
              top: isPanelSticky ? 85 : "auto",
              width: isPanelSticky ? (window.innerWidth < 900 ? "calc(100% - 16px)" : "27%") : "100%",
              zIndex: 90,
              display: { xs: "none", md: "block" },
              maxHeight: "80vh",
              overflowY: "auto",
              transition: "top 0.5s",
            }}
          >
            <Typography variant="h6" mb={1}>
              Questions
            </Typography>

            {/* Answered / Unanswered (active tab only) */}
            <Box mt={2} mb={2} display="flex" justifyContent="space-between">
              <Typography color="success.main">Answered: {answeredCount}</Typography>
              <Typography color="error">Unanswered: {unansweredCount}</Typography>
            </Box>

            <Grid container spacing={1} >
              {panelQuestions.map((q, idx) => {
                const globalIdx = (activePage - 1) * QUESTIONS_PER_PANEL_PAGE + idx;
                const answered = selectedOptions[q._id] !== undefined;
                return (
                  <Grid item xs={2} key={q._id}>
                    <button
                      style={{
                        width: "100%",
                        fontWeight: 600,
                        padding: "5px",
                        borderRadius: "4px",
                        backgroundColor: answered ? "#4caf50" : "#f9f9f9ff",
                        color: answered ? "#fff" : "#000",
                        cursor: "pointer",
                        border: "1px solid #ccc",
                        transition: "background 0.2s",
                        boxShadow: answered
                          ? "0 2px 6px rgba(76,175,80,0.15)"
                          : "0 1px 3px rgba(0,0,0,0.07)",
                      }}
                      onClick={() => scrollToQuestion(globalIdx)}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = answered
                          ? "#43a047"
                          : "#bdbdbd";
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = answered
                          ? "#4caf50"
                          : "#f9f9f9ff";
                      }}
                    >
                      {globalIdx + 1}
                    </button>
                  </Grid>
                );
              })}
            </Grid>

            {/* Submit Button */}
            <Button
              fullWidth
              color="error"
              variant="contained"
              sx={{ mt: 1 }}
              onClick={handleSubmit}
            >
              Submit Test
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
