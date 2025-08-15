
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF, { RGBAData } from "jspdf";
import html2canvas from "html2canvas";


type OptionType = {
  text?: string;
  imgUrl?: string;
};

type QuestionType = {
  questionType: "text" | "img";
  question: {
    text?: string;
    imgUrl?: string;
  };
  optionType: "text" | "img";
  options: OptionType[];
};

type TestType = {
  course: string;
  subject?: string;
  chapter?: string;
  date: string;
  duration: number;
  totalMarks: number;
  questionIds: string[];
};



export default function QuestionPaperPDF({ id }: { id: string }) {
  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post("/api/Get_Question-Paper", { id });
        setTest(res.data.test);
        setQuestions(res.data.questions);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);



/**
 * generatePDF_viaDOM - renders each question as HTML then uses html2canvas -> jsPDF
 * - Uses DOM snapshotting (html2canvas). If html2canvas fails due to CORS, it will
 *   try to fetch images and inline them as base64 data URLs, then re-capture.
 *
 * Call generatePDF_viaDOM() from your button click handler.
 */

async function generatePDFWithProgress(test: TestType, questions: QuestionType[]) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 8;
  const marginY = 8;
  const innerWidth = pageWidth - 2 * marginX;
  const midLineWidth = 0.4;
  const colPadding = 4;
  const colWidth = (innerWidth - midLineWidth) / 2;
  const questionImgMaxH = 50;
  const optionImgMaxH = 12;
  const bottomLimit = pageHeight - marginY;

  let yPos = marginY;
  let col = 0;
  let qNumber = 1;
  let currentPageTopY = 0;

  // preload image as base64
  const preloadImageBase64 = (url?: string) =>
    new Promise<string | null>((resolve) => {
      if (!url) return resolve(null);
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });

  const imgCache = new Map<string, string | null>();

  const getImgBase64 = async (url?: string) => {
    if (!url) return null;
    if (imgCache.has(url)) return imgCache.get(url) ?? null;
    const data = await preloadImageBase64(url);
    imgCache.set(url, data);
    return data;
  };

  const drawPageBorder = (fromY: number) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.45);
    doc.rect(marginX, marginY, innerWidth, pageHeight - 2 * marginY);
    const midX = marginX + innerWidth / 2;
    doc.setLineWidth(midLineWidth);
    doc.line(midX, fromY, midX, pageHeight - marginY);
  };

  const drawFullHeader = () => {
    yPos = marginY;
    const leftW = innerWidth * 0.85;
    const rightW = innerWidth * 0.15;

    // top bar
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.rect(marginX, yPos, leftW, 15, "S");
    doc.text("D. M. Academy", marginX + 6, yPos + 10);

    doc.setFillColor(0, 0, 0);
    doc.rect(marginX + leftW, yPos, rightW, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(test.course.toUpperCase(), marginX + leftW + rightW / 2, yPos + 10, { align: "center" });
    doc.setTextColor(0, 0, 0);

    yPos += 21;

    // instructions
    doc.setFontSize(11);
    doc.text("Instructions:", marginX + 4, yPos + 4);
    const instructions = [
      "All questions are compulsory unless stated otherwise.",
      "Read each question carefully before answering.",
      "No calculators or mobile phones allowed.",
    ];
    let instrY = yPos + 9;
    for (const line of instructions) {
      doc.text(line, marginX + 4, instrY);
      instrY += 5;
    }
    yPos = instrY + 2;

    // metadata
    doc.line(marginX, yPos, marginX + innerWidth, yPos);
    yPos += 5;
    doc.text(`Date: ${new Date(test.date).toLocaleDateString()}`, marginX + 4, yPos);
    doc.text(`Duration: ${test.duration / 60} hr`, marginX + 4, yPos + 5);
    doc.text(`Marks: ${test.totalMarks}`, marginX + innerWidth - 50, yPos);
    doc.text(`Questions: ${test.questionIds.length}`, marginX + innerWidth - 50, yPos + 5);

    yPos += 12;
    doc.line(marginX, yPos, marginX + innerWidth, yPos);

    yPos += 6;
    if (test.chapter) {
      doc.setFont("helvetica", "italic");
      doc.text(`Chapter: ${test.chapter}`, marginX + innerWidth / 2, yPos, { align: "center" });
      yPos += 6;
      doc.line(marginX, yPos, marginX + innerWidth, yPos);
    }

    yPos += 4;
    currentPageTopY = yPos;
    drawPageBorder(currentPageTopY);
  };

  const drawTopBar = () => {
    yPos = marginY;
    const leftW = innerWidth * 0.85;
    const rightW = innerWidth * 0.15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.rect(marginX, yPos, leftW, 15, "S");
    doc.text("D. M. Academy", marginX + 6, yPos + 10);

    doc.setFillColor(0, 0, 0);
    doc.rect(marginX + leftW, yPos, rightW, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(test.course.toUpperCase(), marginX + leftW + rightW / 2, yPos + 10, { align: "center" });
    doc.setTextColor(0, 0, 0);

    yPos += 21;
    currentPageTopY = yPos;
    drawPageBorder(currentPageTopY);
  };

  const addQuestion = async (q: QuestionType) => {
    const qImgBase64 = q.questionType === "img" ? await getImgBase64(q.question?.imgUrl) : null;
    const optImgBase64s = await Promise.all(
      q.options.map((opt) => (q.optionType === "img" ? getImgBase64(opt.imgUrl) : Promise.resolve(null)))
    );

    const columnBottom = bottomLimit;
    const colX = col === 0 ? marginX : marginX + colWidth + midLineWidth / 2;

    // question text
    const qText = q.questionType === "text" ? `${qNumber}. ${q.question.text}` : `${qNumber}.`;
    const splitText = doc.splitTextToSize(qText, colWidth - 2 * colPadding);
    doc.text(splitText, colX + colPadding, yPos);
    yPos += splitText.length * 5;

    // question image
    if (qImgBase64) {
      doc.addImage(qImgBase64, "JPEG", colX + colPadding, yPos, colWidth - 2 * colPadding, questionImgMaxH);
      yPos += questionImgMaxH + 2;
    }

    // options
    for (let i = 0; i < q.options.length; i++) {
      if (q.optionType === "text") {
        const optText = `${String.fromCharCode(65 + i)}) ${q.options[i].text}`;
        const splitOpt = doc.splitTextToSize(optText, colWidth - 2 * colPadding - 4);
        doc.text(splitOpt, colX + colPadding + 4, yPos);
        yPos += splitOpt.length * 5;
      } else if (optImgBase64s[i]) {
        doc.addImage(optImgBase64s[i]!, "JPEG", colX + colPadding + 4, yPos, colWidth - 2 * colPadding - 8, optionImgMaxH);
        yPos += optionImgMaxH + 2;
      }
    }

    yPos += 4;
    if (yPos > columnBottom) {
      if (col === 0) {
        col = 1;
        yPos = currentPageTopY;
      } else {
        doc.addPage();
        drawTopBar();
        col = 0;
        yPos = currentPageTopY;
      }
    }

    qNumber++;
  };

  drawFullHeader();
  for (const q of questions) {
    await addQuestion(q);
  }

  doc.save("QuestionPaper.pdf");
}


async function generatePDF_viaDOM(test: any, questions: any[]) {
  if (!test || !questions || questions.length === 0) {
    alert("No test/questions");
    return;
  }

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Layout config (reduced vertical paddings)
  const marginX = 8;
  const marginY = 8;
  const innerW = pageW - marginX * 2;
  const midLineWidth = 0.35;
  const colPaddingMm = 3.5;
  const colWidth = (innerW - midLineWidth) / 2;
  const topbarH = 12;
  const smallTopPad = 3;
  const bottomLimit = pageH - marginY;

  // px<->mm helpers assuming 96dpi (browser)
  const DPI = (window.devicePixelRatio || 1) * 96;
  const pxToMm = (px: number) => (px * 25.4) / DPI;
  const mmToPx = (mm: number) => (mm * DPI) / 25.4;

  // create a small overlay so the user knows generation is running
  const overlayId = "__pdf_dom_overlay__";
  let overlay = document.getElementById(overlayId) as HTMLDivElement | null;
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = overlayId;
    overlay.style.position = "fixed";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.45)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "999999";
    overlay.style.color = "#fff";
    overlay.innerHTML = `<div style="padding:14px 18px;background:#111;border-radius:8px;min-width:220px;text-align:center">
      <div id="${overlayId}_text">Generating PDF...</div>
      <div style="height:8px"></div>
      <div style="width:200px;background:#333;height:8px;border-radius:4px;overflow:hidden"><div id="${overlayId}_bar" style="height:100%;width:0%;background:#0bcd8b"></div></div>
    </div>`;
    document.body.appendChild(overlay);
  }
  const setProgress = (pct: number, text?: string) => {
    const bar = document.getElementById(`${overlayId}_bar`) as HTMLElement | null;
    const txt = document.getElementById(`${overlayId}_text`) as HTMLElement | null;
    if (bar) bar.style.width = `${pct}%`;
    if (txt && text) txt.innerText = text;
    overlay!.style.display = "flex";
  };

  const hideOverlay = () => { if (overlay) overlay.style.display = "none"; };

  // helper: fetch image as dataURL (returns null if fetch fails)
  const fetchImageAsDataURL = async (url: string): Promise<string | null> => {
    try {
      const r = await fetch(url, { mode: "cors" });
      if (!r.ok) return null;
      const blob = await r.blob();
      return await new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result));
        fr.onerror = () => reject(null);
        fr.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  // Make a temporary element for each question matching your JSX style.
  // We inline minimal CSS that matches your UI so html2canvas produces the same look.
  function buildQuestionElementHTML(q: any, qIndex: number) {
    const questionPart = q.questionType === "text"
      ? `<div style="font-size:12pt;line-height:1.2">${escapeHtml(q.question.text)}</div>`
      : `<img src="${escapeHtmlAttr(q.question.imgUrl)}" style="max-height:450px;display:block;margin-top:6px;">`;

    // build options
    let optsHtml = "<ul style='padding-left:18px;margin-top:6px;'>";
    for (let i = 0; i < (q.options || []).length; i++) {
      const opt = q.options[i];
      if (q.optionType === "text") {
        optsHtml += `<li style="margin-bottom:4px;font-size:11pt;line-height:1.2">${escapeHtml(opt.text)}</li>`;
      } else {
        optsHtml += `<li style="margin-bottom:6px"><img src="${escapeHtmlAttr(opt.imgUrl)}" style="max-width:500px;display:block" /></li>`;
      }
    }
    optsHtml += "</ul>";

    // outer container with small left/right padding
    return `
      <div style="box-sizing:border-box;width:${mmToPx(colWidth - 2*colPaddingMm)}px;padding:${mmToPx(2)}px ${mmToPx(colPaddingMm)}px;background:white;color:black;">
        <div style="font-weight:600;margin-bottom:4px;font-size:11.5pt;">${qIndex + 1}.</div>
        ${questionPart}
        ${optsHtml}
      </div>
    `;
  }

  // small HTML escape helpers
  function escapeHtml(s: any) {
    if (s === null || s === undefined) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function escapeHtmlAttr(s: any) {
    if (s === null || s === undefined) return "";
    return String(s).replace(/"/g, "&quot;");
  }

  // html2canvas capture with optional inlining fallback
  async function captureElementToCanvas(el: HTMLElement, tryInlineImagesIfNeeded = true) {
    try {
      // prefer using useCORS so images with proper CORS will be captured
      const canvas = await html2canvas(el, {
        useCORS: true,
        allowTaint: false,
        scale: Math.max(1, window.devicePixelRatio || 1),
        backgroundColor: "#ffffff"
      });
      return canvas;
    } catch (err) {
      // if html2canvas failed (often due to cross-origin images), attempt to inline images via fetch -> data URLs and retry once
      if (!tryInlineImagesIfNeeded) throw err;
      const imgs = Array.from(el.querySelectorAll("img")) as HTMLImageElement[];
      if (imgs.length === 0) throw err;

      // attempt to replace src with dataURL where possible
      await Promise.all(imgs.map(async (img) => {
        try {
          const url = img.src;
          const dataUrl = await fetchImageAsDataURL(url);
          if (dataUrl) img.src = dataUrl;
        } catch {
          // ignore per-image failures
        }
      }));

      // retry
      const canvas2 = await html2canvas(el, {
        useCORS: false,  // now images are inlined data URLs (if fetch succeeded), so useCORS not required
        allowTaint: false,
        scale: Math.max(1, window.devicePixelRatio || 1),
        backgroundColor: "#ffffff"
      });
      return canvas2;
    }
  }

  // draw header (page 1 full header), and a small topbar for subsequent pages
  const drawFullHeader = () => {
    // small tight header like your JSX (reduced paddings)
    const leftW = innerW * 0.85;
    const rightW = innerW * 0.15;
    const y0 = marginY;

    // left text
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0,0,0);
    doc.text("D. M. Academy", marginX + 4, y0 + topbarH/2 + 1);

    // right black box
    doc.setFillColor(0,0,0);
    doc.rect(pageW - marginX - (rightW - 2), y0, rightW - 2, topbarH, "F");
    doc.setTextColor(255,255,255);
    doc.setFontSize(10);
    doc.text((test.course || "").toUpperCase(), pageW - marginX - (rightW-2)/2 - 2, y0 + topbarH/2 + 1, { align: "center" });
    doc.setTextColor(0,0,0);

    // small extra lines (metadata) — keep minimal vertical spacing
    let y = y0 + topbarH + 4;
    doc.setFontSize(9.5);
    doc.text(`Date: ${new Date(test.date).toLocaleDateString()}`, marginX + 4, y);
    doc.text(`Duration: ${test.duration / 60} hr`, marginX + 4, y + 4.5);
    doc.text(`Marks: ${test.totalMarks}`, pageW - marginX - 60, y);
    doc.text(`Total Qs: ${test.questionIds?.length ?? questions.length}`, pageW - marginX - 60, y + 4.5);

    // course line
    y += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`${test.course}${test.subject ? ` (${test.subject})` : ""}`, marginX + innerW/2, y, { align: "center" });

    // final top of question area:
    return y + 8; // topY of question area in mm
  };

  const drawTopBar = () => {
    // compact topbar for following pages
    const y0 = marginY;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("D. M. Academy", marginX + 4, y0 + topbarH/2 + 1);
    doc.setFillColor(0,0,0);
    const rightW = innerW * 0.15;
    doc.rect(pageW - marginX - (rightW - 2), y0, rightW - 2, topbarH, "F");
    doc.setTextColor(255,255,255);
    doc.setFontSize(10);
    doc.text((test.course || "").toUpperCase(), pageW - marginX - (rightW-2)/2 - 2, y0 + topbarH/2 + 1, { align: "center" });
    doc.setTextColor(0,0,0);
    return y0 + topbarH + 6;
  };

  try {
    setProgress(0, "Preparing pages...");

    // We'll process questions sequentially to avoid memory spikes.
    // Create temporary container for single-question DOM rendering
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-99999px";
    tempContainer.style.top = "0";
    // tempContainer.style.border="1px solid #000"
    tempContainer.style.background = "white";
    document.body.appendChild(tempContainer);

    // draw first page header
    let currentPageTopY = drawFullHeader();

    // left / right cursors (in mm)
    let leftY = currentPageTopY;
    let rightY = currentPageTopY;

    // for each question: create HTML, render to canvas, place into PDF in whichever column has smaller Y
    for (let i = 0; i < questions.length; ++i) {
      setProgress(Math.round((i / questions.length) * 100), `Rendering ${i+1}/${questions.length}`);

      // build HTML content for the question
      tempContainer.innerHTML = buildQuestionElementHTML(questions[i], i);

      // wait for images inside tempContainer to finish loading before capture
      const imgs = Array.from(tempContainer.querySelectorAll("img")) as HTMLImageElement[];
      await Promise.all(imgs.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((res) => {
          img.onload = () => res();
          img.onerror = () => res();
        });
      }));

      // capture via html2canvas; if it fails due to CORS, we try to inline images via fetch in captureElementToCanvas
      const canvas = await captureElementToCanvas(tempContainer, true);

      // compute mm dimensions for image placement
      const drawWidthMm = colWidth - 2 * colPaddingMm;
      // canvas.width/height are px; convert aspect ratio
      const aspect = canvas.height / canvas.width;
      const drawHeightMm = drawWidthMm * aspect;

      // pick which column to place (choose the smaller current cursor)
      const placeLeft = leftY <= rightY;
      // if it doesn't fit in chosen column try the other; if neither, add new page and reset cursors
      const chosenY = placeLeft ? leftY : rightY;
      const remaining = bottomLimit - chosenY;
      if (drawHeightMm > remaining) {
        // try other column
        const otherRemaining = bottomLimit - (placeLeft ? rightY : leftY);
        if (drawHeightMm > otherRemaining) {
          // add page
          doc.addPage();
          currentPageTopY = drawTopBar();
          leftY = rightY = currentPageTopY;
        }
      }

      // recompute place after potential page break: prefer column with smaller cursor
      const finalPlaceLeft = leftY <= rightY;
      const x = finalPlaceLeft ? marginX + colPaddingMm : marginX + innerW / 2 + (midLineWidth / 2) + colPaddingMm;
      const y = finalPlaceLeft ? leftY : rightY;

      // add canvas image to jsPDF
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      console.log("asasbajd",dataUrl)
      try {
        doc.addImage(dataUrl, "JPEG", x, y, drawWidthMm, drawHeightMm);
      } catch (err) {
        // as a last attempt, convert canvas to blob->dataURL and re-add
        const blobDataUrl = await new Promise<string | null>((res) => {
          canvas.toBlob((b: any) => {
            if (!b) return res(null);
            const fr = new FileReader();
            fr.onload = () => res(String(fr.result));
            fr.onerror = () => res(null);
            fr.readAsDataURL(b);
          }, "image/jpeg", 0.9);
        });
        if (blobDataUrl) doc.addImage(blobDataUrl, "JPEG", x, y, drawWidthMm, drawHeightMm);
        else {
          // fallback placeholder text
          doc.setFontSize(10);
          doc.text("[image]", x + 2, y + 6);
        }
      }

      // advance chosen column cursor
      if (finalPlaceLeft) leftY += drawHeightMm + 4; else rightY += drawHeightMm + 4;

      // small yield so overlay updates
      await new Promise(r => setTimeout(r, 0));
    } // end questions loop

    // finished
    hideOverlay();
    document.body.removeChild(tempContainer);
    setProgress(100, "Saving PDF...");
    await new Promise(r => setTimeout(r, 80));
    doc.save("QuestionPaper.pdf");
  } catch (err) {
    console.error("PDF DOM capture failed:", err);
    hideOverlay();
    alert("Failed to generate PDF. Check console for details (CORS issues are common).");
  } finally {
    try { hideOverlay(); } catch {}
  }
}


