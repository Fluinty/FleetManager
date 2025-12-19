import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
    {
        name: "STARTER",
        price: "0 zł",
        description: "Idealny na start dla małych firm.",
        features: [
            "Do 5 pojazdów",
            "Podstawowe alerty (polisy, przeglądy)",
            "Dostęp dla 1 użytkownika",
            "Wsparcie email",
        ],
        cta: "Zacznij za darmo",
        variant: "outline" as const,
    },
    {
        name: "BUSINESS",
        price: "99 zł",
        period: "/mies",
        description: "Dla rozwijających się firm usługowych.",
        features: [
            "Do 25 pojazdów",
            "Pełne alerty (w tym leasing)",
            "Powiadomienia email",
            "Eksport raportów (PDF, Excel)",
            "Priorytetowe wsparcie",
        ],
        cta: "Wybierz pakiet",
        variant: "default" as const,
        popular: true,
    },
    {
        name: "FLEET",
        price: "249 zł",
        period: "/mies",
        description: "Kompleksowe zarządzanie dla transportu.",
        features: [
            "Do 100 pojazdów",
            "Wszystkie funkcje Business",
            "Zarządzanie kosztami (wkrótce)",
            "Moduł kierowców",
            "Dedykowany opiekun",
        ],
        cta: "Wybierz pakiet",
        variant: "outline" as const,
    },
];

export function PricingSection() {
    return (
        <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Prosty, przejrzysty cennik</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Wybierz plan dopasowany do wielkości Twojej floty. Bez ukrytych kosztów.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <Card key={index} className={`flex flex-col relative ${plan.popular ? 'border-primary shadow-lg scale-105 z-10' : ''}`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Popularne
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-xl text-muted-foreground">{plan.name}</CardTitle>
                                <div className="mt-4 flex items-baseline text-5xl font-extrabold tracking-tight">
                                    {plan.price}
                                    {plan.period && <span className="text-xl font-normal text-muted-foreground ml-1">{plan.period}</span>}
                                </div>
                                <CardDescription className="mt-2">{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-3 text-sm">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant={plan.variant} size="lg">
                                    {plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-muted-foreground">
                        Potrzebujesz planu Enterprise dla większej floty? <a href="#contact" className="text-primary hover:underline">Skontaktuj się z nami</a>.
                    </p>
                </div>
            </div>
        </section>
    );
}
