"use client";

import { useState } from "react";
import { mockVehicles } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, ShieldCheck, Wrench, Building2, MapPin } from "lucide-react";
import { Vehicle } from "@/types";
import { VehicleForm } from "@/components/vehicles/VehicleForm";
import Link from "next/link";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

export default function VehiclesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Filters
    const [cityFilter, setCityFilter] = useState("all");
    const [makeFilter, setMakeFilter] = useState("all");
    const [modelFilter, setModelFilter] = useState("all");

    // Sorting
    const [sortOption, setSortOption] = useState("alphabetical");

    // Unique values for filters
    const cities = Array.from(new Set(vehicles.map(v => v.location)));
    const makes = Array.from(new Set(vehicles.map(v => v.make)));
    const models = Array.from(new Set(vehicles.filter(v => makeFilter === "all" || v.make === makeFilter).map(v => v.model)));

    const filteredVehicles = vehicles.filter((vehicle) => {
        const matchesSearch =
            vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCity = cityFilter === "all" || vehicle.location === cityFilter;
        const matchesMake = makeFilter === "all" || vehicle.make === makeFilter;
        const matchesModel = modelFilter === "all" || vehicle.model === modelFilter;

        return matchesSearch && matchesCity && matchesMake && matchesModel;
    }).sort((a, b) => {
        switch (sortOption) {
            case "year_desc": return b.productionYear - a.productionYear;
            case "year_asc": return a.productionYear - b.productionYear;
            case "policy_asc": return new Date(a.insuranceExpiryDate).getTime() - new Date(b.insuranceExpiryDate).getTime();
            case "inspection_asc": return new Date(a.inspectionExpiryDate).getTime() - new Date(b.inspectionExpiryDate).getTime();
            case "alphabetical":
            default:
                return a.make.localeCompare(b.make) || a.model.localeCompare(b.model);
        }
    });

    const getStatusColor = (status: Vehicle['status']) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
            case 'service': return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20';
            case 'inactive': return 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/20';
            default: return 'bg-slate-500/15 text-slate-700';
        }
    };

    const updateVehicleStatus = (id: string, status: Vehicle['status']) => {
        setVehicles(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    };

    const updateVehicleLocation = (id: string, location: string) => {
        setVehicles(prev => prev.map(v => v.id === id ? { ...v, location } : v));
    };

    const handleAddVehicle = (data: any) => {
        const newVehicle: Vehicle = {
            id: Math.random().toString(36).substr(2, 9),
            organizationId: "org-1",
            ...data,
            isLeasing: false, // Default or add to form
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setVehicles(prev => [newVehicle, ...prev]);
        setIsAddDialogOpen(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pojazdy</h2>
                    <p className="text-muted-foreground">Zarządzaj swoją flotą pojazdów.</p>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Dodaj pojazd
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Dodaj nowy pojazd</DialogTitle>
                            <DialogDescription>
                                Wprowadź dane pojazdu. Kliknij zapisz, aby dodać go do floty.
                            </DialogDescription>
                        </DialogHeader>
                        <VehicleForm onSubmit={handleAddVehicle} onSuccess={() => setIsAddDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-card p-4 rounded-lg border">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Szukaj..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Miasto" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Wszystkie miasta</SelectItem>
                        {cities.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={makeFilter} onValueChange={(val) => { setMakeFilter(val); setModelFilter("all"); }}>
                    <SelectTrigger>
                        <SelectValue placeholder="Marka" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Wszystkie marki</SelectItem>
                        {makes.map(make => (
                            <SelectItem key={make} value={make}>{make}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={modelFilter} onValueChange={setModelFilter} disabled={makeFilter === "all"}>
                    <SelectTrigger>
                        <SelectValue placeholder="Model" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Wszystkie modele</SelectItem>
                        {models.map(model => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-normal">Sortuj:</span>
                            <SelectValue placeholder="Sortuj" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="alphabetical">Alfabetycznie</SelectItem>
                        <SelectItem value="year_desc">Rocznik (najnowsze)</SelectItem>
                        <SelectItem value="year_asc">Rocznik (najstarsze)</SelectItem>
                        <SelectItem value="policy_asc">Polisa (najbliższe)</SelectItem>
                        <SelectItem value="inspection_asc">Przegląd (najbliższe)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge variant="outline" className="mb-2">{vehicle.productionYear}</Badge>
                                    <CardTitle className="text-lg">{vehicle.make} {vehicle.model}</CardTitle>
                                    <div className="text-sm font-mono text-muted-foreground mt-1">{vehicle.plateNumber}</div>
                                </div>
                                <Select
                                    defaultValue={vehicle.status}
                                    onValueChange={(val) => updateVehicleStatus(vehicle.id, val as Vehicle['status'])}
                                >
                                    <SelectTrigger className={`w-[130px] h-8 text-xs ${getStatusColor(vehicle.status)} border-0`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Aktywny</SelectItem>
                                        <SelectItem value="service">W serwisie</SelectItem>
                                        <SelectItem value="inactive">Nieaktywny</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-muted-foreground flex items-center gap-1.5">
                                        <ShieldCheck className="h-3.5 w-3.5" /> Polisa
                                    </span>
                                    <div className="font-medium">
                                        {format(new Date(vehicle.insuranceExpiryDate), "dd MMM yyyy", { locale: pl })}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-muted-foreground flex items-center gap-1.5">
                                        <Wrench className="h-3.5 w-3.5" /> Przegląd
                                    </span>
                                    <div className="font-medium">
                                        {format(new Date(vehicle.inspectionExpiryDate), "dd MMM yyyy", { locale: pl })}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 border-t flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground flex items-center gap-1.5">
                                        <Building2 className="h-3.5 w-3.5" /> Leasing
                                    </span>
                                    <div className="font-medium">
                                        {vehicle.isLeasing ? (
                                            <span className="text-emerald-600 dark:text-emerald-400">
                                                do {vehicle.leasingExpiryDate ? format(new Date(vehicle.leasingExpiryDate), "dd MMM yyyy", { locale: pl }) : 'Brak daty'}
                                            </span>
                                        ) : (
                                            <span className="text-slate-500">Nie dotyczy</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5" /> Lokalizacja
                                    </span>
                                    <Select
                                        defaultValue={vehicle.location}
                                        onValueChange={(val) => updateVehicleLocation(vehicle.id, val)}
                                    >
                                        <SelectTrigger className="w-[140px] h-7 text-xs border-dashed">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cities.map(city => (
                                                <SelectItem key={city} value={city}>{city}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/vehicles/${vehicle.id}`} className="w-full">
                                <Button variant="outline" className="w-full group">
                                    Szczegóły pojazdu
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {filteredVehicles.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    Nie znaleziono pojazdów spełniających kryteria.
                </div>
            )}
        </div>
    );
}
