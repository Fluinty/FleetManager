import { Car, ShoppingCart, AlertTriangle, Bell, TrendingUp, TrendingDown } from "lucide-react"

interface SummaryCardsProps {
    vehicleCount: number
    totalOrdersAmount: number
    pendingOrdersCount: number
    activeAlertsCount: number
}

export function SummaryCards({
    vehicleCount,
    totalOrdersAmount,
    pendingOrdersCount,
    activeAlertsCount
}: SummaryCardsProps) {
    const cards = [
        {
            title: "Aktywne Pojazdy",
            value: vehicleCount.toString(),
            icon: Car,
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
        },
        {
            title: "Zamówienia (Ten Miesiąc)",
            value: `${totalOrdersAmount.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`,
            icon: TrendingUp,
            gradient: "from-emerald-500 to-teal-500",
            bgGradient: "from-emerald-50 to-teal-50",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600"
        },
        {
            title: "Oczekujące Weryfikacji",
            value: pendingOrdersCount.toString(),
            icon: AlertTriangle,
            gradient: "from-amber-500 to-orange-500",
            bgGradient: "from-amber-50 to-orange-50",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            highlight: pendingOrdersCount > 0
        },
        {
            title: "Aktywne Alerty",
            value: activeAlertsCount.toString(),
            icon: Bell,
            gradient: "from-red-500 to-rose-500",
            bgGradient: "from-red-50 to-rose-50",
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            highlight: activeAlertsCount > 0
        }
    ]

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <div
                    key={card.title}
                    className={`
                        relative overflow-hidden rounded-2xl p-6
                        bg-gradient-to-br ${card.bgGradient}
                        border border-white/50 backdrop-blur-sm
                        shadow-lg shadow-slate-200/50
                        transition-all duration-300
                        hover:shadow-xl hover:-translate-y-1
                        animate-fade-in
                        ${card.highlight ? 'ring-2 ring-offset-2 ring-red-200' : ''}
                    `}
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    {/* Background Decoration */}
                    <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl`} />

                    <div className="relative flex items-start justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-500">{card.title}</p>
                            <p className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                                {card.value}
                            </p>

                        </div>
                        <div className={`${card.iconBg} p-3 rounded-xl`}>
                            <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
