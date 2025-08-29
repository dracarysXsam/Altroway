import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is super admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError || profile?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden: Super admin access required' }, { status: 403 });
    }

    // Fetch comprehensive analytics data
    const [
      profilesData,
      jobsData,
      applicationsData,
      systemLogsData
    ] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('jobs').select('*'),
      supabase.from('job_applications').select('*'),
      supabase.from('system_logs').select('*')
    ]);

    if (profilesData.error) throw profilesData.error;
    if (jobsData.error) throw jobsData.error;
    if (applicationsData.error) throw applicationsData.error;
    if (systemLogsData.error) throw systemLogsData.error;

    const profiles = profilesData.data || [];
    const jobs = jobsData.data || [];
    const applications = applicationsData.data || [];
    const systemLogs = systemLogsData.data || [];

    // Calculate analytics
    const totalUsers = profiles.length;
    const activeUsers = profiles.filter(p => p.is_active).length;
    const newUsersThisMonth = profiles.filter(p => {
      const created = new Date(p.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === 'active').length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(a => a.status === 'pending').length;

    // Calculate conversion rate (applications per active job)
    const conversionRate = activeJobs > 0 ? Math.round((totalApplications / activeJobs) * 100) : 0;

    // Calculate average salary
    const salaryJobs = jobs.filter(j => j.salary_min && j.salary_max);
    const averageSalary = salaryJobs.length > 0 
      ? Math.round(salaryJobs.reduce((sum, j) => sum + ((j.salary_min || 0) + (j.salary_max || 0)) / 2, 0) / salaryJobs.length)
      : 0;

    // Top locations
    const locationCounts = jobs.reduce((acc, job) => {
      acc[job.location] = (acc[job.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topLocations = Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Mock data for charts (in real app, this would come from time-series data)
    const userGrowth = Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i, 1).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 50) + 10
    }));

    const jobViews = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      views: Math.floor(Math.random() * 100) + 20
    }));

    const revenueData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      amount: Math.floor(Math.random() * 10000) + 5000
    }));

    const analytics = {
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      conversionRate,
      averageSalary,
      topLocations,
      userGrowth,
      jobViews,
      revenueData
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error in analytics API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

