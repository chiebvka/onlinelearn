
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




type Props = {}

interface ImageFormProps {
    initialData: {
        description: string
    };
    courseId: string
}

const formSchema = z.object({
    description: z.string().min(2, {
      message: "Description is required",
    }),
  })
  

export default function ImageForm({initialData, courseId}: ImageFormProps) {

    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false)

    const toggleEdit = () => setIsEditing((current) => !current)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
      });

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
     try {
        await axios.patch(`/api/courses/${courseId}`, values)
        toast.success("Course title updated")
        toggleEdit();
        router.refresh();
     } catch (error) {
        toast.error("Somethign went wrong!")
     }
    }

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
        <div className="font-medium flex items-center justify-between">
            Course Description
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
            <p className={cn(
                "text-sm mt-2",
                !initialData.description && "text-slate-500 ital;ic"
            )}>
                {initialData.description || "No descrption"}
            </p>
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
                                    <Textarea 
                                        disabled={isSubmitting}
                                        placeholder="e.g. `This course is about learning to work in an organizational...`"
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