"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Car, ShoppingCart, AlertTriangle, Bell, Settings, Banknote, LogOut, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { logout } from "@/app/login/actions"

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

    return (
        <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
            <div className="flex h-16 items-center px-6 font-bold text-xl tracking-wider">
                ART-TIM FLEET
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0",
                                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>
            <div className="border-t border-gray-800 p-4 space-y-2">
                <Link
                    href="/settings"
                    className="group flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                    <Settings className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-white" />
                    Ustawienia
                </Link>
                <form action={logout}>
                    <button
                        type="submit"
                        className="w-full group flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left"
                    >
                        <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-white" />
                        Wyloguj
                    </button>
                </form>
                {/* User Info */}
                <div className="flex items-center px-4 py-2 mt-2 border-t border-gray-800 pt-4">
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-300" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-300">Admin</span>
                </div>
            </div>
        </div>
    )
}
