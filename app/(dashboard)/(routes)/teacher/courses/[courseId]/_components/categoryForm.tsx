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
import { Course } from '@prisma/client';
import { ComboBox } from '@/components/ui/combobox';




type Props = {}

interface CategoryFormProps {
    initialData: Course;
    courseId: string;
    options: {label: string; value: string}[]
}

const formSchema = z.object({
    categoryId: z.string().min(1),
  })
  

export default function CategoryForm({initialData, courseId, options}: CategoryFormProps) {

    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false)

    const toggleEdit = () => setIsEditing((current) => !current)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ""
        },
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

    const selectedOption = options.find((option) => option.value === initialData.categoryId)

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
        <div className="font-medium flex items-center justify-between">
            Course Category
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing ? (
                    <>Cancel</>
                ): (
                    <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Category
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
            <p className={cn(
                "text-sm mt-2",
                !initialData.categoryId && "text-slate-500 ital;ic"
            )}>
                {selectedOption?.label || "No category"}
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
                        name='categoryId'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ComboBox 
                                        options={options}
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