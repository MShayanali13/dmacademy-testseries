// // both
// "use client";

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { Question } from "@/types/questionType";
// import {Button} from "@mui/material/"

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

// const QUESTIONS_PER_PAGE = 12;

// export default function QuestionPaperPDF({ id }: { id: string }) {
//   const router = useRouter();
//   const pdfRef = useRef<HTMLDivElement>(null);
//   const [test, setTest] = useState<QuestionPaper | null>(null);
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [showModal, setShowModal] = useState(true);
//   const [countdown, setCountdown] = useState(5);
//   const [hasDownloaded, setHasDownloaded] = useState(false);
  
//   const [fetched, setFetched] = useState(false);


//   // Fetch data
//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await axios.post("/api/Get_Question-Paper", { id });
//       setTest(res.data.test);
//       setQuestions(res.data.questions);
//       setFetched(true)
//     };
//     fetchData();
//   }, [id]);

//   // Auto download with countdown
// //   useEffect(() => {
// //     if (!showModal || hasDownloaded||!test || questions.length === 0) return;
// //  if (countdown <= 0) {
// //     triggerDownload();
// //     return;
// //   }

// //   const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
// //   return () => clearTimeout(timer);
// //     // const timerInterval = setInterval(() => {
// //     //   setCountdown((prev) => {
// //     //     if (prev <= 1) {
// //     //       clearInterval(timerInterval);
// //     //       triggerDownload(); // Auto download when countdown finishes
// //     //       return 0;
// //     //     }
// //     //     return prev - 1;
// //     //   });
// //     // }, 1000);

// //     // return () => clearInterval(timerInterval);

// // }, [countdown, showModal, hasDownloaded]);
// // // Download Function
// // const triggerDownload = async () => {
// //   if (hasDownloaded) return;
// //   setHasDownloaded(true);

// //   if (pdfRef.current) {
// //     const canvas = await html2canvas(pdfRef.current, {
// //       scale: 2,
// //       useCORS: true,
// //       backgroundColor: "#ffffff",
// //     });

// //     const imgData = canvas.toDataURL("image/png");
// //     const pdf = new jsPDF("p", "mm", "a4");
// //     const pdfWidth = pdf.internal.pageSize.getWidth();
// //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

// //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
// //     pdf.save(`${test?.title || "QuestionPaper"}.pdf`);

// //     setShowModal(false);
// //     router.push("/dashboard/admin/manage-questionPaper");
// //   }
// // };

// // // Cancel download if clicked
// // const handleManualDownload = () => {
// //   triggerDownload();
// //   setShowModal(false);
// // };
// useEffect(() => {
//   // if (hasDownloaded || !fetched) return;

//   if (countdown > 0) {
//     const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
//     return () => clearTimeout(timer);
//   } 
//    if (countdown === 1) {
//     triggerDownload();
//   }
// }, [countdown, showModal, hasDownloaded]);

// // Trigger download
// const triggerDownload = async () => {
//   if (hasDownloaded || !fetched) return;
//   setHasDownloaded(true);

//   if (pdfRef.current) {
//     const canvas = await html2canvas(pdfRef.current, {
//       scale: 1,
//       useCORS: true,
//       backgroundColor: "#ffffff",
//     });

//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`${test?.title || "QuestionPaper"}.pdf`);

//     setShowModal(false);
//     router.push("/dashboard/admin/manage-questionPaper");
//   }
// };

// // Manual trigger
// const handleManualDownload = () => {
//   triggerDownload();
// };

// // Auto download after countdown
// useEffect(() => {
//   if (countdown <= 0 && !hasDownloaded) {
//     triggerDownload();
//   }
// }, [countdown]);

//   if (!test) return null;

//   // Pagination logic
//   const pages: Question[][] = [];
//   for (let i = 0; i < questions.length; i += QUESTIONS_PER_PAGE) {
//     pages.push(questions.slice(i, i + QUESTIONS_PER_PAGE));
//   }

//   const splitColumns = (pageQuestions: Question[]) => {
//     const half = Math.ceil(pageQuestions.length / 2);
//     return { left: pageQuestions.slice(0, half), right: pageQuestions.slice(half) };
//   };

