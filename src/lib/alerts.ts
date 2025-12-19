import { differenceInDays, parseISO } from "date-fns";
import { Vehicle, Alert } from "@/types";

export type AlertSeverity = "critical" | "warning" | "good" | "expired";

export function getDaysRemaining(expiryDate: string): number {
    const today = new Date();
    const target = parseISO(expiryDate);
    return differenceInDays(target, today);
}

export function getAlertSeverity(days: number): AlertSeverity {
    if (days < 0) return "expired";
    if (days <= 7) return "critical";
    if (days <= 30) return "warning";
    return "good";
}

export function getAlertColor(severity: AlertSeverity): string {
    switch (severity) {
        case "expired":
            return "text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400";
        case "critical":
            return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
        case "warning":
            return "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400";
        case "good":
            return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400";
        default:
            return "text-slate-600 bg-slate-100";
    }
}

export function getAlertLabel(severity: AlertSeverity): string {
    switch (severity) {
        case "expired":
            return "Po terminie";
        case "critical":
            return "Pilne (< 7 dni)";
        case "warning":
            return "Ostrzeżenie (< 30 dni)";
        case "good":
            return "OK";
        default:
            return "Nieznany";
    }
}

export function generateAlertsFromVehicles(vehicles: Vehicle[]): Alert[] {
    const alerts: Alert[] = [];

    vehicles.forEach((vehicle) => {
        // Check Insurance
        const insuranceDays = getDaysRemaining(vehicle.insuranceExpiryDate);
        const insuranceSeverity = getAlertSeverity(insuranceDays);

        if (insuranceSeverity !== "good") {
            alerts.push({
                id: `alert-ins-${vehicle.id}`,
                vehicleId: vehicle.id,
                type: "insurance",
                status: insuranceSeverity === "expired" ? "critical" : insuranceSeverity, // Map expired to critical for Alert type compatibility if needed, or update Alert type
                daysRemaining: insuranceDays,
                message: `Polisa ubezpieczeniowa wygasa dla ${vehicle.make} ${vehicle.model} (${vehicle.plateNumber})`,
                isRead: false,
                createdAt: new Date().toISOString(),
            });
        }

        // Check Inspection
        const inspectionDays = getDaysRemaining(vehicle.inspectionExpiryDate);
        const inspectionSeverity = getAlertSeverity(inspectionDays);

        if (inspectionSeverity !== "good") {
            alerts.push({
                id: `alert-insp-${vehicle.id}`,
                vehicleId: vehicle.id,
                type: "inspection",
                status: inspectionSeverity === "expired" ? "critical" : inspectionSeverity,
                daysRemaining: inspectionDays,
                message: `Przegląd techniczny wygasa dla ${vehicle.make} ${vehicle.model} (${vehicle.plateNumber})`,
                isRead: false,
                createdAt: new Date().toISOString(),
            });
        }
    });

    return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}
