'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, ChevronDown, Menu, Lock, Users, FileText, Activity, ArrowRight, X } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "./components/ui/sheet"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Button } from './components/ui/button'
import Link from 'next/link'
import { FaGithub, FaTwitter } from "react-icons/fa";


export default function LandingPage() {
    const [theme, setTheme] = useState('light')
    const [activeFeature, setActiveFeature] = useState(0)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const savedTheme = localStorage.getItem('theme') || 'light'
        setTheme(savedTheme)
        document.documentElement.classList.toggle('dark', savedTheme === 'dark')

        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 3)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.documentElement.classList.toggle('dark')
    }

    if (!isMounted) return null

    const navItems = [
        {
            label: 'Features',
            items: ['Trial Matching', 'Computation', 'Access Levels']
        },
        {
            label: 'Solutions',
            items: ['For Patients', 'For Researchers', 'For Hospitals']
        },
        {
            label: 'Security',
            items: ['Data Protection', 'Access Control', 'Compliance']
        },
        {
            label: 'Developers',
            items: ['Documentation', 'API Reference', 'SDKs']
        },
        {
            label: 'About',
            items: ['Company', 'Support', 'Contact']
        }
    ]

    const features = [
        {
            title: 'Secure Trial Matching',
            description: 'Match patients with clinical trials while maintaining complete data privacy',
            icon: <Lock className="w-6 h-6" />,
            details: ['Age-based eligibility verification', 'Symptom pattern matching', 'Treatment duration assessment']
        },
        {
            title: 'Multi-Party Computation',
            description: 'Process sensitive medical data with zero knowledge exposure',
            icon: <Users className="w-6 h-6" />,
            details: ['Patient data remains encrypted', 'Researchers get aggregated insights', 'Hospitals maintain oversight']
        },
        {
            title: 'Privacy-Preserving Access',
            description: 'Role-specific access to medical research data',
            icon: <FileText className="w-6 h-6" />,
            details: ['Patient eligibility scores', 'Researcher analytics', 'Hospital monitoring']
        }
    ]

    const FloatingCircle = ({ className }: { className?: string }) => (
        <motion.div
            className={`absolute rounded-full ${className}`}
            animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
            }}
            transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
            }}
        />
    )

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <FloatingCircle className="w-64 h-64 bg-blue-200/20 dark:bg-blue-900/20 left-[-5%] top-[20%]" />
                <FloatingCircle className="w-96 h-96 bg-purple-200/20 dark:bg-purple-900/20 right-[-10%] top-[10%]" />
                <FloatingCircle className="w-72 h-72 bg-emerald-200/20 dark:bg-emerald-900/20 left-[40%] bottom-[-10%]" />
            </div>

            {/* Hero Section */}
            <main className="relative">
                <div className="container mx-auto px-4 py-24 md:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center space-y-8"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                            Medical Research is Now Secure
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                            A privacy-preserving platform for medical trial matching, powered by secure computation technology.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href='/doctor'>
                                <Button size="lg" className="min-w-[200px]">
                                    Join as Doctor
                                </Button>
                            </Link>
                            <Link href='/research'>
                                <Button size="lg" variant="outline" className="min-w-[200px]">
                                    Start Research
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Features Section */}
                <div className="container mx-auto px-4 py-16">
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                <Card className="h-full">
                                    <CardHeader>
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                            {feature.icon}
                                        </div>
                                        <CardTitle>{feature.title}</CardTitle>
                                        <CardDescription>{feature.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {feature.details.map((detail) => (
                                                <li key={detail} className="flex items-center gap-2">
                                                    <ArrowRight className="w-4 h-4 text-primary" />
                                                    <span>{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* User Types Section */}
                <div className="container mx-auto px-4 py-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Who It's For</h2>
                    <Tabs defaultValue="patients" className="max-w-3xl mx-auto">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="patients">Patients</TabsTrigger>
                            <TabsTrigger value="researchers">Researchers</TabsTrigger>
                            <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
                        </TabsList>
                        <TabsContent value="patients">
                            <Card>
                                <CardHeader>
                                    <CardTitle>For Patients</CardTitle>
                                    <CardDescription>
                                        Securely participate in medical trials while maintaining your privacy
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p>• Input medical history securely</p>
                                    <p>• View trial eligibility instantly</p>
                                    <p>• Monitor treatment effectiveness</p>
                                    <p>• Control your data access permissions</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="researchers">
                            <Card>
                                <CardHeader>
                                    <CardTitle>For Researchers</CardTitle>
                                    <CardDescription>
                                        Access aggregated research data without compromising patient privacy
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p>• Define trial criteria</p>
                                    <p>• Access aggregated results</p>
                                    <p>• Analyze treatment efficacy</p>
                                    <p>• Maintain HIPAA compliance</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="hospitals">
                            <Card>
                                <CardHeader>
                                    <CardTitle>For Hospitals</CardTitle>
                                    <CardDescription>
                                        Oversee trials and maintain compliance with complete audit trails
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p>• Monitor trial safety</p>
                                    <p>• Track patient outcomes</p>
                                    <p>• Ensure regulatory compliance</p>
                                    <p>• Maintain data sovereignty</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* CTA Section */}
                <div className="container mx-auto px-4 py-16">
                    <Card className="bg-primary text-primary-foreground">
                        <CardContent className="flex flex-col items-center text-center p-12 space-y-6">
                            <Activity className="w-12 h-12" />
                            <h2 className="text-3xl font-bold">Ready to Transform Medical Research?</h2>
                            <p className="text-lg max-w-2xl">
                                Join the future of privacy-preserving medical research. Start matching trials securely today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href='/research'>
                                    <Button size="lg" variant="destructive">
                                        Join as Researcher
                                    </Button>
                                </Link>
                                <Link href='/patient'>
                                    <Button size="lg" variant="secondary">
                                        Check Appointment
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t bg-background/80 backdrop-blur-md py-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-muted-foreground">
                        Built with secure computation technology by Abhishek.
                    </p>
                    <div className="flex justify-center space-x-4 mt-4">
                        <Button variant="ghost" size="sm">
                            <FaTwitter />
                        </Button>
                        <Button variant="ghost" size="sm">
                            <FaGithub />
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    )
}