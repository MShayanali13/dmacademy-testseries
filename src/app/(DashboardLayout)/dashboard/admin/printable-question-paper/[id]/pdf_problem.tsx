// // components/QuestionPaperPDF.tsx
// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "next/navigation";
// import { Question } from "@/types/questionType";

// interface QuestionPaper {
//   title: string;
//   date: string;
//   duration: number;
//   totalMarks: number;
//   questionIds: [];
//   course: string;
//   subject?: string;
//   chapter?: string;
// }

// export default function QuestionPaperPDF() {
//   const { id } = useParams();
//   const [test, setTest] = useState<QuestionPaper | null>(null);

//   const [questions, setQuestions] = useState<Question[]>([]);

// useEffect(() => {
//   const fetchData = async () => {
//     const res = await axios.post("/api/Get_Question-Paper", { id });
//     setTest(res.data.test);
//     setQuestions(res.data.questions); // <- Add this
//   };
//   fetchData();
// }, [id]);

//   if (!test) return null;

//   return (
//     <div className="w-[210mm] min-h-[297mm] bg-white  border border-black mx-auto my-4 text-sm">
//       {/* Top Bar */}
//       <div className="w-full border-b border-black flex justify-between items-center mb-2">
//         <div className="w-[85%] ">
//           <h1 className="text-xl font-semibold px-5 py-4 uppercase">
//             D. M. Academy
//           </h1>
//         </div>
//         <div className="w-[15%] bg-black font-semibold text-white text-center p-4">
//           <p className="font-semibold  text-xl h-full">{test.course.toUpperCase()}</p>
//         </div>
//       </div>

//       {/* Instruction Box */}
//       <div className="border-b border-black mb-2 py-2 px-5 flex">
//         <div className="w-[50%]">
//         <h2 className="text-lg font-semibold mb-1">Instructions:</h2>
//         <ul className="list-disc ml-5 text-md space-y-1">
//           <li>All questions are compulsory unless stated otherwise.</li>
//           <li>Read each question carefully before answering.</li>
//           <li>No use of calculators or mobile phones allowed.</li>
//         </ul>
// </div>
//         <div className="border border-dashed rounded-md p-2 mt-2 text-center bg-gray-100 text-md italic font-medium w-[50%]">
//           🌟 Best of Luck! Do Your Best. 🌟🌟 Best of Luck! Do Your Best. 🌟
//           🌟 Best of Luck! Do Your Best. 🌟🌟 Best of Luck! Do Your Best. 🌟
//           🌟 Best of Luck! Do Your Best. 🌟🌟 Best of Luck! Do Your Best. 🌟
//         </div>
//       </div>

//       {/* Metadata Row */}
//       <div className="w-full py-2 px-5 flex justify-between text-md mb-1">
//         <div className="flex flex-col">
//           <span><strong>Date:</strong> {new Date(test.date).toLocaleDateString()}</span>
//           <span><strong>Duration:</strong> {test.duration / 60} hr</span>
//         </div>
//         <div className="flex flex-col text-right">
//           <span><strong>Marks:</strong> {test.totalMarks}</span>
//           <span><strong>Total Questions:</strong> {test.questionIds.length}</span>
//         </div>
//       </div>

//       {/* Course and Subject */}
//       <div className="w-full px-5 py-2 border-y-2 font-bold border-black text-xl text-center mb-1">
//         {test.course}{test.subject ? ` (${test.subject})` : ""}
//       </div>

//       {/* Chapter (if present) */}
//       {test.chapter && (
//         <div className="w-full border-b px-5 py-2 font-bold border-black text-md text-center italic mb-1">
//           Chapter: {test.chapter}
//         </div>
//       )}

//       {/* Questions Section — will add later */}
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Question } from "@/types/questionType";
import html2pdf from "html2pdf.js";

interface QuestionPaper {
  title: string;
  date: string;
  duration: number;
  totalMarks: number;
  questionIds: [];
  course: string;
  subject?: string;
  chapter?: string;
}

const PAGE_HEIGHT_MM = 297;
const PAGE_WIDTH_MM = 210;

