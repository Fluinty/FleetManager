import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                        🚀 Nowość: Automatyczne powiadomienia SMS
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        Zarządzaj flotą bez chaosu. <br />
                        <span className="text-primary">Unikaj strat finansowych.</span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-[700px]">
                        Jedyna polska aplikacja, która automatycznie pilnuje terminów ubezpieczeń i przeglądów.
                        Zastąp Excela i śpij spokojnie, wiedząc że Twoja flota jest bezpieczna.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link href="/register">
                            <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-8">
                                Zacznij za darmo <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="#demo">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8">
                                Zobacz demo
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground pt-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span>Bez karty kredytowej</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span>5 aut za darmo na start</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span>Konfiguracja w 5 minut</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Mockup Placeholder */}
                <div className="mt-16 relative mx-auto max-w-5xl">
                    <div className="rounded-xl border bg-background shadow-2xl overflow-hidden">
                        <div className="aspect-[16/9] bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-muted-foreground">
                            [MOCKUP DASHBOARDU Z ALERTAMI]
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/30 rounded-full blur-3xl opacity-50 -z-10 animate-pulse" />
                    <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-secondary/30 rounded-full blur-3xl opacity-50 -z-10 animate-pulse delay-700" />
                </div>
            </div>
        </section>
    );
}
