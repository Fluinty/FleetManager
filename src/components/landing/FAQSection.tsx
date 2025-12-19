import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "Czy mogę przetestować aplikację za darmo?",
        answer: "Tak! Oferujemy plan STARTER, który pozwala na zarządzanie flotą do 5 pojazdów całkowicie za darmo, bez limitu czasowego.",
    },
    {
        question: "Czy aplikacja działa offline?",
        answer: "Podstawowe widoki są dostępne offline, ale do otrzymywania aktualnych alertów i synchronizacji danych wymagane jest połączenie z internetem.",
    },
    {
        question: "Jak importować dane z Excela?",
        answer: "Podczas procesu onboardingu (konfiguracji konta) udostępniamy prosty kreator importu. Wystarczy wgrać plik .xlsx lub .csv z listą pojazdów.",
    },
    {
        question: "Czy mogę dodać własne typy alertów?",
        answer: "W wersji Business i Fleet możesz konfigurować progi czasowe powiadomień. W przyszłości planujemy dodanie w pełni niestandardowych typów alertów.",
    },
    {
        question: "Czy mogę zrezygnować w dowolnym momencie?",
        answer: "Oczywiście. Subskrypcję można anulować w każdym momencie z poziomu ustawień konta. Nie wiążemy klientów długoterminowymi umowami.",
    },
];

export function FAQSection() {
    return (
        <section id="faq" className="py-24">
            <div className="container px-4 md:px-6 max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Często zadawane pytania</h2>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
