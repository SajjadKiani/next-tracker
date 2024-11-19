"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { useRouter } from "next/navigation"
import Link from "next/link"

const formSchema = z.object({
  username: z.string().min(5).max(100),
  password: z.string().min(6).max(12)
})


export default function Page () {
    const [open, setOpen] = useState(true)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(formSchema)
    })

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/login', {method: "POST", body: JSON.stringify(data)})
            const result = await response.json()
            router.push('/')
            setOpen(false)
        } catch (e) {

        } finally { 
            setLoading(false)
        }
    }

    const onClose = () => {
        router.back()
        setOpen(false)
    }
    
    return (
        <Drawer open={open} onOpenChange={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Login</DrawerTitle>
                </DrawerHeader>
                    <div className="flex justify-center items-center px-6 pb-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="user name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <p className="text-xs font-light text-gray-500">
                                    have'nt account? <Link href='/auth/register' className="font-bold">sign up</Link>
                                </p>
                                <Button className='w-full' type="submit">Submit</Button>
                            </form>
                        </Form>
                    </div>
            </DrawerContent>
        </Drawer>
    )
}