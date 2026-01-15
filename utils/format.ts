export function formatCurrency(amount: number | null | undefined): string {
    if (amount === null || amount === undefined) return "0,00 PLN"
    return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
    }).format(amount)
}

export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}