const sanitizeOptionText = (s = "") =>
  collapseWs(s)
    .replace(/^([A-D])[\)\.\s]+\1[\)\.\s]*/i, "$1) ")
    .replace(/^([A-D])[\)\.\s]*/i, "")
    .trim();


const collapseWs = (s = "") => String(s).replace(/\s+/g, " ").trim();
// const sanitizeOptionText = (s = "") => collapseWs(s).replace(/^([A-D])[\)\.\s]+\1[\)\.\s]*/i, "$1) ").trim();
const sanitizeQuestionText = (s = "") => collapseWs(s);

async function generatePDFStandalone(test: any, questions: any[]) {
  if (!test || !questions || questions.length === 0) return;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginX = 8;
  const marginY = 8;
  const innerW = pageW - 2 * marginX;
  const midLineW = 0.4;
  const colPadding = 3.5;
  const colWidth = (innerW - midLineW) / 2;
  const questionImgMaxH = 30;
  const optionImgMaxH = 10;
  const bottomBuffer = 10;
  const safeBottom = pageH - marginY - bottomBuffer;
  const pdfBodyPt = 11;

  let leftY = marginY;
  let rightY = marginY;
  let col = 0;
  let qNumber = 1;

  const imgCache = new Map<string, HTMLImageElement>();

  async function preloadImage(url?: string) {
    if (!url) return null;
    if (imgCache.has(url)) return imgCache.get(url)!;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    await new Promise((res) => { img.onload = () => res(null); img.onerror = () => res(null); });
    imgCache.set(url, img);
    return img;
  }

  function addImage(entry: HTMLImageElement | null, x: number, y: number, w: number, h: number) {
    if (!entry) return;
    try { doc.addImage(entry, "JPEG", x, y, w, h); } catch {}
  }

  // preload all images
  for (const q of questions) {
    if (q.questionType === "image" && q.question?.imgUrl) await preloadImage(q.question.imgUrl);
    if (q.options && q.optionType === "image") {
      for (const opt of q.options) { if (opt?.imgUrl) await preloadImage(opt.imgUrl); }
    }
  }

  for (const q of questions) {
    let preferredCol = col;
    const qEntry = q.questionType === "image" && q.question?.imgUrl ? imgCache.get(q.question.imgUrl) : null;
    const optsEntries = (q.options || []).map((opt: any) =>
      q.optionType === "image" && opt?.imgUrl ? imgCache.get(opt.imgUrl) : null
    );

    // estimate height (rough)
    let estHeight = 6; // top margin
    if (q.questionType === "text") estHeight += 6;
    if (qEntry) estHeight += questionImgMaxH;
    estHeight += (q.options?.length || 0) * 6;

    const fitsInLeft = leftY + estHeight <= safeBottom;
    const fitsInRight = rightY + estHeight <= safeBottom;

    if (preferredCol === 0 && !fitsInLeft) {
      if (fitsInRight) preferredCol = 1;
      else { doc.addPage(); leftY = rightY = marginY; preferredCol = 0; }
    } else if (preferredCol === 1 && !fitsInRight) {
      if (fitsInLeft) preferredCol = 0;
      else { doc.addPage(); leftY = rightY = marginY; preferredCol = 0; }
    }

    const colX = preferredCol === 0 ? marginX : marginX + innerW / 2 + (midLineW / 2);
    let usedY = preferredCol === 0 ? leftY : rightY;

    // Question text
    if (q.questionType === "text") {
      doc.setFontSize(pdfBodyPt);
      const split = doc.splitTextToSize(`${qNumber}. ${sanitizeQuestionText(q.question.text)}`, colWidth - 2 * colPadding);
      doc.text(split, colX + colPadding, usedY);
      usedY += split.length * 5;
    } else {
      doc.setFontSize(pdfBodyPt);
      doc.text(`${qNumber}.`, colX + colPadding, usedY);
      usedY += 5;
    }

    // Question image
    if (qEntry) {
      const drawW = colWidth - 2 * colPadding;
      const aspect = qEntry.naturalWidth / qEntry.naturalHeight;
      const drawH = Math.min(questionImgMaxH, drawW / aspect);
      addImage(qEntry, colX + colPadding, usedY, drawW, drawH);
      usedY += drawH + 2;
    }

    // Options
    for (let i = 0; i < (q.options || []).length; i++) {
      const opt = q.options[i];
      if (q.optionType === "text") {
        const clean = sanitizeOptionText(opt.text);
        doc.text(`${String.fromCharCode(65 + i)}) ${clean}`, colX + colPadding + 4, usedY);
        usedY += 5;
      } else {
        const entry = optsEntries[i];
        if (entry) {
          const drawH = optionImgMaxH;
          const drawW = Math.min((entry.naturalWidth / entry.naturalHeight) * drawH, colWidth - 2 * colPadding - 4);
          addImage(entry, colX + colPadding + 4, usedY, drawW, drawH);
          usedY += drawH + 2;
        } else {
          doc.text(`${String.fromCharCode(65 + i)}) [image]`, colX + colPadding + 4, usedY);
          usedY += 5;
        }
      }
    }

    if (preferredCol === 0) leftY = usedY; else rightY = usedY;
    col = preferredCol;
    qNumber++;
  }

  doc.save("QuestionPaper.pdf");
}

