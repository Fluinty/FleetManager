import { KPICard } from "@/components/dashboard/KPICard";
import { Car, AlertTriangle, FileCheck, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Wszystkie Pojazdy"
                    value="12"
                    description="+2 w tym miesiącu"
                    icon={Car}
                />
                <KPICard
                    title="Pilne Alerty"
                    value="3"
                    description="Wymagają uwagi < 7 dni"
                    icon={AlertTriangle}
                />
                <KPICard
                    title="Kończące się Polisy"
                    value="1"
                    description="Wygasa za 5 dni"
                    icon={FileCheck}
                />
                <KPICard
                    title="Planowane Przeglądy"
                    value="2"
                    description="W najbliższych 30 dniach"
                    icon={Wrench}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Ostatnie Alerty</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Mock Alert Items */}
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Toyota Corolla (WA 12345)</p>
                                    <p className="text-sm text-muted-foreground">Kończy się ubezpieczenie OC</p>
                                </div>
                                <div className="ml-auto font-medium text-red-500">za 5 dni</div>
                            </div>
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Ford Transit (WA 54321)</p>
                                    <p className="text-sm text-muted-foreground">Przegląd techniczny</p>
                                </div>
                                <div className="ml-auto font-medium text-amber-500">za 14 dni</div>
                            </div>
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Skoda Octavia (WA 99887)</p>
                                    <p className="text-sm text-muted-foreground">Wymiana oleju</p>
                                </div>
                                <div className="ml-auto font-medium text-amber-500">za 20 dni</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Status Floty</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Aktywne</span>
                                <span className="text-sm text-muted-foreground">10</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">W serwisie</span>
                                <span className="text-sm text-muted-foreground">1</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Nieużywane</span>
                                <span className="text-sm text-muted-foreground">1</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