//   return (
//     <>
//       {/* Modal */}
//       {showModal && (
//    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
//         <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fadeIn">
//           {/* Countdown Circle */}
//           <div className="relative w-24 h-24 mx-auto mb-4">
//             <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
//               <circle cx="48" cy="48" r="45" stroke="#e5e7eb" strokeWidth="5" fill="none" />
//               <circle
//                 cx="48" cy="48" r="45"
//                 stroke="#3b82f6" strokeWidth="5" fill="none"
//                 strokeDasharray={`${(countdown / 5) * 282.6}, 282.6`}
//                 strokeLinecap="round"
//                 className="transition-all duration-1000 ease-linear"
//               />
//             </svg>
//             <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
//               {countdown}
//             </span>
//           </div>

//           <p className="text-lg mb-4">Downloading in {countdown} seconds…</p>
//           <Button
//           // disable={co}
//           disabled={countdown>0}
//             onClick={handleManualDownload}
//             className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
//           >
//             Download Manually
//           </Button>
//         </div>
//       </div>
// )}


//       {/* PDF Content */}
//       <div
//         ref={pdfRef}
//         id="pdf"
//         className="bg-white text-black mx-auto my-4 px-2 py-2 border"
//         style={{ width: "210mm", background: "#ffffff", color: "#000000" }}
//       >
//         {/* ✅ First Page */}
//         <div
//           className="border border-black mb-8 "
//           style={{ minHeight: "500mm", pageBreakAfter: "always" }}
//         >
//           {/* TopBar */}
//           <div className="w-full border-b border-black flex justify-between items-center mb-2">
//             <div className="w-[85%]">
//               <h1 className="text-xl font-semibold px-5 py-3 uppercase">
//                 D. M. Academy
//               </h1>
//             </div>
//             <div className="w-[15%] bg-black text-white text-center px-4 py-3 font-bold text-xl">
//               {test.course.toUpperCase()}
//             </div>
//           </div>

//           {/* Instructions */}
//           <div className="border-b border-black mb-2 py-2 px-5 flex">
//             <div className="w-1/2">
//               <h2 className="text-lg font-semibold mb-1">Instructions:</h2>
//               <ul className="list-disc ml-5 space-y-1 text-md">
//                 <li>All questions are compulsory unless stated otherwise.</li>
//                 <li>Read each question carefully before answering.</li>
//                 <li>No calculators or mobile phones allowed.</li>
//               </ul>
//             </div>
//             <div className="border border-dashed rounded-md p-2 mt-2 text-center italic font-medium w-1/2">
//               Best of Luck! Do Your Best.
//             </div>
//           </div>

//           {/* Metadata */}
//           <div className="w-full py-2 px-5 flex justify-between text-md mb-1">
//             <div className="flex flex-col">
//               <span>
//                 <strong>Date:</strong> {new Date(test.date).toLocaleDateString()}
//               </span>
//               <span>
//                 <strong>Duration:</strong> {test.duration / 60} hr
//               </span>
//             </div>
//             <div className="flex flex-col text-right">
//               <span>
//                 <strong>Marks:</strong> {test.totalMarks}
//               </span>
//               <span>
//                 <strong>Total Questions:</strong> {test.questionIds.length}
//               </span>
//             </div>
//           </div>

//           {/* Course/Subject/Chapter */}
//           <div className="w-full px-5 py-2 border-y-2 font-bold border-black text-xl text-center mb-1">
//             {test.course}
//             {test.subject!=="-" ? ` (${test.subject})` : ""}
//           </div>
//           {test.chapter!=="-" && (
//             <div className="w-full border-b px-5 py-2 font-bold border-black text-md text-center italic mb-1">
//               Chapter: {test.chapter}
//             </div>
//           )}

