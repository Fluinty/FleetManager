import { Vehicle } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Car, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentUpload } from "@/components/documents/DocumentUpload";

interface VehicleDetailsProps {
    vehicle: Vehicle;
}

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {
    const getStatusColor = (status: Vehicle['status']) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400';
            case 'service': return 'bg-amber-500/15 text-amber-700 dark:text-amber-400';
            case 'inactive': return 'bg-slate-500/15 text-slate-700 dark:text-slate-400';
            default: return 'bg-slate-500/15 text-slate-700';
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-bold">
                        {vehicle.make} {vehicle.model}
                    </CardTitle>
                    <Badge variant="outline" className={getStatusColor(vehicle.status)}>
                        {vehicle.status.toUpperCase()}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Numer Rejestracyjny</p>
                                <p className="text-lg font-semibold">{vehicle.plateNumber}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Lokalizacja</p>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{vehicle.location}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Rok Produkcji</p>
                                <div className="flex items-center gap-2">
                                    <Car className="h-4 w-4 text-muted-foreground" />
                                    <span>{vehicle.productionYear}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">VIN</p>
                                <span className="font-mono text-sm">{vehicle.vin || '-'}</span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Terminy i Dokumenty
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg border bg-secondary/30">
                                    <p className="text-xs text-muted-foreground mb-1">Ubezpieczenie (OC/AC)</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{vehicle.insuranceExpiryDate}</span>
                                        {/* Logic for days remaining would go here */}
                                        <Badge variant="destructive" className="h-5 text-[10px]">5 dni</Badge>
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg border bg-secondary/30">
                                    <p className="text-xs text-muted-foreground mb-1">Przegląd Techniczny</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{vehicle.inspectionExpiryDate}</span>
                                        <Badge variant="outline" className="h-5 text-[10px] bg-emerald-500/10 text-emerald-600 border-none">160 dni</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Zarządzanie Dokumentami
                            </h3>
                            <DocumentUpload vehicleId={vehicle.id} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Szybkie Akcje</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Edytuj dane pojazdu
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Zgłoś przegląd
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                        Zgłoś szkodę
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
