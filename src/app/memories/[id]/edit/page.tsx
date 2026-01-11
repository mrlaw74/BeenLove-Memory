"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memorySchema, type MemoryFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Save, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function EditMemoryPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [preview, setPreview] = useState<string | null>(null);

    const form = useForm<MemoryFormValues>({
        resolver: zodResolver(memorySchema),
    });

    useEffect(() => {
        async function fetchMemory() {
            try {
                const response = await fetch(`/api/memories/${id}`);
                if (!response.ok) throw new Error("Failed to fetch");
                const data = await response.json();

                form.reset({
                    title: data.title,
                    description: data.description || "",
                    date: new Date(data.date),
                });
                if (data.imageUrl) setPreview(data.imageUrl);
            } catch (error) {
                toast.error("Could not load memory");
                router.push("/memories");
            } finally {
                setIsLoading(false);
            }
        }
        fetchMemory();
    }, [id, form, router]);

    async function onSubmit(data: MemoryFormValues) {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description || "");
            formData.append("date", data.date.toISOString());

            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput?.files?.[0]) {
                formData.append("image", fileInput.files[0]);
            }

            const response = await fetch(`/api/memories/${id}`, {
                method: "PATCH",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to save");

            toast.success("Memory updated!");
            router.push("/memories");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function onDelete() {
        if (!confirm("Are you sure you want to delete this memory?")) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/memories/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete");

            toast.success("Memory deleted");
            router.replace("/memories");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete memory");
        } finally {
            setIsDeleting(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-lg border-none shadow-2xl bg-white/80 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-heading font-bold text-pink-600">Edit Memory</CardTitle>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={onDelete} disabled={isDeleting}>
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="First date, anniversary..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="What happened?" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormItem>
                                    <FormLabel>Photo (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => setPreview(reader.result as string);
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            </div>

                            {preview && (
                                <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-pink-100">
                                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => router.push("/memories")}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white min-w-[140px]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