//           {/* Questions */}
//           <div className="flex gap-2 px-5 ">
//             <div className="w-1/2 border-r h-[1250px]">
//               {splitColumns(pages[0]).left.map((q, i) => (
//                 <div key={q._id} className="p-2 text-xs mb-2 break-inside-avoid">
//                   <p className="mb-1 font-semibold">
//                     Q{i + 1}.{" "}
//                     {q.questionType === "text" ? (
//                       <span>{q.question.text}</span>
//                     ) : (
//                       <img
//                         src={q.question.imgUrl}
//                         alt="Question"
//                         className="ml-7 -mt-2 max-w-[300px]"
//                       />
//                     )}
//                   </p>
//                   <ul className="pl-4">
//                     {q.options.map((opt, idx) => (
//                       <li key={idx}>
//                         {q.optionType === "text" ? (
//                           <span>{opt.text}</span>
//                         ) : (
//                           <img
//                             src={opt.imgUrl}
//                             alt={`Option ${idx + 1}`}
//                             className="max-w-[80px]"
//                           />
//                         )}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//             <div className="w-1/2 border-l h-[1250px]">
//               {splitColumns(pages[0]).right.map((q, i) => (
//                 <div key={q._id} className="p-2 text-xs mb-2 break-inside-avoid">
//                   <p className="mb-1 font-semibold">
//                     Q{splitColumns(pages[0]).left.length + i + 1}.{" "}
//                     {q.questionType === "text" ? (
//                       q.question.text
//                     ) : (
//                       <img
//                         src={q.question.imgUrl}
//                         alt="Question"
//                         className="ml-7 -mt-2 max-w-[300px]"
//                       />
//                     )}
//                   </p>
//                   <ul className="pl-4">
//                     {q.options.map((opt, idx) => (
//                       <li key={idx}>
//                         {q.optionType === "text" ? (
//                           opt.text
//                         ) : (
//                           <img
//                             src={opt.imgUrl}
//                             alt={`Option ${idx + 1}`}
//                             className="max-w-[80px]"
//                           />
//                         )}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ✅ Remaining Pages */}
//         {pages.slice(1).map((pageQuestions, pageIndex) => {
//           const { left, right } = splitColumns(pageQuestions);
//           return (
//             <div
//               key={pageIndex + 1}
//               className="border border-black mb-8"
//               style={{ minHeight: "500mm", pageBreakAfter: "always" }}
//             >
//               <div className="w-full border-b border-black flex justify-between items-center mb-2">
//                 <div className="w-[85%]">
//                   <h1 className="text-xl font-semibold px-5 py-4 uppercase">
//                     D. M. Academy
//                   </h1>
//                 </div>
//                 <div className="w-[15%] bg-black text-white text-center p-4 font-bold text-xl">
//                   {test.course.toUpperCase()}
//                 </div>
//               </div>

//               <div className="flex gap-2 px-5">
//                 <div className="w-1/2 border-r h-[1250px]">
//                   {left.map((q, i) => (
//                     <div key={q._id} className="p-2 text-xs mb-2 break-inside-avoid">
//                       <p className="mb-1 font-semibold">
//                         Q{(pageIndex + 1) * QUESTIONS_PER_PAGE + i + 1}.{" "}
//                         {q.questionType === "text" ? (
//                           q.question.text
//                         ) : (
//                           <img
//                             src={q.question.imgUrl}
//                             alt="Question"
//                             className="ml-7 -mt-2 max-w-[300px]"
//                           />
//                         )}
//                       </p>
//                       <ul className="pl-4">
//                         {q.options.map((opt, idx) => (
//                           <li key={idx}>
//                             {q.optionType === "text" ? (
//                               opt.text
//                             ) : (
//                               <img
//                                 src={opt.imgUrl}
//                                 alt={`Option ${idx + 1}`}
//                                 className="max-w-[80px]"
//                               />
//                             )}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="w-1/2 border-l  h-[1250px]">
//                   {right.map((q, i) => (
//                     <div key={q._id} className="p-2 text-xs mb-2 break-inside-avoid">
//                       <p className="mb-1 font-semibold">
//                         Q{(pageIndex + 1) * QUESTIONS_PER_PAGE + left.length + i + 1}.{" "}
//                         {q.questionType === "text" ? (
//                           q.question.text
//                         ) : (
//                           <img
//                             src={q.question.imgUrl}
//                             alt="Question"
//                             className="ml-7 -mt-2 max-w-[300px]"
//                           />
//                         )}
//                       </p>
//                       <ul className="pl-4">
//                         {q.options.map((opt, idx) => (
//                           <li key={idx}>
//                             {q.optionType === "text" ? (
//                               opt.text
//                             ) : (
//                               <img
//                                 src={opt.imgUrl}
//                                 alt={`Option ${idx + 1}`}
//                                 className="max-w-[80px]"
//                               />
//                             )}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
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

