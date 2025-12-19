import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Car className="h-6 w-6" />
                    <span>FlotaAlert</span>
                </Link>

                <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="#features" className="hover:text-foreground transition-colors">Funkcje</Link>
                    <Link href="#pricing" className="hover:text-foreground transition-colors">Cennik</Link>
                    <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
                    <Link href="#contact" className="hover:text-foreground transition-colors">Kontakt</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" size="sm">Zaloguj się</Button>
                    </Link>
                    <Link href="/register">
                        <Button size="sm">Wypróbuj za darmo</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