//   // ---------- helper utilities ----------
//   const collapseWs = (s = "") => String(s).replace(/\s+/g, " ").trim();
//   const sanitizeOptionText = (s = "") => {
//     let t = collapseWs(s);
//     t = t.replace(/^([A-D])[\)\.\s]+\1[\)\.\s]*/i, "$1) ");
//     t = t.replace(/^([A-D])[\)\.\s]*/i, "");
//     return t.trim();
//   };
//   const sanitizeQuestionText = (s = "") => collapseWs(s);

//   // ---------- main generator ----------
//   async function generatePDFWithProgressOld(batchSize = 8) {
//     if (!test || !questions || questions.length === 0) {
//       console.warn("No test/questions provided.");
//       return;
//     }

//     setIsGenerating(true);

//     // PDF & layout config (reduced vertical padding where appropriate)
//     const doc = new jsPDF({ unit: "mm", format: "a4" });
//     const pageW = doc.internal.pageSize.getWidth();
//     const pageH = doc.internal.pageSize.getHeight();

//     const marginX = 8;
//     const marginY = 8;
//     const innerW = pageW - 2 * marginX;
//     const midLineW = 0.4;
//     const colPadding = 3.5; // slightly smaller padding
//     const colWidth = (innerW - midLineW) / 2;
//     const questionImgMaxHDefault = 30; // mm
//     const optionImgMaxH = 10; // mm (strict)
//     const topBarH = 12; // reduced from 15
//     const instrBoxH = 22; // reduced instruction height
//     const smallTopPad = 3; // smaller top padding for question area
//     const bottomLimit = pageH - marginY;
//     const safetyMarginMm = 0.25;

//     const bottomBuffer = 10; // mm
// const safeBottom = bottomLimit - bottomBuffer;

//     // DPI conversions (use devicePixelRatio)
//     const DPI = (window.devicePixelRatio || 1) * 96;
//     const pxToMm = (px: number) => (px * 25.4) / DPI;
//     const mmToPx = (mm: number) => (mm * DPI) / 25.4;

//     // font mapping
//     const pdfBodyPt = 11;
//     const measureFontPx = pdfBodyPt * (96 / 72);

//     // state per page: separate column cursors (prevents mixing)
//     let leftY = marginY;   // cursor for left column
//     let rightY = marginY;  // cursor for right column
//     let col = 0; // default place into left column first
//     let qNumber = 1;
//     let questionAreaTopY = 0; // where questions start on current page

//     // image cache: url -> { imgEl|null, dataUrl|null }
//     const imgCache = new Map<string, { img?: HTMLImageElement | null; dataUrl?: string | null }>();

//     // Preload with fetch -> blob -> dataURL attempt, fallback to Image()
//     async function preloadImage(url?: string) {
//       if (!url) return { img: null, dataUrl: null };
//       if (imgCache.has(url)) return imgCache.get(url)!;

//       // attempt fetch first (works if server allows CORS)
//       try {
//         const resp = await fetch(url, { mode: "cors" });
//         if (!resp.ok) throw new Error("fetch failed");
//         const blob = await resp.blob();
//         // convert blob -> dataURL
//         const dataUrl = await new Promise<string>((res, rej) => {
//           const fr = new FileReader();
//           fr.onload = () => res(String(fr.result));
//           fr.onerror = () => rej(new Error("fileReaderFail"));
//           fr.readAsDataURL(blob);
//         });
//         // create Image using the dataURL
//         const imgEl = new Image();
//         imgEl.src = dataUrl;
//         await new Promise<void>((resolve) => { imgEl.onload = () => resolve(); imgEl.onerror = () => resolve(); });
//         const result = { img: imgEl, dataUrl };
//         imgCache.set(url, result);
//         return result;
//       } catch {
//         // fallback: try HTML Image with crossOrigin anonymous (may still fail)
//         try {
//           const imgEl = new Image();
//           imgEl.crossOrigin = "Anonymous";
//           imgEl.src = url;
//           await new Promise<void>((resolve) => { imgEl.onload = () => resolve(); imgEl.onerror = () => resolve(); });
//           const result = { img: imgEl, dataUrl: null };
//           imgCache.set(url, result);
//           return result;
//         } catch {
//           const result = { img: null, dataUrl: null };
//           imgCache.set(url, result);
//           return result;
//         }
//       }
//     }

//     // try to add image to jsPDF: prefer dataUrl, fallback to imgEl, return boolean success
//     function addImageToPdfCached(entry: { img?: HTMLImageElement | null; dataUrl?: string | null } | null, x: number, y: number, w: number, h: number) {
//       if (!entry) return false;
//       try {
//         if (entry.dataUrl) {
//           doc.addImage(entry.dataUrl, "JPEG", x, y, w, h);
//           return true;
//         } else if (entry.img) {
//           (doc as any).addImage(entry.img, "JPEG", x, y, w, h);
//           return true;
//         }
//       } catch {
//         // try canvas fallback if we have img element and it's not tainted
//         try {
//           if (entry.img) {
//             const canvas = document.createElement("canvas");
//             canvas.width = entry.img.naturalWidth || entry.img.width;
//             canvas.height = entry.img.naturalHeight || entry.img.height;
//             const ctx = canvas.getContext("2d");
//             if (ctx) {
//               ctx.drawImage(entry.img, 0, 0);
//               const data = canvas.toDataURL("image/jpeg", 0.9);
//               doc.addImage(data, "JPEG", x, y, w, h);
//               return true;
//             }
//           }
//         } catch {
//           // fall through
//         }
//       }
//       return false;
//     }

//     // measurement div (single reusable)
//     const measureDiv = document.createElement("div");
//     measureDiv.style.position = "absolute";
//     measureDiv.style.left = "-99999px";
//     measureDiv.style.visibility = "hidden";
//     measureDiv.style.width = `${mmToPx(colWidth - 2 * colPadding)}px`;
//     measureDiv.style.fontFamily = "Arial, Helvetica, sans-serif";
//     measureDiv.style.whiteSpace = "normal";
//     measureDiv.style.lineHeight = "16px";
//     measureDiv.style.fontSize = `${measureFontPx}px`;
//     document.body.appendChild(measureDiv);

