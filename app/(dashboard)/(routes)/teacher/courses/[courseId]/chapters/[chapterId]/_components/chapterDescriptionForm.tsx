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
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Chapter } from '@prisma/client';
import Editor from '@/components/editor';
import Preview from '@/components/preview';




type Props = {}

interface ChapterDescriptionFormProps {
    initialData: Chapter;
    courseId: string,
    chapterId: string
}

const formSchema = z.object({
    description: z.string().min(2),
  })
  

export default function ChapterDescriptionForm({initialData, courseId, chapterId}: ChapterDescriptionFormProps) {

    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false)

    const toggleEdit = () => setIsEditing((current) => !current)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        },
      });

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
     try {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
        toast.success("Chapter updated")
        toggleEdit();
        router.refresh();
     } catch (error) {
        toast.error("Something went wrong!")
     }
    }

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
        <div className="font-medium flex items-center justify-between">
            Chapter Description
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing ? (
                    <>Cancel</>
                ): (
                    <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Description
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
            <div className={cn(
                "text-sm mt-2",
                !initialData.description && "text-slate-500 ital;ic"
            )}>
                {!initialData.description && "No descrption"}
                {initialData.description && (
                    <Preview value={initialData.description} />
                )}
            </div>
        )}
        {isEditing && (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8 mt-4'
                >
                    <FormField 
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Course Description
                                </FormLabel>
                                <FormControl>
                                    <Editor
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
                    <div className="flex itesm-center gap-x-2">
                        <Button
                            disabled={!isValid || isSubmitting}
                            type='submit'
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        )}
    </div>
  )
}