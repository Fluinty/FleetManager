export type UserRole = 'owner' | 'manager' | 'driver';

export interface Organization {
    id: string;
    name: string;
    nip?: string;
    subscriptionPlan: 'starter' | 'business' | 'fleet' | 'enterprise';
    createdAt: string;
}

export interface Vehicle {
    id: string;
    organizationId: string; // Foreign Key

    // Dane podstawowe
    plateNumber: string; // NR Rejestracyjny
    make: string; // MARKA
    model: string; // MODEL
    productionYear: number; // ROK PRODUKCJI

    // Dane techniczne
    engineCapacity?: number; // POJEMNOŚĆ
    loadCapacity?: number; // ŁADOWNOŚĆ

    // Terminy
    inspectionExpiryDate: string; // TERMIN NASTĘPNEGO PRZEGLĄDU
    insuranceExpiryDate: string; // TERMIN NASTĘPNEJ POLISY

    // Lokalizacja
    location: string; // MIASTO
    airportAccess?: boolean; // LOTNISKO (tak/nie)

    // Leasing
    isLeasing: boolean; // LEASING (tak/nie)
    leasingCompany?: string; // NAZWA LEASINGU
    leasingExpiryDate?: string; // ZAKOŃCZENIE UMOWY LEASINGU

    // Dokumenty (URLs)
    inspectionDocUrl?: string; // PRZEGLĄD DOKUMENT
    insuranceDocUrl?: string; // POLISA DOKUMENT

    // Status (Active/Service/Inactive)
    status: 'active' | 'service' | 'inactive';

    createdAt: string;
    updatedAt: string;
}

export interface Alert {
    id: string;
    vehicleId: string;
    type: 'insurance' | 'inspection' | 'leasing' | 'other';
    status: 'critical' | 'warning' | 'good';
    daysRemaining: number;
    message: string;
    isRead: boolean;
    createdAt: string;
    vehicle?: Vehicle; // Optional relation for UI
}

export interface VehicleEvent {
    id: string;
    vehicleId: string;
    type: 'location_change' | 'status_change' | 'document_upload' | 'note';
    description: string;
    performedBy: string;
    date: string;
}