// const QUESTIONS_PER_PAGE = 14;

// export default function QuestionPaperPDF({ id }: { id: string }) {
//   const router = useRouter();
//   const pdfRef = useRef<HTMLDivElement>(null);
//   const [test, setTest] = useState<QuestionPaper | null>(null);
//   const [questions, setQuestions] = useState<Question[]>([]);

//   // Fetch data
//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await axios.post("/api/Get_Question-Paper", { id });
//       setTest(res.data.test);
//       setQuestions(res.data.questions);
//     };
//     fetchData();
//   }, [id]);

//   // Auto download after render
//   useEffect(() => {
//     if (!test || questions.length === 0) return;
//     const timer = setTimeout(async () => {
//       if (pdfRef.current) {
//         const canvas = await html2canvas(pdfRef.current, {
//           scale: 2,
//           useCORS: true,
//           backgroundColor: "#ffffff",
//         });

//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");
//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//         pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//         pdf.save(`${test.title || "QuestionPaper"}.pdf`);

//         router.push("/dashboard/admin/manage-questionPaper");
//       }
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [test, questions]);

//   if (!test) return null;

//   // Pagination logic
//   const pages: Question[][] = [];
//   for (let i = 0; i < questions.length; i += QUESTIONS_PER_PAGE) {
//     pages.push(questions.slice(i, i + QUESTIONS_PER_PAGE));
//   }

//   const splitColumns = (pageQuestions: Question[]) => {
//     const half = Math.ceil(pageQuestions.length / 2);
//     return { left: pageQuestions.slice(0, half), right: pageQuestions.slice(half) };
//   };

//   return (
    
//     <div ref={pdfRef} id="pdf" className="bg-white text-black mx-auto my-4" style={{ width: "210mm" , background: "#ffffff",
//     color: "#000000",       }}>

//       {/* ✅ First Page */}
//       <div className="border border-black mb-8" style={{ minHeight: "297mm", pageBreakAfter: "always" }}>
//         {/* TopBar inline */}
//         <div className="w-full border-b border-black flex justify-between items-center mb-2">
//           <div className="w-[85%]">
//             <h1 className="text-xl font-semibold px-5 py-4 uppercase">D. M. Academy</h1>
//           </div>
//           <div className="w-[15%] bg-black text-white text-center p-4 font-bold text-xl">
//             {test.course.toUpperCase()}
//           </div>
//         </div>

//         {/* Instructions */}
//         <div className="border-b border-black mb-2 py-2 px-5 flex">
//           <div className="w-1/2">
//             <h2 className="text-lg font-semibold mb-1">Instructions:</h2>
//             <ul className="list-disc ml-5 space-y-1 text-md">
//               <li>All questions are compulsory unless stated otherwise.</li>
//               <li>Read each question carefully before answering.</li>
//               <li>No calculators or mobile phones allowed.</li>
//             </ul>
//           </div>
//           <div className="border border-dashed rounded-md p-2 mt-2 text-center  italic font-medium w-1/2">
//              Best of Luck! Do Your Best. 
//           </div>
//         </div>

//         {/* Metadata */}
//         <div className="w-full py-2 px-5 flex justify-between text-md mb-1">
//           <div className="flex flex-col">
//             <span><strong>Date:</strong> {new Date(test.date).toLocaleDateString()}</span>
//             <span><strong>Duration:</strong> {test.duration / 60} hr</span>
//           </div>
//           <div className="flex flex-col text-right">
//             <span><strong>Marks:</strong> {test.totalMarks}</span>
//             <span><strong>Total Questions:</strong> {test.questionIds.length}</span>
//           </div>
//         </div>

//         {/* Course/Subject/Chapter */}
//         <div className="w-full px-5 py-2 border-y-2 font-bold border-black text-xl text-center mb-1">
//           {test.course}{test.subject ? ` (${test.subject})` : ""}
//         </div>
//         {test.chapter && (
//           <div className="w-full border-b px-5 py-2 font-bold border-black text-md text-center italic mb-1">
//             Chapter: {test.chapter}
//           </div>
//         )}

//         {/* Questions */}
//         <div className="flex gap-2 px-5">
//           <div className="w-1/2 border-r">
//             {splitColumns(pages[0]).left.map((q, i) => (
//               <div key={q._id} className="p-2 text-xs mb-2 break-inside-avoid">
//                 <p className="mb-1 font-semibold">
//                   Q{i + 1}.{" "}
//                   {q.questionType === "text" ? (
//                     q.question.text
//                   ) : (
//                     <img src={q.question.imgUrl} alt="Question" className="max-w-full" />
//                   )}
//                 </p>
//                 <ul className="pl-4">
//                   {q.options.map((opt, idx) => (
//                     <li key={idx}>
//                       {q.optionType === "text" ? (
//                         opt.text
//                       ) : (
//                         <img src={opt.imgUrl} alt={`Option ${idx + 1}`} className="max-w-full" />
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//           <div className="w-1/2 border-l">
//             {splitColumns(pages[0]).right.map((q, i) => (
//               <div key={q._id} className="p-2 text-xs mb-2 break-inside-avoid">
//                 <p className="mb-1 font-semibold">
//                   Q{splitColumns(pages[0]).left.length + i + 1}.{" "}
//                   {q.questionType === "text" ? (
//                     q.question.text
//                   ) : (
//                     <img src={q.question.imgUrl} alt="Question" className="max-w-full" />
//                   )}
//                 </p>
//                 <ul className="pl-4">
//                   {q.options.map((opt, idx) => (
//                     <li key={idx}>
//                       {q.optionType === "text" ? (
//                         opt.text
//                       ) : (
//                         <img src={opt.imgUrl} alt={`Option ${idx + 1}`} className="max-w-full" />
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ✅ Remaining Pages */}
//       {pages.slice(1).map((pageQuestions, pageIndex) => {
//         const { left, right } = splitColumns(pageQuestions);
//         return (
//           <div key={pageIndex + 1} className="border border-black mb-8" style={{ minHeight: "297mm", pageBreakAfter: "always" }}>
       
//             <div className="w-full border-b border-black flex justify-between items-center mb-2">
//               <div className="w-[85%]">
//                 <h1 className="text-xl font-semibold px-5 py-4 uppercase">D. M. Academy</h1>
//               </div>
//               <div className="w-[15%] bg-black text-white text-center p-4 font-bold text-xl">
//                 {test.course.toUpperCase()}
//               </div>
//             </div>

//             <div className="flex gap-2 px-5">
//               <div className="w-1/2 border-r">
//                 {left.map((q, i) => (
//                   <div key={q._id} className="p-2 text-xs mb-2 break-inside-avoid">
//                     <p className="mb-1 font-semibold">
//                       Q{(pageIndex + 1) * QUESTIONS_PER_PAGE + i + 1}.{" "}
//                       {q.questionType === "text" ? (
//                         q.question.text
//                       ) : (
//                         <img src={q.question.imgUrl} alt="Question" className="max-w-full" />
//                       )}
//                     </p>
//                     <ul className="pl-4">
//                       {q.options.map((opt, idx) => (
//                         <li key={idx}>
//                           {q.optionType === "text" ? (
//                             opt.text
//                           ) : (
//                             <img src={opt.imgUrl} alt={`Option ${idx + 1}`} className="max-w-full" />
//                           )}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>
//               <div className="w-1/2 border-l">
//                 {right.map((q, i) => (
//                   <div key={q._id} className="p-2 text-xs mb-2 break-inside-avoid">
//                     <p className="mb-1 font-semibold">
//                       Q{(pageIndex + 1) * QUESTIONS_PER_PAGE + left.length + i + 1}.{" "}
//                       {q.questionType === "text" ? (
//                         q.question.text
//                       ) : (
//                         <img src={q.question.imgUrl} alt="Question" className="max-w-full" />
//                       )}
//                     </p>
//                     <ul className="pl-4">
//                       {q.options.map((opt, idx) => (
//                         <li key={idx}>
//                           {q.optionType === "text" ? (
//                             opt.text
//                           ) : (
//                             <img src={opt.imgUrl} alt={`Option ${idx + 1}`} className="max-w-full" />
//                           )}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }


