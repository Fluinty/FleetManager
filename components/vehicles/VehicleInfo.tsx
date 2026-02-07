import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/utils/format"
import { AirportStatusSelect } from "./AirportStatusSelect"
import { BranchSelect } from "./BranchSelect"
import { ExternalLink } from "lucide-react"

interface VehicleInfoProps {
    vehicle: any // Typed lazily for speed, ideally proper Supabase type
    branchName?: string
    availableBranches: { id: string; name: string }[]
}

export function VehicleInfo({ vehicle, branchName, availableBranches }: VehicleInfoProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Szczegóły Pojazdu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Oddział</p>
                        <BranchSelect
                            vehicleId={vehicle.id}
                            currentBranchId={vehicle.branch_id}
                            availableBranches={availableBranches}
                        />
                    </div>
                    <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-medium">{vehicle.is_active ? "Aktywny" : "Nieaktywny"}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Rocznik</p>
                        <p className="font-medium">{vehicle.production_year || "-"}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Pojemność</p>
                        <p className="font-medium">{vehicle.engine_capacity} cm³</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Ubezpieczenie</p>
                        <p className="font-medium">{formatDate(vehicle.next_insurance_date)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Polisa</p>
                        {vehicle.insurance_document_url ? (
                            <a
                                href={vehicle.insurance_document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 font-medium"
                            >
                                Zobacz dokument
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        ) : (
                            <p className="font-medium text-muted-foreground">BRAK</p>
                        )}
                    </div>
                    <div>
                        <p className="text-muted-foreground">Przegląd</p>
                        <p className="font-medium">{formatDate(vehicle.next_inspection_date)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Dokument przeglądu</p>
                        {vehicle.inspection_document_url ? (
                            <a
                                href={vehicle.inspection_document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 font-medium"
                            >
                                Zobacz dokument
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        ) : (
                            <p className="font-medium text-muted-foreground">BRAK</p>
                        )}
                    </div>
                    <div>
                        <p className="text-muted-foreground">Leasing</p>
                        <p className="font-medium">{vehicle.is_leasing ? "Tak" : "Nie"}</p>
                    </div>
                    {vehicle.is_leasing && (
                        <div>
                            <p className="text-muted-foreground">Firma Leasingowa</p>
                            <p className="font-medium">{vehicle.leasing_company}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-muted-foreground">Lotnisko</p>
                        <AirportStatusSelect
                            vehicleId={vehicle.id}
                            initialValue={vehicle.is_airport}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
