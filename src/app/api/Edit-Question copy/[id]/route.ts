import { connectDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import QuestionBankSchema from "@/model/QuestionBankSchema";

import { unstable_noStore as noStore } from 'next/cache';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    noStore();
    await connectDB();

    const body = await req.json();
    const { questionType, optionType, question, options, answer, level,course,chapter,subject,hintType,hint } = body;

    // Find the existing question by ID
    const existingQuestion = await QuestionBankSchema.findById(params.id);
    if (!existingQuestion) {
      throw new Error("Question not found");
    }

    // Prepare the data
    let questionData: { text: string | null; imgUrl: string | null } = { text: null, imgUrl: null };
    let optionsData: { text: string | null; imgUrl: string | null }[] = [
      { text: null, imgUrl: null },
        { text: null, imgUrl: null },
        { text: null, imgUrl: null },
        { text: null, imgUrl: null },
    ]

 let hintData: { text: string | null; imgUrl: string | null } = { text: null, imgUrl: null };
   
    if(existingQuestion.questionType == "image"&&existingQuestion.question.imgUrl){
        await cloudinary.uploader.destroy(existingQuestion.question.imgUrl.split('/').pop().split('.')[0]);
    }
     if(existingQuestion.hintData == "image"&&existingQuestion.hint.imgUrl){
        await cloudinary.uploader.destroy(existingQuestion.hint.imgUrl.split('/').pop().split('.')[0]);
    }
    if(existingQuestion.optionType == "image"&&existingQuestion.options[0].imgUrl){
        await cloudinary.uploader.destroy(existingQuestion.options[0].imgUrl.split('/').pop().split('.')[0]);
        await cloudinary.uploader.destroy(existingQuestion.options[1].imgUrl.split('/').pop().split('.')[0]);
        await cloudinary.uploader.destroy(existingQuestion.options[2].imgUrl.split('/').pop().split('.')[0]);
        await cloudinary.uploader.destroy(existingQuestion.options[3].imgUrl.split('/').pop().split('.')[0]);
    }

    // Handle the question image upload if necessary
    if (questionType === 'image') {
      const uploadRes = await cloudinary.uploader.upload(question.imgUrl, {
        folder: 'test-series/questions',
        resource_type: 'image',
      });
      questionData.imgUrl = uploadRes.secure_url;
  questionData.text = null;
    } else {
      questionData.text = question.text;
        questionData.imgUrl = null;
    }

    // Handle the question image upload if necessary
    if (hintType === 'image') {
      const uploadRes = await cloudinary.uploader.upload(hint.imgUrl, {
        folder: 'test-series/hint',
        resource_type: 'image',
      });
      hintData.imgUrl = uploadRes.secure_url;
  hintData.text = null;
    } else {
      hintData.text = hint.text;
        hintData.imgUrl = null;
    }

    // Handle the options image upload if necessary
    await Promise.all(
    options.map(async (opt: { text: string | null; imgUrl: string | null },index:number) => {
        if (optionType === 'image'&&opt.imgUrl) {
       
            const uploadRes = await cloudinary.uploader.upload(opt.imgUrl, {
              folder: 'test-series/options',
              resource_type: 'image',
            });
            optionsData[index].imgUrl = uploadRes.secure_url;
            
        optionsData[index].text=  null;
          
        }else{
        optionsData[index].text=  opt.text;
        
        optionsData[index].imgUrl = null;
        }
      })
    );


   let updatedQuestion = {
    questionType: questionType,
    optionType: optionType,
    question: questionData,
    options: optionsData,
    answer: answer,
    level: level,
    course: course,
    subject: subject,
    chapter: chapter,
    uploadedBy: existingQuestion.uploadedBy,
    hintType,
    hint:hintData,
    };


    await QuestionBankSchema.findByIdAndUpdate(params.id, updatedQuestion);

    return NextResponse.json({ message: 'Question updated successfully', updatedQuestion, ok:true }, { status: 200 });
  } catch (err: any) {
    console.error('Error updating question:', err);
    return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
  }
}
