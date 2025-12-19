import Link from "next/link";
import { Car } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-50 py-12 border-t border-slate-800">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                            <Car className="h-6 w-6" />
                            <span>FlotaAlert</span>
                        </Link>
                        <p className="text-slate-400 text-sm">
                            Kompleksowe zarządzanie flotą dla nowoczesnych firm. Oszczędzaj czas i pieniądze.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Produkt</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="#features" className="hover:text-white transition-colors">Funkcje</Link></li>
                            <li><Link href="#pricing" className="hover:text-white transition-colors">Cennik</Link></li>
                            <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Firma</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="/about" className="hover:text-white transition-colors">O nas</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Kontakt</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Polityka prywatności</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Regulamin</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Kontakt</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>kontakt@flotaalert.pl</li>
                            <li>+48 123 456 789</li>
                            <li>ul. Przykładowa 123<br />00-001 Warszawa</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} FlotaAlert. Wszelkie prawa zastrzeżone.</p>
                </div>
            </div>
        </footer>
    );
}