//     // progress overlay
//     const overlayId = "__pdf_gen_overlay__";
//     let overlay = document.getElementById(overlayId) as HTMLDivElement | null;
//     if (!overlay) {
//       overlay = document.createElement("div");
//       overlay.id = overlayId;
//       overlay.style.position = "fixed";
//       overlay.style.left = "0";
//       overlay.style.top = "0";
//       overlay.style.width = "100%";
//       overlay.style.height = "100%";
//       overlay.style.display = "flex";
//       overlay.style.alignItems = "center";
//       overlay.style.justifyContent = "center";
//       overlay.style.background = "rgba(0,0,0,0.45)";
//       overlay.style.zIndex = "999999";
//       overlay.style.color = "#fff";
//       overlay.style.fontSize = "15px";
//       overlay.style.flexDirection = "column";
//       overlay.innerHTML = `<div style="padding:12px 18px;border-radius:8px;background:#111;opacity:0.95;min-width:220px;text-align:center">
//         <div id="${overlayId}_text">Preparing PDF…</div>
//         <div style="height:8px"></div>
//         <div style="width:100%;background:#333;border-radius:4px;height:8px;overflow:hidden">
//           <div id="${overlayId}_bar" style="height:100%;width:0%;background:#0bcd8b"></div>
//         </div>
//       </div>`;
//       document.body.appendChild(overlay);
//     }
//     const setProgress = (p: number, text?: string) => {
//       const bar = document.getElementById(`${overlayId}_bar`);
//       const txt = document.getElementById(`${overlayId}_text`);
//       if (bar) (bar as HTMLElement).style.width = `${Math.max(0, Math.min(100, p))}%`;
//       if (txt && text !== undefined) txt.innerText = text;
//     };
//     const showOverlay = () => { if (overlay) overlay.style.display = "flex"; };
//     const hideOverlay = () => { if (overlay) overlay.style.display = "none"; };

//     const safeSetLineDash = (arr: number[]) => {
//       if ((doc as any).setLineDashPattern) (doc as any).setLineDashPattern(arr, 0);
//       else if ((doc as any).setLineDash) (doc as any).setLineDash(arr, 0);
//     };

//     // draw page border and mid line only from question area down
//     const drawPageBorder = (questionsFromY: number) => {
//       doc.setDrawColor(0, 0, 0);
//       doc.setLineWidth(0.45);
//       doc.rect(marginX, marginY, innerW, pageH - 2 * marginY);
//       const midX = marginX + innerW / 2;
//       doc.setLineWidth(midLineW);
//       doc.line(midX, questionsFromY, midX, pageH - marginY);
//       doc.setLineWidth(0.45);
//     };

//     // draw first-page full header (reduced vertical padding)
//     const drawFullHeader = () => {
//       // reset cursors for new page
//       leftY = marginY;
//       rightY = marginY;

//       let y = marginY;
//       const leftW = innerW * 0.85;
//       const rightW = innerW * 0.15;

//       // top bar
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(pdfBodyPt + 2);
//       doc.setTextColor(0, 0, 0);
//       doc.rect(marginX, y, leftW, topBarH, "S");
//       doc.text("D. M. Academy", marginX + 6, y + (topBarH / 2) + 2);

//       doc.setFillColor(0, 0, 0);
//       doc.rect(marginX + leftW, y, rightW, topBarH, "F");
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(pdfBodyPt);
//       doc.text(test.course.toUpperCase(), marginX + leftW + rightW / 2, y + (topBarH / 2) + 2, { align: "center" });
//       doc.setTextColor(0, 0, 0);

//       y += topBarH + 4;

//       // instructions left and dashed box right (smaller)
//       const halfW = innerW / 2;
//       const instrX = marginX + 5;
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(pdfBodyPt);
//       doc.text("Instructions:", instrX, y + 7);

//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(pdfBodyPt - 1);
//       const instructions = [
//         "All questions are compulsory unless stated otherwise.",
//         "Read each question carefully before answering.",
//         "No use of calculators or mobile phones allowed."
//       ];
//       let ly = y + 11;
//       for (const ln of instructions) {
//         doc.text(ln, instrX, ly);
//         ly += 5;
//       }

//       safeSetLineDash([1, 1]);
//       doc.rect(marginX + halfW + 4, y - 2, halfW - 8, instrBoxH, "S");
//       safeSetLineDash([]);
//       doc.setFont("helvetica", "italic");
//       doc.setFontSize(pdfBodyPt - 1);
//       doc.text("🌟 Best of Luck! Do Your Best. 🌟", marginX + halfW + 10, y + instrBoxH / 2 + 1, { baseline: "middle" });

//       y += instrBoxH + 4;

//       // separation
//       doc.setLineWidth(0.35);
//       doc.line(marginX, y, marginX + innerW, y);
//       y += 3;

//       // metadata vertically centered
//       const metaH = 10;
//       const metaCenter = y + metaH / 2;
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(pdfBodyPt - 1);
//       doc.text(`Date: ${new Date(test.date).toLocaleDateString()}`, marginX + 6, metaCenter + 1);
//       doc.text(`Duration: ${test.duration / 60} hr`, marginX + 6, metaCenter + 5);
//       doc.text(`Marks: ${test.totalMarks}`, marginX + innerW - 68, metaCenter + 1);
//       doc.text(`Total Questions: ${test.questionIds.length}`, marginX + innerW - 68, metaCenter + 5);

//       y += metaH + 4;

//       // course/subject row
//       const csH = 12;
//       doc.setLineWidth(0.6);
//       doc.line(marginX, y, marginX + innerW, y);
//       y += 2;
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(pdfBodyPt);
//       doc.text(`${test.course}${test.subject ? ` (${test.subject})` : ""}`, marginX + innerW / 2, y + csH / 2 - 1, { align: "center" });
//       y += csH;
//       doc.line(marginX, y, marginX + innerW, y);
//       y += 4;

//       // chapter row (centered vertically)
//       if (test.chapter) {
//         const chH = 11;
//         doc.setFont("helvetica", "italic");
//         doc.setFontSize(pdfBodyPt - 1);
//         doc.text(`Chapter: ${test.chapter}`, marginX + innerW / 2, y + chH / 2 - 1, { align: "center" });
//         y += chH + 4;
//         doc.setLineWidth(0.35);
//         doc.line(marginX, y - 3, marginX + innerW, y - 3);
//       }

//       y += smallTopPad;

//       // set top of question area and set both cursors to it
//       questionAreaTopY = y;
//       leftY = questionAreaTopY;
//       rightY = questionAreaTopY;

//       drawPageBorder(questionAreaTopY);
//     };

//     // draw topbar for subsequent pages (same look as first topbar)
//     const drawTopBar = () => {
//       let y = marginY;
//       const leftW = innerW * 0.85;
//       const rightW = innerW * 0.15;

//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(pdfBodyPt + 2);
//       doc.rect(marginX, y, leftW, topBarH, "S");
//       doc.text("D. M. Academy", marginX + 6, y + (topBarH / 2) + 2);

//       doc.setFillColor(0, 0, 0);
//       doc.rect(marginX + leftW, y, rightW, topBarH, "F");
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(pdfBodyPt);
//       doc.text(test.course.toUpperCase(), marginX + leftW + rightW / 2, y + (topBarH / 2) + 2, { align: "center" });
//       doc.setTextColor(0, 0, 0);

//       y += topBarH + 4;
//       questionAreaTopY = y + smallTopPad;
//       leftY = questionAreaTopY;
//       rightY = questionAreaTopY;
//       drawPageBorder(questionAreaTopY);
//     };
// function measureQuestionBlock(q: any, qImgEntry: any, optsEntries: any[], qImgHmm: number) {
//   measureDiv.innerHTML = "";
//   measureDiv.style.width = `${mmToPx(colWidth - 2 * colPadding)}px`;

//   // Question text
//   const qTxt = sanitizeQuestionText(q.questionType === "text" ? q.question.text : "");
//   const qDiv = document.createElement("div");
//   qDiv.style.margin = "0 0 4px 0";
//   qDiv.innerText = qTxt ? `${qNumber}. ${qTxt}` : `${qNumber}.`;
//   measureDiv.appendChild(qDiv);

//   if (qImgEntry && qImgHmm > 0 && (qImgEntry.img || qImgEntry.dataUrl)) {
//   const imgWmm = colWidth - 2 * colPadding;
//   const natW = qImgEntry.img?.naturalWidth || mmToPx(imgWmm);
//   const natH = qImgEntry.img?.naturalHeight || mmToPx(qImgHmm);
//   const aspect = natW / natH;

//   const imgEl = document.createElement("img");
//   imgEl.src = qImgEntry.dataUrl ?? qImgEntry.img?.src ?? "";
//   imgEl.style.display = "block";
//   imgEl.style.width = `${mmToPx(imgWmm)}px`;
//   imgEl.style.height = `${mmToPx(imgWmm / aspect)}px`;
//   imgEl.style.marginTop = "4px";
//   measureDiv.appendChild(imgEl);
// }


//   // Options
//   for (let i = 0; i < (q.options || []).length; i++) {
//     const opt = q.options[i];
//     const optDiv = document.createElement("div");
//     // optDiv.style.marginTop = "3px";

//     if (q.optionType === "text") {
//       const clean = sanitizeOptionText(opt.text);
//       optDiv.innerText = `${String.fromCharCode(65 + i)}) ${clean}`;
//     } else {
//       const entry = optsEntries[i];
//       if (entry && (entry.img || entry.dataUrl)) {
//         const drawH = optionImgMaxH;
//         const drawW = Math.min(
//           ((entry.img?.naturalWidth || 1) / (entry.img?.naturalHeight || 1)) * drawH,
//           colWidth - 20 * colPadding - 4
//         );

//         const imgEl = document.createElement("img");
//         imgEl.src = entry.dataUrl ?? entry.img?.src ?? "";
//         imgEl.style.width = `${mmToPx(drawW)}px`;
//         imgEl.style.height = `${mmToPx(drawH)}px`;
//         imgEl.style.maxHeight='25px'
//         imgEl.style.display = "block";
//         optDiv.appendChild(imgEl);
//       } else {
//         optDiv.innerText = `${String.fromCharCode(65 + i)}) [image]`;
//       }
//     }

//     measureDiv.appendChild(optDiv);
//   }

//   const measuredPx = measureDiv.getBoundingClientRect().height;
//   const measuredMm = pxToMm(measuredPx) + safetyMarginMm;
//   return measuredMm;
// }

// async function addAndRenderQuestion(q: any, preloaded: { qImg: any; optsImg: any[] }) {
//   const qEntry = preloaded.qImg || { img: null, dataUrl: null };
//   const optsEntries = preloaded.optsImg || [];

//   let qImgTargetH = qEntry && (qEntry.img || qEntry.dataUrl)
//     ? Math.min(questionImgMaxHDefault, questionImgMaxHDefault)
//     : 0;

//   let preferredCol = col;
//   const colBottom = bottomLimit;

