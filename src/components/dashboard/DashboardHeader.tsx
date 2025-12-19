import { MobileSidebar } from "@/components/dashboard/Sidebar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardHeader() {
    return (
        <div className="flex items-center p-4 border-b border-border h-16 bg-background">
            <MobileSidebar />
            <div className="flex w-full justify-end items-center gap-x-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
                </Button>
                <div className="flex items-center gap-x-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium">Jan Kowalski</p>
                        <p className="text-xs text-muted-foreground">Art-Tim</p>
                    </div>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JK</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    );
}
