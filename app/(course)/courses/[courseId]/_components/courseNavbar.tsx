import { Chapter, Course, UserProgress } from "@prisma/client"

import NavbarRoutes from '@/components/navbarRoutes'
import React from 'react'
import CourseMobileSidebar from './courseMobileSidebar'


type Props = {}

interface CourseNavbarProps {
    course: Course & {
      chapters: (Chapter & {
        userProgress: UserProgress[] | null;
      })[];
    };
    progressCount: number;
};

export default function CourseNavbar({course, progressCount}: CourseNavbarProps) {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
        <CourseMobileSidebar
        course={course}
        progressCount={progressCount}
        />
        <NavbarRoutes />      
    </div>
  )
}