//   let measuredMm = measureQuestionBlock(q, qEntry, optsEntries, qImgTargetH);

//   if (measuredMm > (colBottom - questionAreaTopY)) {
//    let attempts = 0;
// while ((preferredCol === 0 ? leftY : rightY) + measuredMm > safeBottom && attempts < 6 && qImgTargetH > 6) {
//     qImgTargetH = Math.max(6, qImgTargetH - 2);
//     measuredMm = measureQuestionBlock(q, qEntry, optsEntries, qImgTargetH);
//     attempts++;
// }
//   }
// const fitsInLeft = (leftY + measuredMm) <= safeBottom;
// const fitsInRight = (rightY + measuredMm) <= safeBottom;
//   let placeCol = preferredCol;

//   if (preferredCol === 0 && !fitsInLeft) {
//     if (fitsInRight) placeCol = 1;
//     else { doc.addPage(); drawTopBar(); placeCol = 0; }
//   } else if (preferredCol === 1 && !fitsInRight) {
//     if (fitsInLeft) placeCol = 0;
//     else { doc.addPage(); drawTopBar(); placeCol = 0; }
//   }

//   const colX = placeCol === 0 ? marginX : marginX + innerW / 2 + (midLineW / 2);
//   // let usedY = placeCol === 0 ? leftY : rightY;

//   const qText = sanitizeQuestionText(q.questionType === "text" ? q.question.text : "");
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(pdfBodyPt);

// const questionTopMargin = 6; // new margin in mm
// if (placeCol === 0) leftY += questionTopMargin;
// else rightY += questionTopMargin;

// let usedY = placeCol === 0 ? leftY : rightY;

// // Question text
// if (qText) {
//   const split = doc.splitTextToSize(`${qNumber}. ${qText}`, colWidth - 2 * colPadding);
//   doc.text(split, colX + colPadding, usedY);
//   usedY += split.length * 5;
// } else {
//   doc.text(`${qNumber}.`, colX + colPadding, usedY);
//   usedY += 5;
// }

// // Question image (keep aspect ratio, no stretch)
// if (qEntry && (qEntry.img || qEntry.dataUrl) && qImgTargetH > 0) {
//   const maxW = colWidth - 2 * colPadding;
//   const natW = qEntry.img?.naturalWidth || maxW;
//   const natH = qEntry.img?.naturalHeight || qImgTargetH;
//   const aspect = natW / natH;

//   const drawW = maxW;
//   const drawH = drawW / aspect;

//   addImageToPdfCached(qEntry, colX + colPadding, usedY, drawW, drawH);
//   usedY += drawH + 4;
// }


//   for (let i = 0; i < (q.options || []).length; i++) {
//     const opt = q.options[i];
//     if (q.optionType === "text") {
//       const clean = sanitizeOptionText(opt.text);
//       const label = `${String.fromCharCode(65 + i)}) `;
//       const splitOpt = doc.splitTextToSize(label + clean, colWidth - 2 * colPadding - 4);
//       doc.text(splitOpt, colX + colPadding + 4, usedY);
//       usedY += splitOpt.length * 5;
//     } else {
//       const entry = optsEntries[i];
//       if (entry && (entry.img || entry.dataUrl)) {
//         const drawH = optionImgMaxH;
//         const drawW = Math.min(
//           ((entry.img?.naturalWidth || 1) / (entry.img?.naturalHeight || 1)) * drawH,
//           colWidth - 10 * colPadding - 4
//         );
//         addImageToPdfCached(entry, colX + colPadding + 4, usedY, drawW, drawH);
//         usedY += drawH + 4;
//       } else {
//         doc.text(`${String.fromCharCode(65 + i)}) [image]`, colX + colPadding + 4, usedY + 6);
//         usedY += 8;
//       }
//     }
//   }

//   if (placeCol === 0) leftY = usedY;
//   else rightY = usedY;

//   col = placeCol;
//   qNumber++;
// }


//     // ---------- preload images in batches (with progress) ----------
//     try {
//       showOverlay();
//       setProgress(0, "Preparing images (0%)");

//       // gather unique urls
//       const urls: string[] = [];
//       questions.forEach((q) => {
//         if (q.questionType === "image" && q.question?.imgUrl) urls.push(q.question.imgUrl);
//         if (q.options && q.options.length) {
//           for (const opt of q.options) {
//             if (q.optionType === "image" && opt?.imgUrl) urls.push(opt.imgUrl);
//           }
//         }
//       });
//       const unique = Array.from(new Set(urls));
//       const total = unique.length;
//       let done = 0;

//       for (let i = 0; i < unique.length; i += batchSize) {
//         const batch = unique.slice(i, i + batchSize);
//         await Promise.all(batch.map(async (u) => {
//           await preloadImage(u);
//           done++;
//           const pct = total === 0 ? 100 : Math.round((done / total) * 100);
//           setProgress(pct, `Loading images (${done}/${total})`);
//         }));
//         // yield
//         await new Promise((r) => setTimeout(r, 0));
//       }

//       setProgress(100, "Images ready — generating PDF...");
//       await new Promise((r) => setTimeout(r, 80));

// const preloadedMap = questions.map((q) => {
//   const qEntry =
//     q.question?.imgUrl && imgCache.has(q.question.imgUrl)
//       ? imgCache.get(q.question.imgUrl)!
//       : { img: null, dataUrl: null };

//   const opts = (q.options || []).map((opt: { imgUrl?: string }) =>
//     opt?.imgUrl && imgCache.has(opt.imgUrl)
//       ? imgCache.get(opt.imgUrl)!
//       : { img: null, dataUrl: null }
//   );

//   return { qImg: qEntry, optsImg: opts };
// });


//       // ---------- start rendering ----------
//       drawFullHeader();
//       for (let i = 0; i < questions.length; i++) {
//         const pct = Math.round((i / questions.length) * 100);
//         setProgress(pct, `Rendering question ${i + 1}/${questions.length}`);
//         await addAndRenderQuestion(questions[i], preloadedMap[i]);
//         // yield UI
//         await new Promise((r) => setTimeout(r, 0));
//       }