// design
// "use client";

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { useParams, useRouter } from "next/navigation";
// import html2pdf from "html2pdf.js";
// import { Question } from "@/types/questionType";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

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

// const QUESTIONS_PER_PAGE = 14;

// function TopBar({ course }: { course: string }) {
//   return (
//     <div className="w-full border-b border-black flex justify-between items-center mb-2">
//       <div className="w-[85%]">
//         <h1 className="text-xl font-semibold px-5 py-4 uppercase">
//           D. M. Academy
//         </h1>
//       </div>
//       <div className="w-[15%] bg-black font-semibold text-white text-center p-4">
//         <p className="font-semibold text-xl h-full">{course.toUpperCase()}</p>
//       </div>
//     </div>
//   );
// }

// function QuestionItem({ question, index }: { question: Question; index: number }) {
//   return (
//     <div className="p-2 text-xs mb-2 break-inside-avoid">
//       <p className="mb-1 font-semibold">
//         Q{index + 1}.{" "}
//         {question.questionType === "text" ? (
//           question.question.text
//         ) : (
//           <img src={question.question.imgUrl} alt="Question" className="max-w-full" />
//         )}
//       </p>
//       <ul className="pl-4">
//         {question.options.map((opt, idx) => (
//           <li key={idx}>
//             {question.optionType === "text" ? (
//               opt.text
//             ) : (
//               <img src={opt.imgUrl} alt={`Option ${idx + 1}`} className="max-w-full" />
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default function QuestionPaperPDF({ id }: { id: string }) {
//   const router = useRouter();
//   const pdfRef = useRef<HTMLDivElement>(null);
//   const [test, setTest] = useState<QuestionPaper | null>(null);
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [autoDownloadTriggered, setAutoDownloadTriggered] = useState(false);
//   const [showModal, setShowModal] = useState(true);

//   // Fetch data
//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await axios.post("/api/Get_Question-Paper", { id });
//       setTest(res.data.test);
//       setQuestions(res.data.questions);
//     };
//     fetchData();
//   }, [id]);
  
//    // Auto download PDF after render
//   useEffect(() => {
//     if (!test || questions.length === 0) return;

//     const timer = setTimeout(async () => {
//       if (pdfRef.current) {
//         const canvas = await html2canvas(pdfRef.current, { scale: 2 });
//         const imgData = canvas.toDataURL("image/png");

//         const pdf = new jsPDF("p", "mm", "a4");
//         const imgProps = pdf.getImageProperties(imgData);
//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//         pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//         pdf.save(`${test.title || "QuestionPaper"}.pdf`);
//         router.push("/dashboard/admin/manage-question-paper");
//       }
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [test, questions]);

// //   if (!test) return null;


//   // Manual download
//   const handleDownload = () => {
//     if (!pdfRef.current) return;
//     console.log(pdfRef)
//     html2pdf()
//       .set({
//         margin: 10,
//         filename: `QuestionPaper-${id}.pdf`,
//         image: { type: "jpeg", quality: 0.98 },
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//       })
//       .from(pdfRef.current)
//       .save()
//       .then(() => {
//         router.push("/dashboard/admin/manage-question-paper");
//       });
//   };

//   if (!test) return null;

//   // Pagination logic
//   const pages: Question[][] = [];
//   for (let i = 0; i < questions.length; i += QUESTIONS_PER_PAGE) {
//     pages.push(questions.slice(i, i + QUESTIONS_PER_PAGE));
//   }

//   const splitColumns = (pageQuestions: Question[]) => {
//     const half = Math.ceil(pageQuestions.length / 2);
//     return { left: pageQuestions.slice(0, half), right: pageQuestions.slice(half) };
//   };

//   return (
//     <>
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
//             <h2 className="text-xl font-bold mb-4">Download Not Started</h2>
//             <p className="mb-4">Click below to download the PDF manually.</p>
//             <button
//               onClick={handleDownload}
//               className="bg-blue-600 cursor-crosshair text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Download PDF
//             </button>
//           </div>
//         </div>
//       )}

