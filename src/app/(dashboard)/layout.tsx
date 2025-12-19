import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-slate-900">
                <Sidebar />
            </div>
            <main className="md:pl-72 h-full">
                <DashboardHeader />
                <div className="p-8 h-full bg-slate-50 dark:bg-slate-950/50">
                    {children}
                </div>
            </main>
        </div>
    );
}
