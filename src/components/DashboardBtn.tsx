'use client'

import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

const DashboardBtn = () => {
  const { isCandidate, isInterviewer, isLoading } = useUserRole();

  if (isCandidate || isLoading) return null;

  return (
    <Link href={'/dashboard'}>
      <button
        className="h-9 px-4 text-xs font-bold uppercase tracking-[0.1em] border border-border bg-background hover:bg-foreground hover:text-background transition-all flex items-center gap-2 cursor-pointer"
        style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
      >
        <LayoutDashboard className="size-3.5" />
        <span className="hidden md:block">Dashboard</span>
      </button>
    </Link>
  );
};

export default DashboardBtn;
