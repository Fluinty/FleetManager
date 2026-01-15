"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Car, ShoppingCart, AlertTriangle, Bell, Settings, Banknote, LogOut, User, Sparkles, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { logout } from "@/app/login/actions"
import { useState, useEffect } from "react"

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Pojazdy", href: "/vehicles", icon: Car },
    { name: "Zamówienia", href: "/orders", icon: ShoppingCart },
    { name: "Do weryfikacji", href: "/pending", icon: AlertTriangle },
    { name: "Wydatki", href: "/spending", icon: Banknote },
    { name: "Alerty", href: "/alerts", icon: Bell },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    // Close sidebar when route changes (mobile)
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    // Close sidebar on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false)
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    return (
        <>
            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 z-40 flex md:hidden items-center justify-between h-16 px-4 glass-dark border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="font-bold text-lg text-white">ART-TIM</h1>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                    aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed md:relative z-50 flex h-full w-72 flex-col glass-dark transition-transform duration-300 ease-in-out",
                // Mobile: slide in from left
                "md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                {/* Logo Section - hidden on mobile (shown in header) */}
                <div className="hidden md:flex h-20 items-center px-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center animate-pulse-glow">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-white tracking-tight">ART-TIM</h1>
                            <p className="text-xs text-white/60 font-medium">Fleet Manager</p>
                        </div>
                    </div>
                </div>

                {/* Mobile: Add top padding to account for header */}
                <div className="h-16 md:hidden" />

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navigation.map((item, index) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300",
                                    "animate-fade-in",
                                    isActive
                                        ? "bg-white/25 text-white shadow-lg shadow-purple-500/20"
                                        : "text-white/70 hover:bg-white/15 hover:text-white"
                                )}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <item.icon
                                    className={cn(
                                        "mr-3 h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
                                        isActive ? "text-white" : "text-white/60 group-hover:text-white"
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                                {isActive && (
                                    <div className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer Section */}
                <div className="border-t border-white/10 p-4 space-y-2">
                    <Link
                        href="/settings"
                        className={cn(
                            "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300",
                            pathname === "/settings"
                                ? "bg-white/25 text-white"
                                : "text-white/70 hover:bg-white/15 hover:text-white"
                        )}
                    >
                        <Settings className="mr-3 h-5 w-5 flex-shrink-0 text-white/60 group-hover:text-white transition-transform group-hover:rotate-90" />
                        Ustawienia
                    </Link>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-200 transition-all duration-300 text-left"
                        >
                            <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-white/60 group-hover:text-red-300" />
                            Wyloguj
                        </button>
                    </form>

                    {/* User Info */}
                    <div className="flex items-center px-4 py-3 mt-2 rounded-xl bg-white/10">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">Admin</p>
                            <p className="text-xs text-white/50">administrator</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
