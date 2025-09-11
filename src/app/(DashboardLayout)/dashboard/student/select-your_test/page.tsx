'use client'
import { Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/dashboard/components/container/PageContainer';
import TestTypeSelector from '../../components/TestTypeSelector';
import { useRouter } from 'next/navigation';

const SelectTest = () => {
  const router = useRouter();

  const handleTestStart = (testType: string, course: string, subject?: string, chapter?: string) => {
    // For mock test, we don't need subject and chapter
    // For subject test, we don't need chapter
    // For chapter test, we need all three
    
    let queryParams = `?testType=${testType}&course=${course}`;
    
    if (subject) {
      queryParams += `&subject=${subject}`;
    }
    
    if (chapter) {
      queryParams += `&chapter=${chapter}`;
    }

    // Redirect to test page with the selected parameters
    router.push(`/dashboard/student/test${queryParams}`);
  };

  return (
    <PageContainer title="Select a Test" description="Choose your test type and start practicing">
      <TestTypeSelector onTestStart={handleTestStart} />
      
      <Typography variant="h6" sx={{ marginTop: '40px', textAlign: 'center' }}>
        Test Instructions:
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
        1. Select your test type (Mock Test, Subject Test, or Chapter Wise Test)
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
        2. Choose your course and other required fields
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
        3. Click Search to see available tests
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
        4. Click &quot;Start Test&quot; to begin your practice session
      </Typography>
    </PageContainer>
  );
};

export default SelectTest;