//       <div ref={pdfRef} id="pdf" className="bg-white mx-auto my-4" style={{ width: "210mm" }}>
//         {/* First Page */}
//         <div
//           className="bg-white mx-auto my-4 text-sm border border-black mb-8"
//           style={{ minHeight: "297mm", boxSizing: "border-box", pageBreakAfter: "always" }}
//         >
//           <TopBar course={test.course} />

//           {/* Instructions */}
//           <div className="border-b border-black mb-2 py-2 px-5 flex">
//             <div className="w-[50%]">
//               <h2 className="text-lg font-semibold mb-1">Instructions:</h2>
//               <ul className="list-disc ml-5 text-md space-y-1">
//                 <li>All questions are compulsory unless stated otherwise.</li>
//                 <li>Read each question carefully before answering.</li>
//                 <li>No calculators or mobile phones allowed.</li>
//               </ul>
//             </div>
//             <div className="border border-dashed rounded-md p-2 mt-2 text-center bg-gray-100 text-md italic font-medium w-[50%]">
//               🌟 Best of Luck! Do Your Best. 🌟
//             </div>
//           </div>

//           {/* Metadata */}
//           <div className="w-full py-2 px-5 flex justify-between text-md mb-1">
//             <div className="flex flex-col">
//               <span><strong>Date:</strong> {new Date(test.date).toLocaleDateString()}</span>
//               <span><strong>Duration:</strong> {test.duration / 60} hr</span>
//             </div>
//             <div className="flex flex-col text-right">
//               <span><strong>Marks:</strong> {test.totalMarks}</span>
//               <span><strong>Total Questions:</strong> {test.questionIds.length}</span>
//             </div>
//           </div>

//           {/* Course/Subject/Chapter */}
//           <div className="w-full px-5 py-2 border-y-2 font-bold border-black text-xl text-center mb-1">
//             {test.course}{test.subject ? ` (${test.subject})` : ""}
//           </div>
//           {test.chapter && (
//             <div className="w-full border-b px-5 py-2 font-bold border-black text-md text-center italic mb-1">
//               Chapter: {test.chapter}
//             </div>
//           )}

//           {/* Questions */}
//           <div className="flex gap-2 px-5">
//             <div className="w-1/2 border-r">
//               {splitColumns(pages[0]).left.map((q, i) => (
//                 <QuestionItem key={q._id} question={q} index={i} />
//               ))}
//             </div>
//             <div className="w-1/2 border-l">
//               {splitColumns(pages[0]).right.map((q, i) => (
//                 <QuestionItem key={q._id} question={q} index={splitColumns(pages[0]).left.length + i} />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Remaining Pages */}
//         {pages.slice(1).map((pageQuestions, pageIndex) => {
//           const { left, right } = splitColumns(pageQuestions);
//           return (
//             <div
//               key={pageIndex + 1}
//               className="bg-white mx-auto my-4 text-sm border border-black mb-8"
//               style={{ minHeight: "297mm", padding: "10mm", boxSizing: "border-box", pageBreakAfter: "always" }}
//             >
//               <TopBar course={test.course} />
//               <div className="flex gap-2 px-5">
//                 <div className="w-1/2 border-r">
//                   {left.map((q, i) => (
//                     <QuestionItem key={q._id} question={q} index={(pageIndex + 1) * QUESTIONS_PER_PAGE + i} />
//                   ))}
//                 </div>
//                 <div className="w-1/2 border-l">
//                   {right.map((q, i) => (
//                     <QuestionItem key={q._id} question={q} index={(pageIndex + 1) * QUESTIONS_PER_PAGE + left.length + i} />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// }


// download

// "use client";

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
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

// const QUESTIONS_PER_PAGE = 14;

// function TopBar({ course }: { course: string }) {
//   return (
//     <div className="w-full border-b border-black flex justify-between items-center mb-2">
//       <div className="w-[85%]">
//         <h1 className="text-xl font-semibold px-5 py-4 uppercase">
//           D. M. Academy
//         </h1>
//       </div>
//       <div className="w-[15%] bg-black font-semibold text-white text-center p-4">
//         <p className="font-semibold text-xl h-full">{course.toUpperCase()}</p>
//       </div>
//     </div>
//   );
// }

