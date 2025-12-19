"use client";

import { useEffect, useState } from "react";
import { mockVehicles } from "@/lib/mock-data";
import { generateAlertsFromVehicles, getAlertColor, getAlertLabel } from "@/lib/alerts";
import { Alert } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertTriangle, FileText, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        // Simulate fetching alerts
        const generatedAlerts = generateAlertsFromVehicles(mockVehicles);
        setAlerts(generatedAlerts);
    }, []);

    const getIcon = (type: Alert['type']) => {
        switch (type) {
            case 'insurance': return FileText;
            case 'inspection': return Ban; // Or wrench
            case 'leasing': return FileText;
            default: return AlertTriangle;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Centrum Powiadomień</h2>
                    <p className="text-muted-foreground">Monitoruj zbliżające się terminy i zagrożenia.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Oznacz wszystkie jako przeczytane</Button>
                </div>
            </div>

            <div className="grid gap-4">
                {alerts.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <CheckCircle className="h-12 w-12 mb-4 text-emerald-500" />
                            <p className="text-lg font-medium">Wszystko w porządku!</p>
                            <p>Brak aktywnych alertów dla Twojej floty.</p>
                        </CardContent>
                    </Card>
                ) : (
                    alerts.map((alert) => {
                        const Icon = getIcon(alert.type);
                        // Map status to simple severity for color helper if needed, or extend helper
                        const severity = alert.daysRemaining < 0 ? 'expired' : (alert.daysRemaining <= 7 ? 'critical' : 'warning');

                        return (
                            <Card key={alert.id} className="border-l-4 border-l-transparent overflow-hidden hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${severity === 'expired' ? 'bg-slate-500' :
                                        severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'
                                    }`} />
                                <CardContent className="flex items-center p-6">
                                    <div className={`p-3 rounded-full mr-4 ${severity === 'expired' ? 'bg-slate-100 text-slate-600' :
                                            severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                        }`}>
                                        <Icon className="h-6 w-6" />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold">{alert.message}</h4>
                                            <Badge variant="outline" className={getAlertColor(severity)}>
                                                {getAlertLabel(severity)}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Termin upływa za: <span className="font-bold">{alert.daysRemaining} dni</span>
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button size="sm" variant="secondary">Szczegóły</Button>
                                        <Button size="sm" variant="outline">Ignoruj</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
