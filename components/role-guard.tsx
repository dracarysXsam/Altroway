"use client";

import { useEffect, useState } from "react";
import { getUserRole } from "@/app/actions/auth-actions";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const { role } = await getUserRole();
        setUserRole(role);
      } catch (error) {
        console.error("Error checking user role:", error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return fallback || null;
  }

  return <>{children}</>;
}

interface RoleBasedContentProps {
  jobSeeker?: React.ReactNode;
  employer?: React.ReactNode;
  legalAdvisor?: React.ReactNode;
  superAdmin?: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleBasedContent({ 
  jobSeeker, 
  employer, 
  legalAdvisor, 
  superAdmin, 
  fallback 
}: RoleBasedContentProps) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const { role } = await getUserRole();
        setUserRole(role);
      } catch (error) {
        console.error("Error checking user role:", error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!userRole) {
    return fallback || null;
  }

  switch (userRole) {
    case "job_seeker":
      return jobSeeker || fallback || null;
    case "employer":
      return employer || fallback || null;
    case "legal_advisor":
      return legalAdvisor || fallback || null;
    case "super_admin":
      return superAdmin || fallback || null;
    default:
      return fallback || null;
  }
}
