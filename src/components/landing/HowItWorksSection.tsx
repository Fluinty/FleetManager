import { Smartphone, AlertTriangle, FileText, Mail } from "lucide-react";

const steps = [
    {
        icon: Smartphone,
        title: "1. Otwórz aplikację",
        description: "Zaloguj się na telefonie lub komputerze. Masz dostęp do swojej floty 24/7.",
    },
    {
        icon: AlertTriangle,
        title: "2. Sprawdź alerty",
        description: "Widzisz od razu, które auta wymagają uwagi (czerwone/żółte statusy).",
    },
    {
        icon: FileText,
        title: "3. Generuj raport",
        description: "Jednym kliknięciem pobierz PDF z listą zadań dla zespołu lub zarządu.",
    },
    {
        icon: Mail,
        title: "4. Otrzymaj email",
        description: "Codzienne podsumowanie na skrzynkę, żeby nic nie umknęło.",
    },
];

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Jak to działa?</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Prosty proces, który oszczędza godziny pracy i tysiące złotych.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center mb-6 text-primary">
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>

                            {/* Connector Line (Desktop only) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-[2px] bg-slate-200 dark:bg-slate-800 -z-10" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
