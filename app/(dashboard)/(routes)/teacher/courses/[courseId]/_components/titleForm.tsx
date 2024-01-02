"use client"

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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




type Props = {}

interface TitleFormProps {
    initialData: {
        title: string
    };
    courseId: string
}

const formSchema = z.object({
    title: z.string().min(2, {
      message: "Title is required",
    }),
  })
  

export default function TitleForm({initialData, courseId}: TitleFormProps) {

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
            Course title
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing ? (
                    <>Cancel</>
                ): (
                    <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Title
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
            <p className="text-sm mt-2">
                {initialData.title}
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
                        name='title'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Course Title
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isSubmitting}
                                        placeholder="e.g. `Advanced Web Development`"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    What will you teach in this course
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