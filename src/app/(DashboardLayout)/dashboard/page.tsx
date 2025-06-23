'use client'
import { Grid, Box, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/dashboard/components/container/PageContainer';
// components
// import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/SalesOverview';
// import YearlyBreakup from '@/app/(DashboardLayout)/components/dashboard/YearlyBreakup';
// import RecentTransactions from '@/app/(DashboardLayout)/components/dashboard/RecentTransactions';
// import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance';
// import Blog from '@/app/(DashboardLayout)/components/dashboard/Blog';
// import MonthlyEarnings from '@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings';
 
        // app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { useUser } from '@clerk/nextjs';

const Dashboard = async() => { 
   const { user } = useUser();
  if (!user) redirect("/");
console.log(useUser().user)
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
     
  <div className="p-8">Welcome to your dashboard, user: {user?user.username : "Unknown"} </div>


      {/* <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
          <Grid item xs={12}>
            <Blog />
          </Grid>
        </Grid>
      </Box> */}
    </PageContainer>
  )
}

export default Dashboard;