//       setProgress(100, "Finalizing PDF...");
//       await new Promise((r) => setTimeout(r, 120));
//       doc.save("QuestionPaper.pdf");
//     } catch (err) {
//       console.error("PDF generation error:", err);
//       alert("Error generating PDF — see console.");
//     } finally {
//       hideOverlay();
//       try { if (measureDiv.parentNode) measureDiv.parentNode.removeChild(measureDiv); } catch {}
//       try { const el = document.getElementById(overlayId); if (el && el.parentNode) el.parentNode.removeChild(el); } catch {}
//       setIsGenerating(false);
//     }
//   } // end generatePDFWithProgress
 async function generatePDF(test: any, questions: any[]) {
  if (!test || !questions || questions.length === 0) return;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // layout config
  const marginX = 8;
  const marginY = 8;
  const innerW = pageW - 2 * marginX;
  const midLineW = 0.4;
  const colPadding = 3.5;
  const colWidth = (innerW - midLineW) / 2;

  // sizing rules (keep aspect ratio)
  const questionImgMaxH = 50;                      // max height for question image
  const questionImgMaxW = colWidth - 2 * colPadding - 6; // prefer full column width
  // make option images small (fixed maximum)
  const optionImgMaxH = 8;
  const optionImgMaxW = 30;

  const verticalGap = 5;      // gap between consecutive questions
  const bottomBuffer = 12;    // extra bottom padding (mm)
  const safeBottom = pageH - marginY - bottomBuffer;
  const pdfBodyPt = 10;
  const topBarH = 12;
  const lineHeight = 5;       // mm per text line (used for measurement & rendering)

  // cursors
  let leftY = marginY;
  let rightY = marginY;
  let col = 0;
  let qNumber = 1;

  // image cache
  const imgCache = new Map<string, HTMLImageElement>();

async function preloadImage(url?: string): Promise<HTMLImageElement | null> {
  if (!url) return null;
  if (imgCache.has(url)) return imgCache.get(url) ?? null;

  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = url;
  await new Promise<void>((res) => { img.onload = () => res(); img.onerror = () => res(); });

  // store either the loaded image or null so map.get(...) won't be undefined later
  imgCache.set(url, img || null);
  return img || null;
}

  function addImage(el: HTMLImageElement | null, x: number, y: number, w: number, h: number) {
    if (!el) return;
    try { doc.addImage(el, "JPEG", x, y, w, h); } catch {}
  }

  // ---- header drawing ----
  function drawFullHeader() {
    let y = marginY;
    const leftW = innerW * 0.85;
    const rightW = innerW * 0.15;

    // top bar
    doc.setFont("helvetica", "bold");
    doc.setFontSize(pdfBodyPt + 2);
    doc.rect(marginX, y, leftW, topBarH, "S");
    doc.text("D. M. Academy", marginX + 6, y + (topBarH / 2) + 2);

    doc.setFillColor(0, 0, 0);
    doc.rect(marginX + leftW, y, rightW, topBarH, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(pdfBodyPt);
    doc.text(test.course ? String(test.course).toUpperCase() : "", marginX + leftW + rightW / 2, y + (topBarH / 2) + 2, { align: "center" });
    doc.setTextColor(0, 0, 0);

    y += topBarH + 4;

    // instructions
    const halfW = innerW / 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(pdfBodyPt);
    doc.text("Instructions:", marginX + 5, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(pdfBodyPt - 1);
    const instructions = [
      "All questions are compulsory unless stated otherwise.",
      "Read each question carefully before answering.",
      "No use of calculators or mobile phones allowed."
    ];
    let ly = y + 11;
    for (const ln of instructions) { doc.text(ln, marginX + 5, ly); ly += 5; }

    doc.setLineWidth(0.35);
    doc.rect(marginX + halfW + 4, y - 2, halfW - 8, 22, "S");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(pdfBodyPt - 1);
    doc.text("🌟 Best of Luck! Do Your Best. 🌟", marginX + halfW + 10, y + 11, { baseline: "middle" });

    y += 26;

    // metadata row
    doc.setFont("helvetica", "normal");
    doc.setFontSize(pdfBodyPt - 1);
    doc.text(`Date: ${new Date(test.date || Date.now()).toLocaleDateString()}`, marginX + 6, y);
    doc.text(`Duration: ${test.duration ? (test.duration / 60) + " hr" : ""}`, marginX + 6, y + 5);
    doc.text(`Marks: ${test.totalMarks ?? ""}`, marginX + innerW - 68, y);
    doc.text(`Total Questions: ${(test.questionIds || questions).length}`, marginX + innerW - 68, y + 5);

    y += 10;

    // course/subject row
    const csH = 12;
    doc.setLineWidth(0.6);
    doc.line(marginX, y, marginX + innerW, y);
    y += 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(pdfBodyPt);
    doc.text(`${test.course ?? ""}${test.subject ? ` (${test.subject})` : ""}`, marginX + innerW / 2, y + csH / 2 - 1, { align: "center" });
    y += csH;
    doc.line(marginX, y, marginX + innerW, y);

    if (test.chapter) {
      const chH = 11;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(pdfBodyPt - 1);
      doc.text(`Chapter: ${test.chapter}`, marginX + innerW / 2, y + chH / 2 - 1, { align: "center" });
      y += chH + 2;
      doc.setLineWidth(0.35);
      doc.line(marginX, y - 2, marginX + innerW, y - 2);
    }

    leftY = rightY = y + 4;

    // draw border and midline
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.45);
    doc.rect(marginX, marginY, innerW, pageH - 2 * marginY);
    const midX = marginX + innerW / 2;
    doc.setLineWidth(midLineW);
    doc.line(midX, leftY, midX, pageH - marginY);
    doc.setLineWidth(0.45);
  }

  function drawTopBarOnly() {
    let y = marginY;
    const leftW = innerW * 0.85;
    const rightW = innerW * 0.15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(pdfBodyPt + 2);
    doc.rect(marginX, y, leftW, topBarH, "S");
    doc.text("D. M. Academy", marginX + 6, y + (topBarH / 2) + 2);

    doc.setFillColor(0, 0, 0);
    doc.rect(marginX + leftW, y, rightW, topBarH, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(pdfBodyPt);
    doc.text(test.course ? String(test.course).toUpperCase() : "", marginX + leftW + rightW / 2, y + (topBarH / 2) + 2, { align: "center" });
    doc.setTextColor(0, 0, 0);

    leftY = rightY = y + topBarH + 4;

    // draw border & midline each page so border appears on all pages
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.45);
    doc.rect(marginX, marginY, innerW, pageH - 2 * marginY);
    const midX = marginX + innerW / 2;
    doc.setLineWidth(midLineW);
    doc.line(midX, leftY, midX, pageH - marginY);
    doc.setLineWidth(0.45);
  }

  // preload images
  for (const q of questions) {
    if (q.questionType === "image" && q.question?.imgUrl) await preloadImage(q.question.imgUrl);
    if (q.options && q.optionType === "image") {
      for (const opt of q.options) if (opt?.imgUrl) await preloadImage(opt.imgUrl);
    }
  }

  // first page header
  drawFullHeader();

  // render questions
  for (const q of questions) {
    let preferredCol = col;
   const qEntry: HTMLImageElement | null =
  q.questionType === "image" && q.question?.imgUrl
    ? (imgCache.get(q.question.imgUrl) ?? null)
    : null;

    const optsEntries: (HTMLImageElement | null)[] = (q.options || []).map((opt: any) =>
  q.optionType === "image" && opt?.imgUrl ? (imgCache.get(opt.imgUrl) ?? null) : null
);
    // --- measure exact height required for this question block ---
    // set font size for measurement
    doc.setFont("helvetica", "normal");
    doc.setFontSize(pdfBodyPt);
    const qText = q.questionType === "text" ? sanitizeQuestionText(q.question?.text || "") : "";
    // question text width uses full column width (we put text below image for consistent wrapping)
    const textWidth = colWidth - 2 * colPadding - 6;
    const qLines = qText ? doc.splitTextToSize(qText, textWidth) : [];
    let measuredHeight = verticalGap; // gap on top

    // image height if present (cap by max)
    if (qEntry) {
      const natW = Math.max(qEntry.naturalWidth || 1, 1);
      const natH = Math.max(qEntry.naturalHeight || 1, 1);
      // prefer full width
      let drawW = questionImgMaxW;
      let drawH = (natH / natW) * drawW;
      if (drawH > questionImgMaxH) {
        drawH = questionImgMaxH;
        drawW = (natW / natH) * drawH;
      }
      const maxAvailW = colWidth - 2 * colPadding - 6;
      if (drawW > maxAvailW) {
        drawW = maxAvailW;
        drawH = (natH / natW) * drawW;
      }
      measuredHeight += drawH + 2;
    }

    // question text height
    measuredHeight += qLines.length * lineHeight;

    // options height
    for (let i = 0; i < (q.options || []).length; i++) {
      const opt = q.options[i];
      if (q.optionType === "text") {
        const clean = sanitizeOptionText(opt.text || "");
        const optLines = doc.splitTextToSize(clean, colWidth - 2 * colPadding - 8);
        measuredHeight += optLines.length * lineHeight;
      } else {
        // small fixed option image height
        // compute aspect-safe but cap by optionImgMaxH / optionImgMaxW
        measuredHeight += optionImgMaxH + 4;
      }
    }

    // --- decide where to place (left/right/new page) ---
    const fitsLeft = (leftY + measuredHeight) <= safeBottom;
    const fitsRight = (rightY + measuredHeight) <= safeBottom;

    if (preferredCol === 0 && !fitsLeft) {
      if (fitsRight) preferredCol = 1;
      else { doc.addPage(); drawTopBarOnly(); preferredCol = 0; }
    } else if (preferredCol === 1 && !fitsRight) {
      if (fitsLeft) preferredCol = 0;
      else { doc.addPage(); drawTopBarOnly(); preferredCol = 0; }
    }

    const colX = preferredCol === 0 ? marginX : marginX + innerW / 2 + (midLineW / 2);
    let usedY = preferredCol === 0 ? leftY : rightY;

    // gap before question
    usedY += verticalGap;

    // question number bold
    doc.setFont("helvetica", "bold");
    doc.setFontSize(pdfBodyPt);
    doc.text(`${qNumber}.`, colX + colPadding, usedY);

    // question image if present (draw aligned at number start, but text below)
    if (qEntry) {
      const natW = Math.max(qEntry.naturalWidth || 1, 1);
      const natH = Math.max(qEntry.naturalHeight || 1, 1);
      let drawW = questionImgMaxW;
      let drawH = (natH / natW) * drawW;
      if (drawH > questionImgMaxH) {
        drawH = questionImgMaxH;
        drawW = (natW / natH) * drawH;
      }
      const maxAvailW = colWidth - 2 * colPadding - 6;
      if (drawW > maxAvailW) {
        drawW = maxAvailW;
        drawH = (natH / natW) * drawW;
      }
      addImage(qEntry, colX + colPadding + 6, usedY - 3, drawW, drawH);
      usedY += drawH + 2;
    }

    // question text (may be long) - write and if needed split to next page/column
    if (qText) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(pdfBodyPt);
      let lines = doc.splitTextToSize(qText, textWidth);
      let li = 0;
      while (li < lines.length) {
        const remainingSpace = safeBottom - usedY;
        const maxLinesThatFit = Math.floor(remainingSpace / lineHeight);
        if (maxLinesThatFit <= 0) {
          // not enough space: move to next column/page
          if (preferredCol === 0) {
            // try switch to right column if it has space
            const rightRemaining = safeBottom - rightY;
            if (rightRemaining > 0 && (rightY + (lines.length - li) * lineHeight) <= safeBottom) {
              preferredCol = 1;
              usedY = rightY;
            } else {
              // new page
              doc.addPage();
              drawTopBarOnly();
              preferredCol = 0;
              usedY = leftY;
            }
          } else {
            // currently right column - must go to new page
            doc.addPage();
            drawTopBarOnly();
            preferredCol = 0;
            usedY = leftY;
          }
          usedY += verticalGap;
          continue;
        }

        const take = Math.min(maxLinesThatFit, lines.length - li);
        const chunk = lines.slice(li, li + take);
        doc.text(chunk, colX + colPadding + 6, usedY);
        usedY += chunk.length * lineHeight;
        li += take;

        if (li < lines.length) {
          // more lines remain but no space - add page/column and continue
          if (preferredCol === 0) {
            // try right column
            const fitsOnRight = (rightY + (lines.length - li) * lineHeight) <= safeBottom;
            if (fitsOnRight) {
              preferredCol = 1;
              usedY = rightY;
              // draw nothing extra; border/topbar already present
              usedY += verticalGap;
            } else {
              doc.addPage();
              drawTopBarOnly();
              preferredCol = 0;
              usedY = leftY + verticalGap;
            }
          } else {
            // currently right col
            doc.addPage();
            drawTopBarOnly();
            preferredCol = 0;
            usedY = leftY + verticalGap;
          }
        }
      }
    }

    // options
    for (let i = 0; i < (q.options || []).length; i++) {
      const opt = q.options[i];
      doc.setFont("helvetica", "normal");
      doc.setFontSize(pdfBodyPt);
      if (q.optionType === "text") {
        const clean = sanitizeOptionText(opt.text || "");
        const optLines = doc.splitTextToSize(clean, colWidth - 2 * colPadding - 8);
        doc.text(`${String.fromCharCode(65 + i)}) ${optLines[0] || ""}`, colX + colPadding + 4, usedY);
        usedY += optLines.length * lineHeight;
      } else {
        const entry = optsEntries[i];
        if (entry) {
          // prefer fix height, but ensure width fits
          const natW = Math.max(entry.naturalWidth || 1, 1);
          const natH = Math.max(entry.naturalHeight || 1, 1);
          let drawH = optionImgMaxH;
          let drawW = (natW / natH) * drawH;
          if (drawW > optionImgMaxW) {
            drawW = Math.min(optionImgMaxW, colWidth - 2 * colPadding - 4);
            drawH = (natH / natW) * drawW;
          }
          addImage(entry, colX + colPadding + 4, usedY, drawW, drawH);
          usedY += drawH + 4;
        } else {
          doc.text(`${String.fromCharCode(65 + i)}) [image]`, colX + colPadding + 4, usedY);
          usedY += optionImgMaxH + 4;
        }
      }

      // if options push beyond safeBottom, move to next column/page (rare because we measured earlier)
      if (usedY > safeBottom) {
        // move to next column or page
        if (col === 0) {
          // try right
          if ((rightY + (usedY - leftY)) <= safeBottom) {
            preferredCol = 1;
            usedY = rightY + verticalGap;
          } else {
            doc.addPage();
            drawTopBarOnly();
            preferredCol = 0;
            usedY = leftY + verticalGap;
          }
        } else {
          doc.addPage();
          drawTopBarOnly();
          preferredCol = 0;
          usedY = leftY + verticalGap;
        }
      }
    }

    // update cursor
    if (preferredCol === 0) leftY = usedY; else rightY = usedY;
    col = preferredCol;
    qNumber++;
  }

  doc.save("QuestionPaper.pdf");
}


