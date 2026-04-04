import { toReadableDate } from '@/helpers/date-utils'
import { useGetAllInventoryItem } from '@/modules/inventory-item'
import {
    AlertTriangle,
    Box,
    DollarSign,
    Package,
    Tag,
    Warehouse,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

import { computeInventory } from '../helper'

export const InventoryItemsList = () => {
    const { data: items } = useGetAllInventoryItem()

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-5 border-b bg-secondary/30">
                <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <h2 className="text-sm font-semibold">Inventory Items</h2>
                    <Badge className="text-[10px]" variant="secondary">
                        {items?.length ?? 0} items
                    </Badge>
                </div>
            </div>

            {/* Grid */}
            <ScrollArea className="flex-1">
                <div className="p-5 flex flex-wrap gap-3">
                    {items?.map((item) => {
                        const computed = computeInventory(item)

                        return (
                            <div
                                className="w-full 2xl:max-w-sm rounded-xl border bg-card p-4 space-y-3 hover:shadow-md transition"
                                key={item.id}
                            >
                                {/* Top */}
                                <div className="flex gap-3">
                                    {/* Image */}
                                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                        {item.media?.download_url ? (
                                            <img
                                                className="w-full h-full object-cover"
                                                src={item.media.download_url}
                                            />
                                        ) : (
                                            <Box className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold truncate">
                                            {item.name}
                                        </p>

                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {item.category && (
                                                <Badge
                                                    className="text-[9px]"
                                                    variant="outline"
                                                >
                                                    {item.category.name}
                                                </Badge>
                                            )}

                                            {item.brand && (
                                                <Badge
                                                    className="text-[9px]"
                                                    variant="outline"
                                                >
                                                    {item.brand.name}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Stock Info */}
                                <div className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-1">
                                        <Warehouse className="h-3 w-3" />
                                        <span>
                                            {item.total_quantity} {item.unit}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        <span>
                                            {computed.average_cost.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex gap-2 flex-wrap">
                                    {computed.is_out_of_stock && (
                                        <Badge
                                            className="text-[9px]"
                                            variant="destructive"
                                        >
                                            Out of Stock
                                        </Badge>
                                    )}

                                    {computed.is_low_stock &&
                                        !computed.is_out_of_stock && (
                                            <Badge
                                                className="text-[9px]"
                                                variant="secondary"
                                            >
                                                Low Stock
                                            </Badge>
                                        )}

                                    {item.hazard && (
                                        <Badge className="text-[9px] bg-hazard/10 text-hazard">
                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                            {item.hazard.name}
                                        </Badge>
                                    )}
                                </div>

                                {/* Tags */}

                                {item.tags && (
                                    <div className="flex gap-1 flex-wrap">
                                        {item.tags?.slice(0, 3).map((tag) => (
                                            <Badge
                                                className="text-[9px]"
                                                key={tag.id}
                                                style={{
                                                    backgroundColor:
                                                        tag.color ?? '#eee',
                                                }}
                                            >
                                                <Tag className="h-3 w-3 mr-1" />
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Bottom */}
                                <div className="flex justify-between text-[10px] text-muted-foreground border-t pt-2">
                                    <span>
                                        ₱{item.total_price.toLocaleString()}
                                    </span>

                                    <span>
                                        {item.updated_at &&
                                            toReadableDate(item.updated_at)}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
    )
}
