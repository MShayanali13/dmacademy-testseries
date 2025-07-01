'use client'
import {  Button, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/dashboard/components/container/PageContainer';
import QuestionTypeSelector from '../../components/questionTypeSelector';
import { useState } from 'react';
// components


const SelectTest = () => {

      const [isSubmitted, setIsSubmitted] = useState(false);
const [loading, setLoading] = useState(true);
        const [level, setLevel] = useState<string>('Easy');
        
        const [course, setCourse] = useState<string>('');
        const [subject, setSubject] = useState<string>('');
        const [chapter, setChapter] = useState<string>('');
      
        // Handlers to update the state
        const handleLevelChange = (newLevel: string) => {
          setLevel(newLevel);
        };

        const handleCourseChange = (newCourse: string) => {
          setCourse(newCourse);
        };
      
        const handleSubjectChange = (newSubject: string) => {
          setSubject(newSubject);
        };
      
        const handleChapterChange = (newChapter: string) => {
          setChapter(newChapter);
        };

        const startTest = async() => {
          // await fetch('/api/generateTest', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({
          //     level,
          //     subject,
          //     chapter,
          //   }),
          // })
          //   .then((response) => response.json())
          //   .then((data) => {
             setIsSubmitted(true);
              window.location.href = '/dashboard/student/test?level=' + level + '&subject=' + subject + '&chapter=' + chapter+"&course="+course;
            // })
            // .catch((error) => {
            //   console.error('Error generating test:', error);        
            // });
        }

  return (
    <PageContainer title="Select a new Test" description="this is select test page">
      
        <QuestionTypeSelector
          onChapterChange={handleChapterChange}
          onSubjectChange={handleSubjectChange}
          title="Select Your Test"
          onLevelChange={handleLevelChange}
          
          onCourseChange={handleCourseChange}
  isSubmitted={isSubmitted}     />
     
     <Button
        variant="contained"
        color="primary"
        onClick={
          startTest
        }
        // href='/dashboard/student/test'
        sx={{ marginTop: '20px' }}
        disabled={!level || !subject || !chapter}
      >
        Start Test
      </Button>
      <Typography variant="h6" sx={{ marginTop: '20px' }}>
        Test Instructions:
      </Typography>
      <Typography variant="body1">
        1. Read each question carefully.
      </Typography>
      <Typography variant="body1">
        2. Choose the best answer from the options provided.
      </Typography>
      <Typography variant="body1">
        3. You can skip questions and come back to them later.
      </Typography>
    </PageContainer>
  )
}

export default SelectTest;
