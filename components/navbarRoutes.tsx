"use client"

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { isTeacher } from "@/lib/teacher";
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import SearchInput from './searchInput'

type Props = {}

export default function NavbarRoutes({}: Props) {
  const pathname = usePathname();
  const { userId } = useAuth();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith("/teacher")
  const isCoursePage = pathname?.includes("/courses")
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher mode
            </Button>
          </Link>
        ) : null}
        <UserButton
          afterSignOutUrl="/"
        />
      </div>
    </>
  )
}