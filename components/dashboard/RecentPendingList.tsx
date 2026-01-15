"use client"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/utils/format"
import { Clock, AlertCircle, ArrowRight } from "lucide-react"

interface PendingItem {
    id: string
    order_date: string
    error_type: string
    total_gross: number
}

export function RecentPendingList({ items }: { items: PendingItem[] }) {
    if (items.length === 0) {
        return (
            <div className="rounded-2xl bg-gradient-to-br from-white/80 to-emerald-50/50 backdrop-blur-xl border border-white/50 shadow-lg p-6 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-emerald-600" />
                    </div>
                    <p className="text-slate-500 font-medium">Wszystko zweryfikowane!</p>
                    <p className="text-sm text-slate-400">Brak oczekujących zamówień</p>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-2xl bg-gradient-to-br from-white/80 to-amber-50/50 backdrop-blur-xl border border-white/50 shadow-lg shadow-amber-500/5 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="p-6 border-b border-amber-100/50 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        Do weryfikacji
                    </h3>
                    <p className="text-sm text-slate-500">Ostatnie oczekujące zamówienia</p>
                </div>
                <Link
                    href="/pending"
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 transition-colors"
                >
                    Zobacz wszystkie
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
            <div className="divide-y divide-amber-100/50">
                {items.map((item, index) => (
                    <Link
                        key={item.id}
                        href="/pending"
                        className="flex items-center justify-between p-4 hover:bg-amber-50/50 transition-colors animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-700">{formatCurrency(item.total_gross)}</p>
                                <p className="text-sm text-slate-400">{formatDate(item.order_date)}</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                            {item.error_type === 'missing' ? 'Brak nr rej.' : item.error_type}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
