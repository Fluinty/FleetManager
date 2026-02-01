import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Zaloguj się | Fleet Manager",
    description: "Zaloguj się do Fleet Manager",
};

export default function LoginLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-full">
            {children}
        </div>
    );
}
