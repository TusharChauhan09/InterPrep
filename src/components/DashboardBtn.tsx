'use client'

import Link from 'next/link';
import { Button } from "./ui/button";
import { LayoutDashboard } from 'lucide-react';
import { useUserRole } from "../hooks/useuserRole";

const DashboardBtn = () => {
  const { isCandidate , isInterviewer , isLoading } =  useUserRole();

  if(isCandidate || isLoading) return null

  return (
    <Link href={'/dashboard'}>
      <Button className="font-medium border-1">
        <LayoutDashboard className="" />
        Dashboard
      </Button>
    </Link>
  )
}

export default DashboardBtn;
