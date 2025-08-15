import QuestionPaperPDF from "./pdf";


export default function Page({ params }: { params: { id: string } }) {
  return <QuestionPaperPDF id={params.id} />;
}


// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import html2pdf from "html2pdf.js";

// export default function QuestionPaperPDF({ id }: { id: string }) {
//   const [test, setTest] = useState<any>(null);
//   const [questions, setQuestions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const printRef = useRef<HTMLDivElement>(null);

//   // A4 page height in px approx at 96dpi, adjust if needed
//   const pageHeightPx = 1122;

//   // Assume estimated question height in px (can improve measuring dynamically)
//   const estimatedQuestionHeight = 100;

//   // Split questions into pages dynamically after header height is known
//   const [headerHeight, setHeaderHeight] = useState(0);
//   const headerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.post("/api/Get_Question-Paper", { id });
//         setTest(res.data.test);
//         setQuestions(res.data.questions);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   useEffect(() => {
//     if (headerRef.current) {
//       setHeaderHeight(headerRef.current.clientHeight);
//     }
//   }, [loading, test]);

//   if (loading) return <div>Loading...</div>;
//   if (!test) return <div>Test not found</div>;

//   // Calculate how many questions fit per page
//   const questionsPerPageFirst = Math.floor(
//     (pageHeightPx - headerHeight) / estimatedQuestionHeight
//   );
//   const questionsPerPageOther = Math.floor(pageHeightPx / estimatedQuestionHeight);

//   // Split questions into pages
//   let pages: any[][] = [];
//   if (questions.length > 0) {
//     pages.push(questions.slice(0, questionsPerPageFirst));
//     let start = questionsPerPageFirst;
//     while (start < questions.length) {
//       pages.push(questions.slice(start, start + questionsPerPageOther));
//       start += questionsPerPageOther;
//     }
//   }

//     const handleDownloadPDF = () => {
//     if (!printRef.current) {
//       console.error("No element to print");
//       return;
//     }
//     html2pdf()
//       .set({
//         margin: 10,
//         filename: "test.pdf",
//         image: { type: "jpeg", quality: 0.98 },
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//       })
//       .from(printRef.current)
//       .save();
//   };

//   return (
//     <>
//       <button
//         onClick={handleDownloadPDF}
//         className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
//       >
//         Download PDF
//       </button>

//       {/* Visible container styled like A4 page */}
//       <div
//         ref={printRef}
//         style={{
//           width: "210mm",
//           minHeight: "297mm",
//           margin: "auto",
//           backgroundColor: "white",
//           padding: "10mm",
//           boxSizing: "border-box",
//           color: "black",
//           fontSize: "14px",
//           userSelect: "none",
//         }}
//       >
//         {pages.map((pageQuestions, pageIndex) => (
//           <div
//             key={pageIndex}
//             style={{
//               minHeight: "297mm",
//               boxSizing: "border-box",
//               pageBreakAfter: "always",
//             }}
//           >
//             {/* Header */}
//             {pageIndex === 0 ? (
//               <div ref={headerRef}>
//                 <div className="w-full border-b border-black flex justify-between items-center mb-2">
//                   <div className="w-[85%]">
//                     <h1 className="text-xl font-semibold px-5 py-4 uppercase">
//                       D. M. Academy
//                     </h1>
//                   </div>
//                   <div className="w-[15%] bg-black font-semibold text-white text-center p-4">
//                     <p className="text-xl h-full">{test.course.toUpperCase()}</p>
//                   </div>
//                 </div>

//                 {/* Instructions */}
//                 <div className="border-b border-black mb-2 py-2 px-5 flex">
//                   <div className="w-[50%]">
//                     <h2 className="text-lg font-semibold mb-1">Instructions:</h2>
//                     <ul className="list-disc ml-5 text-md space-y-1">
//                       <li>All questions are compulsory unless stated otherwise.</li>
//                       <li>Read each question carefully before answering.</li>
//                       <li>No use of calculators or mobile phones allowed.</li>
//                     </ul>
//                   </div>
//                   <div className="border border-dashed rounded-md p-2 mt-2 text-center bg-gray-100 text-md italic font-medium w-[50%]">
//                     🌟 Best of Luck! Do Your Best. 🌟
//                   </div>
//                 </div>

//                 {/* Metadata */}
//                 <div className="w-full py-2 px-5 flex justify-between text-md mb-1">
//                   <div className="flex flex-col">
//                     <span>
//                       <strong>Date:</strong>{" "}
//                       {new Date(test.date).toLocaleDateString()}
//                     </span>
//                     <span>
//                       <strong>Duration:</strong> {test.duration / 60} hr
//                     </span>
//                   </div>
//                   <div className="flex flex-col text-right">
//                     <span>
//                       <strong>Marks:</strong> {test.totalMarks}
//                     </span>
//                     <span>
//                       <strong>Total Questions:</strong> {test.questionIds.length}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Course/Subject */}
//                 <div className="w-full px-5 py-2 border-y-2 font-bold border-black text-xl text-center mb-1">
//                   {test.course}
//                   {test.subject ? ` (${test.subject})` : ""}
//                 </div>

//                 {/* Chapter */}
//                 {test.chapter && (
//                   <div className="w-full border-b px-5 py-2 font-bold border-black text-md text-center italic mb-1">
//                     Chapter: {test.chapter}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               // Minimal header for other pages
//               <div className="w-full border-b border-black flex justify-between items-center mb-4">
//                 <div className="w-[85%]">
//                   <h1 className="text-xl font-semibold px-5 py-4 uppercase">
//                     D. M. Academy
//                   </h1>
//                 </div>
//                 <div className="w-[15%] bg-black font-semibold text-white text-center p-4">
//                   <p className="text-xl h-full">{test.course.toUpperCase()}</p>
//                 </div>
//               </div>
//             )}

//             {/* Questions in two columns */}
//             <div
//               style={{
//                 columnCount: 2,
//                 columnGap: "30px",
//                 padding: "8mm",
//               }}
//             >
//               {pageQuestions.map((q: any, idx: number) => {
//                 // Calculate actual question number across pages:
//                 const questionNumber =
//                   idx + 1 + pages.slice(0, pageIndex).reduce((a, p) => a + p.length, 0);
//                 return (
//                   <div
//                     key={idx}
//                     style={{
//                       marginBottom: "12px",
//                       breakInside: "avoid",
//                       pageBreakInside: "avoid",
//                     }}
//                   >
//                     <div className="font-bold text-lg mb-1">
//                       {questionNumber}.{" "}
//                       {q.questionType === "text" ? (
//                         <span className="text-lg">{q.question.text}</span>
//                       ) : (
//                         <img
//                           src={q.question.imgUrl}
//                           alt="question"
//                           className="max-w-full h-auto max-h-60"
//                         />
//                       )}
//                     </div>
//                     <div className="pl-6 text-lg mb-1">
//                       {q.options.map((opt: any, i: number) =>
//                         q.optionType === "text" ? (
//                           <div key={i}>
//                             {String.fromCharCode(65 + i)}) {opt.text}
//                           </div>
//                         ) : (
//                           <img
//                             key={i}
//                             src={opt.imgUrl}
//                             alt={`Option ${i + 1}`}
//                            className="max-w-full h-auto"
//                           />
//                         )
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }