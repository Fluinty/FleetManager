"use client"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/utils/format"
import { Clock, ArrowRight, Package } from "lucide-react"
import { ItemResolver } from "@/components/pending/ItemResolver"

interface PendingItem {
    item_id: string
    item_name: string | null
    sku: string | null
    item_total: number | null
    plate_extraction_status: string | null
    order_id: string
    intercars_id: string
    order_date: string
    order_total: number | null
    raw_comment: string | null
    branch_code: string | null
}

interface VehicleOption {
    id: string
    plate_number: string
}

export function RecentPendingItems({ items, vehicles }: { items: PendingItem[], vehicles: VehicleOption[] }) {
    if (items.length === 0) {
        return (
            <div className="rounded-2xl bg-gradient-to-br from-white/80 to-emerald-50/50 backdrop-blur-xl border border-white/50 shadow-lg p-6 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-emerald-600" />
                    </div>
                    <p className="text-slate-500 font-medium">Wszystko zweryfikowane!</p>
                    <p className="text-sm text-slate-400">Brak oczekujących pozycji</p>
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
                    <p className="text-sm text-slate-500">Ostatnie pozycje</p>
                </div>
                <Link
                    href="/pending"
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 transition-colors"
                >
                    Wszystkie
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
            <div className="divide-y divide-amber-100/50">
                {items.map((item, index) => (
                    <div
                        key={item.item_id}
                        className="p-3 hover:bg-amber-50/50 transition-colors animate-fade-in flex items-center justify-between gap-3 group border-b border-amber-50/50 last:border-0"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="h-9 w-9 rounded-lg bg-amber-100 flex-shrink-0 flex items-center justify-center">
                                <Package className="h-4 w-4 text-amber-600" />
                            </div>
                            <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                                <p className="font-medium text-slate-700 text-sm truncate" title={item.item_name || 'Brak nazwy'}>
                                    {item.item_name || 'Brak nazwy'}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                                        {formatCurrency(item.item_total)}
                                    </span>
                                    <span>•</span>
                                    <span>{formatDate(item.order_date)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0">
                            <ItemResolver
                                itemId={item.item_id}
                                orderId={item.order_id}
                                itemName={item.item_name}
                                allItems={items
                                    .filter(i => i.order_id === item.order_id)
                                    .map(i => ({ id: i.item_id, name: i.item_name, sku: i.sku, total_gross: i.item_total }))}
                                vehicles={vehicles}
                                fullWidth={false}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