async function generatePDFNew(test: any, questions: any[]) {
  if (!test || !questions || questions.length === 0) return;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // layout config
  const marginX = 8;
  const marginY = 8;
  const innerW = pageW - 2 * marginX;
  const midLineW = 0.4;
  const colPadding = 3.5;
  const colWidth = (innerW - midLineW) / 2;

  // sizing rules (keep aspect ratio)
  const questionImgMaxH = 50;                      // max height for question image
  const questionImgMaxW = colWidth - 2 * colPadding - 6; // prefer full column width
  // small option images
  const optionImgMaxH = 8;
  const optionImgMaxW = 30;

  const verticalGap = 5;      // gap between consecutive questions
  const bottomBuffer = 12;    // extra bottom padding (mm)
  const safeBottom = pageH - marginY - bottomBuffer;
  const pdfBodyPt = 10;
  const topBarH = 12;
  const lineHeight = 5;       // mm per text line (used for measurement & rendering)

  // cursors
  let leftY = marginY;
  let rightY = marginY;
  let col = 0;
  let qNumber = 1;

  // image cache
  const imgCache = new Map<string, HTMLImageElement>();

  async function preloadImage(url?: string) {
    if (!url) return null;
    if (imgCache.has(url)) return imgCache.get(url)!;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    await new Promise<void>((res) => { img.onload = () => res(); img.onerror = () => res(); });
    imgCache.set(url, img);
    return img;
  }

  function addImage(el: HTMLImageElement | null, x: number, y: number, w: number, h: number) {
    if (!el) return;
    try { doc.addImage(el, "JPEG", x, y, w, h); } catch {}
  }

  // ---- header drawing ----
  function drawFullHeader() {
    let y = marginY;
    const leftW = innerW * 0.85;
    const rightW = innerW * 0.15;

    // top bar
    doc.setFont("helvetica", "bold");
    doc.setFontSize(pdfBodyPt + 2);
    doc.rect(marginX, y, leftW, topBarH, "S");
    doc.text("D. M. Academy", marginX + 6, y + (topBarH / 2) + 2);

    doc.setFillColor(0, 0, 0);
    doc.rect(marginX + leftW, y, rightW, topBarH, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(pdfBodyPt);
    doc.text(test.course ? String(test.course).toUpperCase() : "", marginX + leftW + rightW / 2, y + (topBarH / 2) + 2, { align: "center" });
    doc.setTextColor(0, 0, 0);

    y += topBarH + 4;

    // instructions
    const halfW = innerW / 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(pdfBodyPt);
    doc.text("Instructions:", marginX + 5, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(pdfBodyPt - 1);
    const instructions = [
      "All questions are compulsory unless stated otherwise.",
      "Read each question carefully before answering.",
      "No use of calculators or mobile phones allowed."
    ];
    let ly = y + 11;
    for (const ln of instructions) { doc.text(ln, marginX + 5, ly); ly += 5; }

    doc.setLineWidth(0.35);
    doc.rect(marginX + halfW + 4, y - 2, halfW - 8, 22, "S");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(pdfBodyPt - 1);
    doc.text("🌟 Best of Luck! Do Your Best. 🌟", marginX + halfW + 10, y + 11, { baseline: "middle" });

    y += 26;

    // metadata row
    doc.setFont("helvetica", "normal");
    doc.setFontSize(pdfBodyPt - 1);
    doc.text(`Date: ${new Date(test.date || Date.now()).toLocaleDateString()}`, marginX + 6, y);
    doc.text(`Duration: ${test.duration ? (test.duration / 60) + " hr" : ""}`, marginX + 6, y + 5);
    doc.text(`Marks: ${test.totalMarks ?? ""}`, marginX + innerW - 68, y);
    doc.text(`Total Questions: ${(test.questionIds || questions).length}`, marginX + innerW - 68, y + 5);

    y += 10;

    // course/subject row
    const csH = 12;
    doc.setLineWidth(0.6);
    doc.line(marginX, y, marginX + innerW, y);
    y += 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(pdfBodyPt);
    doc.text(`${test.course ?? ""}${test.subject ? ` (${test.subject})` : ""}`, marginX + innerW / 2, y + csH / 2 - 1, { align: "center" });
    y += csH;
    doc.line(marginX, y, marginX + innerW, y);

    if (test.chapter) {
      const chH = 11;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(pdfBodyPt - 1);
      doc.text(`Chapter: ${test.chapter}`, marginX + innerW / 2, y + chH / 2 - 1, { align: "center" });
      y += chH + 2;
      doc.setLineWidth(0.35);
      doc.line(marginX, y - 2, marginX + innerW, y - 2);
    }

    leftY = rightY = y + 4;

    // draw border and midline
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.45);
    doc.rect(marginX, marginY, innerW, pageH - 2 * marginY);
    const midX = marginX + innerW / 2;
    doc.setLineWidth(midLineW);
    doc.line(midX, leftY, midX, pageH - marginY);
    doc.setLineWidth(0.45);
  }

  function drawTopBarOnly() {
    let y = marginY;
    const leftW = innerW * 0.85;
    const rightW = innerW * 0.15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(pdfBodyPt + 2);
    doc.rect(marginX, y, leftW, topBarH, "S");
    doc.text("D. M. Academy", marginX + 6, y + (topBarH / 2) + 2);

    doc.setFillColor(0, 0, 0);
    doc.rect(marginX + leftW, y, rightW, topBarH, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(pdfBodyPt);
    doc.text(test.course ? String(test.course).toUpperCase() : "", marginX + leftW + rightW / 2, y + (topBarH / 2) + 2, { align: "center" });
    doc.setTextColor(0, 0, 0);

    leftY = rightY = y + topBarH + 4;

    // draw border & midline on each page
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.45);
    doc.rect(marginX, marginY, innerW, pageH - 2 * marginY);
    const midX = marginX + innerW / 2;
    doc.setLineWidth(midLineW);
    doc.line(midX, leftY, midX, pageH - marginY);
    doc.setLineWidth(0.45);
  }

  // preload images
  for (const q of questions) {
    if (q.questionType === "image" && q.question?.imgUrl) await preloadImage(q.question.imgUrl);
    if (q.options && q.optionType === "image") {
      for (const opt of q.options) if (opt?.imgUrl) await preloadImage(opt.imgUrl);
    }
  }

  // first page header
  drawFullHeader();

  // helper to measure question-part (image + qtext) and options separately
 function measureQuestionPart(qEntry: HTMLImageElement | null, qText: string): { partHeight: number; partLines: string[] } {
    let h = 0;
    h += verticalGap;
    if (qEntry) {
      const natW = Math.max(qEntry.naturalWidth || 1, 1);
      const natH = Math.max(qEntry.naturalHeight || 1, 1);
      let drawW = questionImgMaxW;
      let drawH = (natH / natW) * drawW;
      if (drawH > questionImgMaxH) {
        drawH = questionImgMaxH;
        drawW = (natW / natH) * drawH;
      }
      const maxAvailW = colWidth - 2 * colPadding - 6;
      if (drawW > maxAvailW) {
        drawW = maxAvailW;
        drawH = (natH / natW) * drawW;
      }
      h += drawH + 2;
    }
    // text lines
    const textWidth = colWidth - 2 * colPadding - 6;
    const lines = qText ? doc.splitTextToSize(qText, textWidth) : [];
    h += lines.length * lineHeight;
    return { partHeight: h, partLines: lines };
  }

  function measureOptions(q: any, optsEntries: (HTMLImageElement | null)[]) {
    let h = 0;
    const optTextWidth = colWidth - 2 * colPadding - 8;
    for (let i = 0; i < (q.options || []).length; i++) {
      const opt = q.options[i];
      if (q.optionType === "text") {
        const clean = sanitizeOptionText(opt.text || "");
        const lines = doc.splitTextToSize(clean, optTextWidth);
        h += lines.length * lineHeight;
      } else {
        // small fixed option image height + padding
        h += optionImgMaxH + 4;
      }
    }
    return h;
  }

  // render questions with new rule: if only question-part fits, place options in other column/page
  for (const q of questions) {
    let preferredCol = col;
    const qEntry = q.questionType === "image" && q.question?.imgUrl ? imgCache.get(q.question.imgUrl) : null;
    const optsEntries = (q.options || []).map((opt: any) => q.optionType === "image" && opt?.imgUrl ? imgCache.get(opt.imgUrl) : null);

    // measure question part and options separately
    const qText = q.questionType === "text" ? sanitizeQuestionText(q.question?.text || "") : "";
    const { partHeight, partLines } = measureQuestionPart(qEntry ?? null, qText);
    const optsHeight = measureOptions(q, optsEntries);
    const totalHeight = partHeight + optsHeight;

    const fitsLeftTotal = (leftY + totalHeight) <= safeBottom;
    const fitsRightTotal = (rightY + totalHeight) <= safeBottom;
    const questionFitsLeft = (leftY + partHeight) <= safeBottom;
    const questionFitsRight = (rightY + partHeight) <= safeBottom;

    // Main placement logic:
    // 1) If total fits in preferredCol -> place whole block there.
    // 2) Else if question-part fits in preferred col but whole doesn't:
    //      then place question-part in preferred, and place options in other column (or next page)
    // 3) Else if total fits in other column -> place whole block there.
    // 4) Else -> new page & place at left.
    let placeWholeIn = -1; // -1 none, 0 left, 1 right
    if (preferredCol === 0 && fitsLeftTotal) placeWholeIn = 0;
    else if (preferredCol === 1 && fitsRightTotal) placeWholeIn = 1;
    else if (preferredCol === 0 && questionFitsLeft && !fitsLeftTotal) {
      // rule: render question in left, options try to go to right/next
      // we'll render question here and then options separately
      placeWholeIn = -2; // special flag: question-left, options-separate
    } else if (preferredCol === 1 && questionFitsRight && !fitsRightTotal) {
      placeWholeIn = -3; // question-right, options-separate
    } else if (fitsRightTotal) placeWholeIn = 1;
    else if (fitsLeftTotal) placeWholeIn = 0;
    else {
      // doesn't fit either as whole -> new page
      doc.addPage();
      drawTopBarOnly();
      preferredCol = 0;
      // recompute cursors after new page
      // measure again relative to new top Y
      // (but for simplicity just set placeWholeIn to 0 and continue)
      placeWholeIn = 0;
    }

    const colX = preferredCol === 0 ? marginX : marginX + innerW / 2 + (midLineW / 2);
    let usedY = preferredCol === 0 ? leftY : rightY;
    usedY += verticalGap;

    // render question number (bold)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(pdfBodyPt);
    doc.text(`${qNumber}.`, colX + colPadding, usedY);

    // render question image if present
    if (qEntry) {
      const natW = Math.max(qEntry.naturalWidth || 1, 1);
      const natH = Math.max(qEntry.naturalHeight || 1, 1);
      let drawW = questionImgMaxW;
      let drawH = (natH / natW) * drawW;
      if (drawH > questionImgMaxH) {
        drawH = questionImgMaxH;
        drawW = (natW / natH) * drawH;
      }
      const maxAvailW = colWidth - 2 * colPadding - 6;
      if (drawW > maxAvailW) {
        drawW = maxAvailW;
        drawH = (natH / natW) * drawW;
      }
      addImage(qEntry, colX + colPadding + 6, usedY - 3, drawW, drawH);
      usedY += drawH + 2;
    }

    // render question text (splitting across columns/pages if needed)
    if (partLines.length > 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(pdfBodyPt);
      let li = 0;
      while (li < partLines.length) {
        const remainingSpace = safeBottom - usedY;
        const maxLinesThatFit = Math.floor(remainingSpace / lineHeight);
        if (maxLinesThatFit <= 0) {
          // move to next column or page
          if (preferredCol === 0) {
            // try right column
            if ((rightY + (partLines.length - li) * lineHeight) <= safeBottom) {
              preferredCol = 1;
              usedY = rightY;
              // recalc colX for following writes
            } else {
              doc.addPage();
              drawTopBarOnly();
              preferredCol = 0;
              usedY = leftY;
            }
          } else {
            doc.addPage();
            drawTopBarOnly();
            preferredCol = 0;
            usedY = leftY;
          }
          usedY += verticalGap;
          continue;
        }

        const take = Math.min(maxLinesThatFit, partLines.length - li);
        const chunk = partLines.slice(li, li + take);
        doc.text(chunk, (preferredCol === 0 ? marginX : marginX + innerW / 2 + (midLineW / 2)) + colPadding + 6, usedY);
        usedY += chunk.length * lineHeight;
        li += take;

        if (li < partLines.length) {
          // not finished, switch column/page and continue loop
          if (preferredCol === 0) {
            // try right column
            if ((rightY + (partLines.length - li) * lineHeight) <= safeBottom) {
              preferredCol = 1;
              usedY = rightY + verticalGap;
            } else {
              doc.addPage();
              drawTopBarOnly();
              preferredCol = 0;
              usedY = leftY + verticalGap;
            }
          } else {
            doc.addPage();
            drawTopBarOnly();
            preferredCol = 0;
            usedY = leftY + verticalGap;
          }
        }
      }
    }

    // after rendering question-part we either:
    // - render options in same column (placeWholeIn === 0 or 1)
    // - or render options in other column / next page (placeWholeIn === -2 or -3)
    // decide where to put options now
    const optionsShouldBeSeparate = placeWholeIn === -2 || placeWholeIn === -3;
    if (!optionsShouldBeSeparate) {
      // place options in current column (preferredCol may have changed)
      // ensure font normal
      for (let i = 0; i < (q.options || []).length; i++) {
        const opt = q.options[i];
        doc.setFont("helvetica", "normal");
        doc.setFontSize(pdfBodyPt);
        if (q.optionType === "text") {
          const clean = sanitizeOptionText(opt.text || "");
          const optLines = doc.splitTextToSize(clean, colWidth - 2 * colPadding - 8);
          // prefix letter ourselves
          doc.text(`${String.fromCharCode(65 + i)}) ${optLines[0] || ""}`, (preferredCol === 0 ? marginX : marginX + innerW / 2 + (midLineW / 2)) + colPadding + 4, usedY);
          usedY += optLines.length * lineHeight;
        } else {
          const entry = optsEntries[i];
          if (entry) {
            const natW = Math.max(entry.naturalWidth || 1, 1);
            const natH = Math.max(entry.naturalHeight || 1, 1);
            let drawH = optionImgMaxH;
            let drawW = (natW / natH) * drawH;
            if (drawW > optionImgMaxW) {
              drawW = Math.min(optionImgMaxW, colWidth - 2 * colPadding - 4);
              drawH = (natH / natW) * drawW;
            }
            addImage(entry, (preferredCol === 0 ? marginX : marginX + innerW / 2 + (midLineW / 2)) + colPadding + 4, usedY, drawW, drawH);
            usedY += drawH + 4;
          } else {
            doc.text(`${String.fromCharCode(65 + i)}) [image]`, (preferredCol === 0 ? marginX : marginX + innerW / 2 + (midLineW / 2)) + colPadding + 4, usedY);
            usedY += optionImgMaxH + 4;
          }
        }

        // if usedY beyond safeBottom, move to next column/page and continue options there
        if (usedY > safeBottom) {
          if (preferredCol === 0) {
            // try right column
            if ((rightY + (usedY - leftY)) <= safeBottom) {
              preferredCol = 1;
              usedY = rightY + verticalGap;
            } else {
              doc.addPage();
              drawTopBarOnly();
              preferredCol = 0;
              usedY = leftY + verticalGap;
            }
          } else {
            doc.addPage();
            drawTopBarOnly();
            preferredCol = 0;
            usedY = leftY + verticalGap;
          }
        }
      }
      // update cursor for preferredCol
      if (preferredCol === 0) leftY = usedY; else rightY = usedY;
      col = preferredCol;
    } else {
      // special: question-part placed in preferredCol; now put options in other column or next page
      // first update cursor for question-part column
      if (preferredCol === 0) leftY = usedY; else rightY = usedY;

      // determine target column for options
      let optsCol = preferredCol === 0 ? 1 : 0;
      // check if options fit entirely in optsCol at current optsCursor
      const optsCursor = optsCol === 0 ? leftY : rightY;
      const optsFitsInOptsCol = (optsCursor + optsHeight) <= safeBottom;

      if (!optsFitsInOptsCol) {
        // try placing options at top of optsCol (i.e., at its current page top)
        // if opts still don't fit there, start new page and place them at left
        // compute top-of-column Y after topbar
        // we must add a page if opts don't fit entire column
        if (( (optsCol === 0 ? leftY : rightY) + optsHeight) > safeBottom) {
          // try placing at top-of-column: that means using column cursor as-is (we already have leftY/rightY set to top for fresh pages)
          // but if opts still too big for empty column, start a new page and place options there (first column)
          // i.e., create new page
          doc.addPage();
          drawTopBarOnly();
          optsCol = 0;
        }
      }

      // now render options in optsCol starting at its cursor
      let optsUsedY = optsCol === 0 ? leftY : rightY;
      // if placing at same page top and cursor equals top-of-header we may want a small gap
      optsUsedY += verticalGap;

      for (let i = 0; i < (q.options || []).length; i++) {
        const opt = q.options[i];
        doc.setFont("helvetica", "normal");
        doc.setFontSize(pdfBodyPt);
        if (q.optionType === "text") {
          const clean = sanitizeOptionText(opt.text || "");
          const optLines = doc.splitTextToSize(clean, colWidth - 2 * colPadding - 8);
          doc.text(`${String.fromCharCode(65 + i)}) ${optLines[0] || ""}`, (optsCol === 0 ? marginX : marginX + innerW / 2 + (midLineW / 2)) + colPadding + 4, optsUsedY);
          optsUsedY += optLines.length * lineHeight;
        } else {
          const entry = optsEntries[i];
          if (entry) {
            const natW = Math.max(entry.naturalWidth || 1, 1);
            const natH = Math.max(entry.naturalHeight || 1, 1);
            let drawH = optionImgMaxH;
            let drawW = (natW / natH) * drawH;
            if (drawW > optionImgMaxW) {
              drawW = Math.min(optionImgMaxW, colWidth - 2 * colPadding - 4);
              drawH = (natH / natW) * drawW;
            }
            addImage(entry, (optsCol === 0 ? marginX : marginX + innerW / 2 + (midLineW / 2)) + colPadding + 4, optsUsedY, drawW, drawH);
            optsUsedY += drawH + 4;
          } else {
            doc.text(`${String.fromCharCode(65 + i)}) [image]`, (optsCol === 0 ? marginX : marginX + innerW / 2 + (midLineW / 2)) + colPadding + 4, optsUsedY);
            optsUsedY += optionImgMaxH + 4;
          }
        }

        // if options overflow optsCol, move to next column/page and continue
        if (optsUsedY > safeBottom) {
          if (optsCol === 0) {
            // try right column
            if ((rightY + (optsUsedY - leftY)) <= safeBottom) {
              optsCol = 1;
              optsUsedY = rightY + verticalGap;
            } else {
              doc.addPage();
              drawTopBarOnly();
              optsCol = 0;
              optsUsedY = leftY + verticalGap;
            }
          } else {
            doc.addPage();
            drawTopBarOnly();
            optsCol = 0;
            optsUsedY = leftY + verticalGap;
          }
        }
      }

      // update cursor for optsCol after rendering
      if (optsCol === 0) leftY = optsUsedY; else rightY = optsUsedY;
      // keep main col as the column where the question was placed
      col = preferredCol;
    }

    // done with this question
    qNumber++;
  }

  doc.save("QuestionPaper.pdf");
}
// click handler
  const handleDownload = async () => {
    // await generatePDFWithProgress();
// await generatePDF(test,questions)
    // await generatePDFStandalone(test,questions)
    await generatePDF(test,questions)
  };

  if (!test) return <div>Loading...</div>;

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
      disabled={isGenerating}
    >
      {isGenerating ? "Generating PDF..." : "Download PDF"}
    </button>
  );
}
