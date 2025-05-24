"use client"

import { Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import theme from '@/utils/theme';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import {  Card, CardContent,  Table, TableBody, TableCell, TableHead, TableRow, useTheme } from '@mui/material';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, } from 'recharts';
import PageContainer from '../../components/container/PageContainer';

const subjectPerformance = [
  { subject: 'Math', score: 82 },
  { subject: 'Physics', score: 74 },
  { subject: 'Chemistry', score: 66 },
  { subject: 'Biology', score: 91 },
  { subject: 'English', score: 87 }
];

const recentTests = [
  { name: 'NEET Mock 1', date: '2025-04-01', score: 88, attempted: 90, correct: 79, status: 'Passed' },
  { name: 'CET Sample', date: '2025-03-28', score: 72, attempted: 85, correct: 65, status: 'Passed' },
  { name: 'JEE Practice', date: '2025-03-24', score: 54, attempted: 80, correct: 43, status: 'Failed' }
];
const stats = [
  { label: 'Tests Taken', value: 12 },
  { label: 'Avg. Percentage', value: '72%' },
  { label: 'Highest Score', value: '94%' },
  { label: 'Weakest Subject', value: 'Chemistry' },
];

const performanceData = [
  { name: 'Test 1', percentage: 68 },
  { name: 'Test 2', percentage: 72 },
  { name: 'Test 3', percentage: 80 },
  { name: 'Test 4', percentage: 56 },
  { name: 'Test 5', percentage: 90 },
  
];

const topPerformers = [
  { name: 'Anjali Rao', test: 'NEET Mock 1', score: 98 },
  { name: 'Rahul Das', test: 'CET Sample', score: 95 },
  { name: 'Priya Nair', test: 'JEE Practice', score: 92 }
];

const AllResult = () => {
      const theme = useTheme();

  return (
   
    <PageContainer  title="All Test Result/Record" description="this is All Test Result/Record page">
      <Typography variant="h4" gutterBottom>
        Performance Overview
      </Typography>

      <Grid container spacing={2} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
              <Typography variant="h6">{stat.label}</Typography>
              <Typography variant="h5" color="primary">
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
  <Grid item xs={12} mb={4}>
          <Typography variant="h6" gutterBottom>Recent Test Performance</Typography>
          <Card>
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Test</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Attempted</TableCell>
                    <TableCell>Correct</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTests.map((test, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{test.name}</TableCell>
                      <TableCell>{test.date}</TableCell>
                      <TableCell>{test.attempted}</TableCell>
                      <TableCell>{test.correct}</TableCell>
                      <TableCell>{test.score}%</TableCell>
                      <TableCell>{test.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      <Typography variant="h5" gutterBottom>
        Test-wise Performance
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="percentage" fill={theme.palette.primary.main} />
        </BarChart>
      </ResponsiveContainer>
    
   
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Subject-wise Performance</Typography>
          <Card>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart outerRadius={70} data={subjectPerformance}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Score" dataKey="score" stroke={theme.palette.primary.main} fill={theme.palette.primary.main} fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

       <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Top Performers</Typography>
          <Card>
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Test</TableCell>
                    <TableCell>Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topPerformers.map((student, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.test}</TableCell>
                      <TableCell>{student.score}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
   
        
      </Grid>
    </PageContainer>
  );
};

export default AllResult;