// export default function QuestionPaperPDF({ id }: { id: string }) {
//   const router = useRouter();
//   const pdfRef = useRef<HTMLDivElement>(null);
//   const [test, setTest] = useState<QuestionPaper | null>(null);
//   const [questions, setQuestions] = useState<Question[]>([]);

//   // Fetch data
//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await axios.post("/api/Get_Question-Paper", { id });
//       setTest(res.data.test);
//       setQuestions(res.data.questions);
//     };
//     fetchData();
//   }, [id]);

//   // Auto download with jsPDF + html2canvas
//   useEffect(() => {
//     if (!test || questions.length === 0) return;

//     const timer = setTimeout(async () => {
//       if (pdfRef.current) {
//         const canvas = await html2canvas(pdfRef.current, {
//           scale: 2,
//           useCORS: true,
//         });
//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");

//         const imgProps = pdf.getImageProperties(imgData);
//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//         pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//         pdf.save(`${test.title || "QuestionPaper"}.pdf`);

//         router.push("/dashboard/admin/manage-question-paper");
//       }
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [test, questions]);

//   if (!test) return null;

//   return (
//     <div ref={pdfRef} style={{ width: "210mm", padding: "10mm", background: "white" }}>
//       <TopBar course={test.course} />
//       <h2>{test.title}</h2>
//       <p>Date: {new Date(test.date).toLocaleDateString()}</p>
//       <p>Total Marks: {test.totalMarks}</p>
//       <p>Total Questions: {test.questionIds.length}</p>
//       {/* You can put your questions layout here exactly like before */}
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useRef, JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal } from "react";
import axios from "axios";

export default function QuestionPaperPDF({ id }: { id: string }) {
  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Ref for header container
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Ref for first question as example
  const questionRef = useRef<HTMLDivElement>(null);
  const [questionHeight, setQuestionHeight] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post("/api/Get_Question-Paper", { id });
        setTest(res.data.test);
        setQuestions(res.data.questions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.clientHeight);
    }
    if (questionRef.current) {
      setQuestionHeight(questionRef.current.clientHeight);
    }
  }, [loading, test, questions]);

  if (loading) return <div>Loading...</div>;
  if (!test) return <div>Test not found</div>;

  return (
    <div style={{ padding: "10mm", boxSizing: "border-box" }}>
      {/* Header section with ref */}
      <div
        ref={headerRef}
        style={{
          borderBottom: "1px solid black",
          marginBottom: "12px",
          paddingBottom: "6px",
        }}
      >
        <h1>D. M. Academy</h1>
        <div>Course: {test.course}</div>
        <div>Date: {new Date(test.date).toLocaleDateString()}</div>
      </div>

      {/* Show header height */}
      <div style={{ marginBottom: "20px", color: "blue" }}>
        Header height: {headerHeight}px
      </div>

      {/* First question with ref */}
      {questions.length > 0 && (
        <div
          ref={questionRef}
          style={{
            border: "1px solid #ddd",
            padding: "8px",
            marginBottom: "12px",
          }}
        >
          <div style={{ fontWeight: "bold" }}>
             1.{" "}
          <p>
            {console.log(questions[22])}
            {questions[22].questionType === "text" ? (
          questions[22].question.text
        ) : (
          <img src={questions[22].question.imgUrl} alt="Question" className="max-w-full" />
        )}
      </p>
      <ul className="pl-4 ">
        {questions[22].options.map((opt: { text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; imgUrl: string | undefined; }, i: number) => (
          <li key={i}>
            {questions[22].optionType === "text" ? (
              opt.text
            ) : (
              <img
                src={opt.imgUrl}
                alt={`Option ${i + 1}`}
                className="max-w-full"
              />
            )}
          </li>
        ))}
      </ul>
        </div>
        </div>
      )}

      {/* Show first question height */}
      <div style={{ color: "green" }}>
        First question height: {questionHeight}px
      </div>
    </div>
  );
}
