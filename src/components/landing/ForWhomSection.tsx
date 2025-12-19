import { HardHat, Wrench, Truck, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const industries = [
    {
        icon: HardHat,
        title: "Firmy Budowlane",
        description: "5-20 aut",
        features: ["Alerty na polisy", "Przeglądy maszyn", "Dokumentacja UDT"],
    },
    {
        icon: Wrench,
        title: "Firmy Serwisowe",
        description: "10-50 aut",
        features: ["Alerty na przeglądy", "Przypisanie do techników", "Historia napraw"],
    },
    {
        icon: Truck,
        title: "Transport",
        description: "20-100 aut",
        features: ["Alerty leasingowe", "Terminy licencji", "Karty paliwowe"],
    },
    {
        icon: Car,
        title: "Wypożyczalnie",
        description: "5-50 aut",
        features: ["Alerty na opony", "Rotacja aut", "Szybkie wydania"],
    },
];

export function ForWhomSection() {
    return (
        <section id="for-whom" className="py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Dla kogo jest FlotaAlert?</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Dostosowane do potrzeb małych i średnich firm z różnymi typami flot.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {industries.map((item, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-800">
                            <CardHeader className="text-center pb-2">
                                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-xl">{item.title}</CardTitle>
                                <p className="text-sm text-muted-foreground font-medium">{item.description}</p>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    {item.features.map((feature, i) => (
                                        <li key={i} className="flex items-center justify-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
