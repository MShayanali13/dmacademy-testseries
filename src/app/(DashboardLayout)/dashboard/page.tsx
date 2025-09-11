"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import PageContainer from '@/app/(DashboardLayout)/dashboard/components/container/PageContainer';
import { Box } from '@mui/material';
import Loading from './loading';
import PricingSection from '@/app/(Landing)/components/PricingSection';

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return; // Wait until Clerk is ready

    if (!isSignedIn) {
      router.push("/"); // Redirect on client
      return;
    }

    // Fetch role from backend
    async function fetchUserData() {
      try {
        const res = await fetch("/api/Get-Current-User");
        const data = await res.json();
        if (res.ok && data.user?.role && data.user?.isSubscribed) {
          setRole(data.user.role);
          setIsSubscribed(data.user.isSubscribed)
          console.log(isSubscribed)
        }
      } catch (error) {
        console.error("Failed to fetch role:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return <Loading />;
  }

  return (
    <PageContainer title="Dashboard" description="This is Dashboard">
      <div className="p-8 text-xl">
        Welcome, <strong>{user?.username}</strong> <br />
        {
isSubscribed==true?(        
        <span className="text-gray-500">Role: {role}</span>
):(
  // <h2>Subscrition Needed</h2>
<PricingSection />
)
}
      </div>
    </PageContainer>
  );
};

export default Dashboard;
