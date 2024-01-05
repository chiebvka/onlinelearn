"use client"

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Pencil, PlusCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Chapter, Course } from '@prisma/client';
import { Input } from '@/components/ui/input';
import ChaptersList from './chaptersList';




type Props = {}

interface ChaptersFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string
}

const formSchema = z.object({
    title: z.string().min(1),
  })
  

export default function ChaptersForm({initialData, courseId}: ChaptersFormProps) {

    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const toggleCreate = () => setIsCreating((current) => !current)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        },
      });

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
     try {
        await axios.post(`/api/courses/${courseId}/chapters`, values)
        toast.success("Chapter Created")
        toggleCreate();
        router.refresh();
     } catch (error) {
        toast.error("Somethign went wrong!")
     }
    }

    const onReorder = async (updateData: { id: string; position: number}[]) => {
        try {
            setIsUpdating(true);

            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            })
            toast.success("Chapter Reordered Successfully")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsUpdating(false)
        }
    }
    
    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`)
    }
    
    

  return (
    <div className='relative mt-6 border bg-slate-100 rounded-md p-4'>
        {isUpdating && (
            <div className='absolute w-full h-full bg-slate-500/20 top-0 right-0 rounded-md  flex items-center justify-center'>
                <Loader2 className='animate-spin h-6 w-6 text-sky-700 ' />
            </div>
        )}
        <div className="font-medium flex items-center justify-between">
            Course Chapters
            <Button onClick={toggleCreate} variant="ghost">
                {isCreating ? (
                    <>Cancel</>
                ): (
                    <>
                        <PlusCircle className='h-4 w-4 mr-2' />
                        Add a Chapter
                    </>
                )}
            </Button>
        </div>
        {isCreating && (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8 mt-4'
                >
                    <FormField 
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Course Description
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isSubmitting}
                                        placeholder="e.g. `Introduction to the course`"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Describe what the course is meant to teach
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                        <Button
                            disabled={!isValid || isSubmitting}
                            type='submit'
                        >
                            Create
                        </Button>
                </form>
            </Form>
        )}
        {!isCreating && (
            <div className={cn(
                "text-sm mt-2",
                !initialData.chapters.length &&  "text-slate-500 italic"
                )}>
                {!initialData.chapters.length && "No Chapters"}
                <ChaptersList
                    onEdit ={onEdit}
                    onReorder ={onReorder}
                    items={initialData.chapters || []}
                 />
            </div>
        )}
        {!isCreating && (
            <p className='text-xs text-muted-foreground mt-4'>
                Drag and drop to reorder the chapters
            </p>
        )}
    </div>
  )
}