// How many questions per page? (you can tune this)
const QUESTIONS_PER_PAGE = 14;

function TopBar({ course }: { course: string }) {
  return (
     <div className="w-full border-b border-black flex justify-between items-center mb-2">
         <div className="w-[85%] ">
           <h1 className="text-xl font-semibold px-5 py-4 uppercase">
             D. M. Academy
           </h1>
         </div>
         <div className="w-[15%] bg-black font-semibold text-white text-center p-4">
           <p className="font-semibold  text-xl h-full">{course.toUpperCase()}</p>
         </div>
       </div>
  );
}

function QuestionItem({ question, index }: { question: Question; index: number }) {
  return (
    <div className="p-2  text-xs mb-2 break-inside-avoid">
      <p className="mb-1 font-semibold">
        Q{index + 1}.{"  "}
        {question.questionType === "text" ? (
          question.question.text
        ) : (
          <img src={question.question.imgUrl} alt="Question" className="max-w-full" />
        )}
      </p>
      <ul className="pl-4 ">
        {question.options.map((opt, idx) => (
          <li key={idx}>
            {question.optionType === "text" ? (
              opt.text
            ) : (
              <img
                src={opt.imgUrl}
                alt={`Option ${idx + 1}`}
                className="max-w-full"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


export default function QuestionPaperPDF({ id }: { id: string }) {
  const router = useRouter();
  const [test, setTest] = useState<QuestionPaper | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [autoDownloadTriggered, setAutoDownloadTriggered] = useState(false);
const [showModal, setShowModal] = useState(false);

  // useEffect(() => {
  //   // Show modal after short delay to ensure content renders
  //   const timer = setTimeout(() => {
  //     setShowModal(true);
  //   }, 300);
  //   return () => clearTimeout(timer);
  // }, []);

useEffect(() => {
  if (!test || questions.length === 0 || !pdfRef.current) return;

  const timeout = setTimeout(() => {
    // Fallback to modal if download didn't happen
    if (!autoDownloadTriggered) {
      setShowModal(true);
    }
  }, 4000); // Wait 4s to allow for rendering

  // Auto download after slight delay
  const downloadTimeout = setTimeout(() => {
    html2pdf()
      .set({
        margin: 10,
        filename: `QuestionPaper-${id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(pdfRef.current!)
      .save()
      .then(() => {
        setAutoDownloadTriggered(true);
        router.push("/dashboard/admin/manage-question-paper");
      });
  }, 1500); // Delay download by 1.5s after render

  return () => {
    clearTimeout(timeout);
    clearTimeout(downloadTimeout);
  };
}, [test, questions]);

useEffect(() => {
  if (!test || questions.length === 0) return;

  const timeout = setTimeout(() => {
    if (!pdfRef.current) return;
    html2pdf()
      .set({
        margin: 10,
        filename: `QuestionPaper-${id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(pdfRef.current)
      .save()
      .then(() => {
        setAutoDownloadTriggered(true);
        setTimeout(() => {
          router.push("/dashboard/admin/manage-question-paper");
        }, 500); // short delay after save
      });
  }, 2500); // wait longer for rendering

  return () => clearTimeout(timeout);
}, [test, questions]);


const handleDownload = () => {
  console.log(pdfRef)
  // if (!pdfRef.current) return;

  html2pdf()
    .set({
      margin: 10,
      filename: `QuestionPaper-${id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(pdfRef.current)
    .save()
    .then(() => {
      setAutoDownloadTriggered(true);
      router.push("/dashboard/admin/manage-question-paper");
    });
};


  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.post("/api/Get_Question-Paper", { id });
      setTest(res.data.test);
      setQuestions(res.data.questions);
    };
    fetchData();
  }, [id]);

  if (!test) return null;

  // Split questions into pages
  const pages: Question[][] = [];
  for (let i = 0; i < questions.length; i += QUESTIONS_PER_PAGE) {
    pages.push(questions.slice(i, i + QUESTIONS_PER_PAGE));
  }

  // Split questions on each page into left and right columns
  const splitColumns = (pageQuestions: Question[]) => {
    const half = Math.ceil(pageQuestions.length / 2);
    return {
      left: pageQuestions.slice(0, half),
      right: pageQuestions.slice(half),
    };
  };


// useEffect(() => {
//   if (!test || questions.length === 0) return;

//   const timeout = setTimeout(() => {
//     if (pdfRef.current) {
//       const opt = {
//         margin: 0,
//         filename: `${test.title || "Question-Paper"}.pdf`,
//         image: { type: "jpeg", quality: 0.98 },
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//       };

//       html2pdf()
//         .from(pdfRef.current)
//         .set(opt)
//         .save()
//         .then(() => {
//           router.push("/dashboard/admin/generate-question-paper"); // 👈 replace with actual path
//         });
//     }
//   }, 5000); // Give it 1s to ensure rendering is complete

//   return () => clearTimeout(timeout);
// }, [test, questions]);
  return (
//     <div  ref={pdfRef}  className="bg-white  mx-auto my-4" style={{ width: "210mm" }}>
//          <TopBar course={test.course} />


//        {/* Instruction Box */}
//        <div className="border-b border-black mb-2 py-2 px-5 flex">
//          <div className="w-[50%]">
//          <h2 className="text-lg font-semibold mb-1">Instructions:</h2>
//          <ul className="list-disc ml-5 text-md space-y-1">
//            <li>All questions are compulsory unless stated otherwise.</li>
//            <li>Read each question carefully before answering.</li>
//            <li>No use of calculators or mobile phones allowed.</li>
//          </ul>
//  </div>
//          <div className="border border-dashed rounded-md p-2 mt-2 text-center bg-gray-100 text-md italic font-medium w-[50%]">
//            🌟 Best of Luck! Do Your Best. 🌟🌟 Best of Luck! Do Your Best. 🌟
//            🌟 Best of Luck! Do Your Best. 🌟🌟 Best of Luck! Do Your Best. 🌟
//            🌟 Best of Luck! Do Your Best. 🌟🌟 Best of Luck! Do Your Best. 🌟
//          </div>
//        </div>

//        {/* Metadata Row */}
//        <div className="w-full py-2 px-5 flex justify-between text-md mb-1">
//          <div className="flex flex-col">
//            <span><strong>Date:</strong> {new Date(test.date).toLocaleDateString()}</span>
//            <span><strong>Duration:</strong> {test.duration / 60} hr</span>
//          </div>
//          <div className="flex flex-col text-right">
//            <span><strong>Marks:</strong> {test.totalMarks}</span>
//            <span><strong>Total Questions:</strong> {test.questionIds.length}</span>
//          </div>
//        </div>

//        {/* Course and Subject */}
//        <div className="w-full px-5 py-2 border-y-2 font-bold border-black text-xl text-center mb-1">
//          {test.course}{test.subject ? ` (${test.subject})` : ""}
//        </div>

//        {/* Chapter (if present) */}
//        {test.chapter && (
//          <div className="w-full border-b px-5 py-2 font-bold border-black text-md text-center italic mb-1">
//            Chapter: {test.chapter}
//          </div>
//        )}
//       {pages.map((pageQuestions, pageIndex) => {
//         const { left, right } = splitColumns(pageQuestions);

//         return (
//           <div
//             key={pageIndex}
//             className=" bg-white  mx-auto my-4 text-sm border border-black mb-8"
//             style={{
//               minHeight: "297mm",
//               padding: "10mm",
//               boxSizing: "border-box",
//               pageBreakAfter: "always",
//             }}
//           >

//             {/* Repeat TopBar on every page */}
//             <TopBar course={test.course} />

          

//             {/* Questions in two columns */}
//             <div className="flex gap-2 px-5">
//               {/* Left column */}
//               <div className="w-1/2 border-r ">
//                 {left.map((q, i) => (
//                   <QuestionItem key={q._id} question={q} index={pageIndex * QUESTIONS_PER_PAGE + i} />
//                 ))}
//               </div>

//               {/* Right column */}
//               <div className="w-1/2 border-l ">
//                 {right.map((q, i) => (
//                   <QuestionItem key={q._id} question={q} index={pageIndex * QUESTIONS_PER_PAGE + left.length + i} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
 <> {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
      <h2 className="text-xl font-bold mb-4">Download Not Started</h2>
      <p className="mb-4">Click the button below to download the PDF manually.</p>
      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Download PDF
      </button>
    </div>
  </div>
)}

  <div ref={pdfRef} className="bg-white  mx-auto my-4" style={{ width: "210mm" }}>

    {/* ✅ First page with header + instructions + first page questions */}
    <div
      className="bg-white mx-auto my-4 text-sm border border-black mb-8"
      style={{
        minHeight: "297mm",
        // padding: "10mm",
        boxSizing: "border-box",
        pageBreakAfter: "always",
      }}
    >
      <TopBar course={test.course} />

      {/* ✅ Show instructions ONLY on this page */}
      <div className="border-b border-black mb-2 py-2 px-5 flex">
        <div className="w-[50%]">
          <h2 className="text-lg font-semibold mb-1">Instructions:</h2>
          <ul className="list-disc ml-5 text-md space-y-1">
            <li>All questions are compulsory unless stated otherwise.</li>
            <li>Read each question carefully before answering.</li>
            <li>No use of calculators or mobile phones allowed.</li>
          </ul>
        </div>
        <div className="border border-dashed rounded-md p-2 mt-2 text-center bg-gray-100 text-md italic font-medium w-[50%]">
          🌟 Best of Luck! Do Your Best. 🌟🌟 Best of Luck! Do Your Best. 🌟
        </div>
      </div>

      {/* Metadata Row */}
      <div className="w-full py-2 px-5 flex justify-between text-md mb-1">
        <div className="flex flex-col">
          <span><strong>Date:</strong> {new Date(test.date).toLocaleDateString()}</span>
          <span><strong>Duration:</strong> {test.duration / 60} hr</span>
        </div>
        <div className="flex flex-col text-right">
          <span><strong>Marks:</strong> {test.totalMarks}</span>
          <span><strong>Total Questions:</strong> {test.questionIds.length}</span>
        </div>
      </div>

      {/* Course/Subject/Chapter */}
      <div className="w-full px-5 py-2 border-y-2 font-bold border-black text-xl text-center mb-1">
        {test.course}{test.subject ? ` (${test.subject})` : ""}
      </div>
      {test.chapter && (
        <div className="w-full border-b px-5 py-2 font-bold border-black text-md text-center italic mb-1">
          Chapter: {test.chapter}
        </div>
      )}

      {/* ✅ First page questions only */}
      <div className="flex gap-2 px-5">
        <div className="w-1/2 border-r">
          {splitColumns(pages[0]).left.map((q, i) => (
            <QuestionItem key={q._id} question={q} index={i} />
          ))}
        </div>
        <div className="w-1/2 border-l">
          {splitColumns(pages[0]).right.map((q, i) => (
            <QuestionItem key={q._id} question={q} index={splitColumns(pages[0]).left.length + i} />
          ))}
        </div>
      </div>
    </div>

    {/* ✅ Remaining pages WITHOUT instructions */}
    {pages.slice(1).map((pageQuestions, pageIndex) => {
      const { left, right } = splitColumns(pageQuestions);
      return (
        <div
          key={pageIndex + 1}
          className="bg-white mx-auto my-4 text-sm border border-black mb-8"
          style={{
            minHeight: "297mm",
            padding: "10mm",
            boxSizing: "border-box",
            pageBreakAfter: "always",
          }}
        >
          <TopBar course={test.course} />

          <div className="flex gap-2 px-5">
            <div className="w-1/2 border-r">
              {left.map((q, i) => (
                <QuestionItem
                  key={q._id}
                  question={q}
                  index={(pageIndex + 1) * QUESTIONS_PER_PAGE + i}
                />
              ))}
            </div>
            <div className="w-1/2 border-l">
              {right.map((q, i) => (
                <QuestionItem
                  key={q._id}
                  question={q}
                  index={(pageIndex + 1) * QUESTIONS_PER_PAGE + left.length + i}
                />
              ))}
            </div>
          </div>
        </div>
      );
    })}
  </div>
</>
  );
}


