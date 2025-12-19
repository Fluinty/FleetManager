import { mockVehicles } from "@/lib/mock-data";
import { VehicleDetails } from "@/components/vehicles/VehicleDetails";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function VehicleDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const vehicle = mockVehicles.find((v) => v.id === id);

    if (!vehicle) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/vehicles">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Szczegóły pojazdu</h2>
            </div>

            <VehicleDetails vehicle={vehicle} />
        </div>
    );
}
