"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import PageContainer from '@/app/(DashboardLayout)/dashboard/components/container/PageContainer';
import { Box } from '@mui/material';
import Loading from './loading';

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return; // Wait until Clerk is ready

    if (!isSignedIn) {
      router.push("/"); // Redirect on client
      return;
    }

    // Fetch role from backend
    async function fetchRole() {
      try {
        const res = await fetch("/api/Get-Current-User");
        const data = await res.json();
        if (res.ok && data.user?.role) {
          setRole(data.user.role);
        }
      } catch (error) {
        console.error("Failed to fetch role:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return <Loading />;
  }

  return (
    <PageContainer title="Dashboard" description="This is Dashboard">
      <div className="p-8">
        Welcome to your dashboard, <strong>{user?.username}</strong> <br />
        <span className="text-gray-500">Role: {role}</span>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
