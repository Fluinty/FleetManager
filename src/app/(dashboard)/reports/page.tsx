"use client";

import { useState } from "react";
import { mockVehicles } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, FileText, Table } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportsPage() {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDF = () => {
        setIsGenerating(true);
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Raport Floty - FlotaAlert", 14, 22);
        doc.setFontSize(11);
        doc.text(`Data generowania: ${new Date().toLocaleDateString()}`, 14, 30);

        const tableData = mockVehicles.map((v) => [
            `${v.make} ${v.model}`,
            v.plateNumber,
            v.location,
            v.status,
            v.insuranceExpiryDate,
            v.inspectionExpiryDate,
        ]);

        autoTable(doc, {
            head: [["Pojazd", "Nr Rej", "Lokalizacja", "Status", "Polisa", "Przegląd"]],
            body: tableData,
            startY: 40,
        });

        doc.save("raport-floty.pdf");
        setIsGenerating(false);
    };

    const generateCSV = () => {
        const headers = ["Marka Model", "Nr Rej", "Lokalizacja", "Status", "Polisa", "Przegląd"];
        const rows = mockVehicles.map((v) => [
            `${v.make} ${v.model}`,
            v.plateNumber,
            v.location,
            v.status,
            v.insuranceExpiryDate,
            v.inspectionExpiryDate,
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "raport_floty.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Raporty</h2>
                <p className="text-muted-foreground">Generuj zestawienia dla zarządu i księgowości.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileDown className="h-5 w-5 text-red-600" />
                            Raport PDF
                        </CardTitle>
                        <CardDescription>
                            Pełne zestawienie floty w formacie do druku.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Zawiera: Lista pojazdów, terminy, statusy.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={generatePDF} disabled={isGenerating} className="w-full">
                            Pobierz PDF
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Table className="h-5 w-5 text-green-600" />
                            Eksport CSV
                        </CardTitle>
                        <CardDescription>
                            Dane surowe do dalszej obróbki w Excelu.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Zawiera: Wszystkie pola pojazdów w formacie tekstowym.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" onClick={generateCSV} className="w-full">
                            Pobierz CSV/Excel
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
