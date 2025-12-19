"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Car,
    Bell,
    FileText,
    Settings,
    LogOut,
    Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Pojazdy",
        icon: Car,
        href: "/vehicles",
        color: "text-violet-500",
    },
    {
        label: "Alerty",
        icon: Bell,
        href: "/alerts",
        color: "text-pink-700",
    },
    {
        label: "Raporty",
        icon: FileText,
        href: "/reports",
        color: "text-orange-700",
    },
    {
        label: "Ustawienia",
        icon: Settings,
        href: "/settings",
        color: "text-gray-500",
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <Car className="w-8 h-8 text-sidebar-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">FlotaAlert</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition",
                                pathname === route.href ? "text-sidebar-foreground bg-sidebar-accent" : "text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
                    <LogOut className="h-5 w-5 mr-3" />
                    Wyloguj
                </Button>
            </div>
        </div>
    );
}

export function MobileSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-sidebar text-sidebar-foreground border-sidebar-border">
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
}
