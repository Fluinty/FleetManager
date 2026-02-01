import { TrendingUp, TrendingDown, ShoppingCart, Car, DollarSign, BarChart3 } from "lucide-react"

interface StatsSummaryCardsProps {
    totalSpending: number
    avgPerVehicle: number
    momChange: number | null
    totalOrders: number
    vehiclesWithOrders: number
}

export function StatsSummaryCards({
    totalSpending,
    avgPerVehicle,
    momChange,
    totalOrders,
    vehiclesWithOrders
}: StatsSummaryCardsProps) {
    const cards = [
        {
            title: "Łączne Wydatki",
            value: `${totalSpending.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`,
            icon: DollarSign,
            gradient: "from-emerald-500 to-teal-500",
            bgGradient: "from-emerald-50 to-teal-50",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600"
        },
        {
            title: "Średnia na Pojazd",
            value: `${avgPerVehicle.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`,
            icon: Car,
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
        },
        {
            title: "Zmiana m/m",
            value: momChange !== null
                ? `${momChange >= 0 ? '+' : ''}${momChange.toFixed(1)}%`
                : "—",
            subtitle: momChange !== null
                ? (momChange >= 0 ? "wzrost" : "spadek")
                : "brak danych",
            icon: momChange !== null && momChange >= 0 ? TrendingUp : TrendingDown,
            gradient: momChange !== null && momChange >= 0
                ? "from-red-500 to-rose-500"
                : "from-green-500 to-emerald-500",
            bgGradient: momChange !== null && momChange >= 0
                ? "from-red-50 to-rose-50"
                : "from-green-50 to-emerald-50",
            iconBg: momChange !== null && momChange >= 0 ? "bg-red-100" : "bg-green-100",
            iconColor: momChange !== null && momChange >= 0 ? "text-red-600" : "text-green-600"
        },
        {
            title: "Zamówienia",
            value: totalOrders.toString(),
            subtitle: `${vehiclesWithOrders} pojazdów`,
            icon: ShoppingCart,
            gradient: "from-violet-500 to-purple-500",
            bgGradient: "from-violet-50 to-purple-50",
            iconBg: "bg-violet-100",
            iconColor: "text-violet-600"
        }
    ]

    return (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <div
                    key={card.title}
                    className={`
                        relative overflow-hidden rounded-xl md:rounded-2xl p-4 md:p-6
                        bg-gradient-to-br ${card.bgGradient}
                        border border-white/50 backdrop-blur-sm
                        shadow-lg shadow-slate-200/50
                        transition-all duration-300
                        hover:shadow-xl hover:-translate-y-1
                        animate-fade-in
                    `}
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    {/* Background Decoration */}
                    <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl`} />

                    <div className="relative flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-500">{card.title}</p>
                            <p className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                                {card.value}
                            </p>
                            {card.subtitle && (
                                <p className="text-xs text-slate-500">{card.subtitle}</p>
                            )}
                        </div>
                        <div className={`${card.iconBg} p-3 rounded-xl`}>
                            <card.icon className={`h-5 w-5 md:h-6 md:w-6 ${card.iconColor}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
