import React from 'react'

import {
    ArrowDownLeft,
    ArrowUpRight,
    Box,
    Filter,
    MapPin,
    Package,
    Scale,
    Search,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

import type {
    InventoryItemEntryResponse,
    StatusIn,
    StatusOut,
} from '../inventory.types'

const MOCK_ENTRIES: InventoryItemEntryResponse[] = [
    {
        id: '1',
        created_at: '2026-03-16T10:30:00Z',
        inventory_item: {
            id: 'i1',
            name: 'Industrial Steel Bearing',
            sku: 'SKU-99284-BX',
        },
        warehouse: { id: 'w1', name: 'Warehouse A', zone: 'Zone 1' },
        supplier: { id: 's1', name: 'Acme Industrial', rating: 4.5 },
        debit: 4250.0,
        credit: 0,
        quantity: 500,
        unit: 'kilogram',
        status_in: 'received',
        status_out: 'draft',
        weight: 125.5,
        dimensions_width: 30,
        dimensions_length: 40,
        dimensions_height: 20,
        description: 'Standard bearing shipment',
        longitude: -73.9857,
        latitude: 40.7484,
        current_location: 'New York, NY',
    },
    {
        id: '2',
        created_at: '2026-03-15T14:20:00Z',
        inventory_item: {
            id: 'i2',
            name: 'Aluminum Sheet 2mm',
            sku: 'SKU-44821-AL',
        },
        warehouse: { id: 'w2', name: 'Warehouse B', zone: 'Zone 2' },
        supplier: { id: 's2', name: 'MetalWorks Inc.', rating: 3.8 },
        debit: 8600.0,
        credit: 0,
        quantity: 200,
        unit: 'kilogram',
        status_in: 'pending',
        status_out: 'draft',
        weight: 340.0,
        description: '',
        longitude: -118.2437,
        latitude: 34.0522,
        current_location: 'Los Angeles, CA',
    },
    {
        id: '3',
        created_at: '2026-03-15T09:00:00Z',
        inventory_item: {
            id: 'i3',
            name: 'Copper Wire Spool',
            sku: 'SKU-11093-CP',
        },
        warehouse: { id: 'w1', name: 'Warehouse A', zone: 'Zone 1' },
        supplier: { id: 's3', name: 'Global Parts Co.', rating: 4.2 },
        debit: 0,
        credit: 3200.0,
        quantity: 50,
        unit: 'pound',
        status_in: 'draft',
        status_out: 'out_for_delivery',
        weight: 75.0,
        description: 'Outbound to client',
        longitude: -87.6298,
        latitude: 41.8781,
        current_location: 'Chicago, IL',
    },
    {
        id: '4',
        created_at: '2026-03-14T16:45:00Z',
        inventory_item: {
            id: 'i4',
            name: 'Stainless Steel Pipe',
            sku: 'SKU-77561-SS',
        },
        warehouse: { id: 'w3', name: 'Warehouse C', zone: 'Zone 3' },
        supplier: { id: 's1', name: 'Acme Industrial', rating: 4.5 },
        debit: 12400.0,
        credit: 0,
        quantity: 120,
        unit: 'kilogram',
        status_in: 'receiving',
        status_out: 'draft',
        weight: 560.0,
        description: 'Quality check required',
        longitude: -95.3698,
        latitude: 29.7604,
        current_location: 'Houston, TX',
    },
    {
        id: '5',
        created_at: '2026-03-14T11:30:00Z',
        inventory_item: {
            id: 'i5',
            name: 'Rubber Gasket Set',
            sku: 'SKU-33410-RB',
        },
        warehouse: { id: 'w1', name: 'Warehouse A', zone: 'Zone 1' },
        supplier: { id: 's3', name: 'Global Parts Co.', rating: 4.2 },
        debit: 1500.0,
        credit: 0,
        quantity: 1000,
        unit: 'gram',
        status_in: 'approved',
        status_out: 'draft',
        weight: 15.2,
        description: '',
        longitude: -122.4194,
        latitude: 37.7749,
        current_location: 'San Francisco, CA',
    },
    {
        id: '6',
        created_at: '2026-03-13T08:15:00Z',
        inventory_item: {
            id: 'i6',
            name: 'PVC Fitting Kit',
            sku: 'SKU-55672-PL',
        },
        warehouse: { id: 'w2', name: 'Warehouse B', zone: 'Zone 2' },
        supplier: { id: 's2', name: 'MetalWorks Inc.', rating: 3.8 },
        debit: 0,
        credit: 2880.0,
        quantity: 80,
        unit: 'pound',
        status_in: 'draft',
        status_out: 'delivered',
        weight: 42.0,
        description: 'Delivered to site B',
        longitude: -80.1918,
        latitude: 25.7617,
        current_location: 'Miami, FL',
    },
    {
        id: '7',
        created_at: '2026-03-13T07:00:00Z',
        inventory_item: {
            id: 'i7',
            name: 'Titanium Bolt M12',
            sku: 'SKU-22189-TN',
        },
        warehouse: { id: 'w1', name: 'Warehouse A', zone: 'Zone 1' },
        supplier: { id: 's1', name: 'Acme Industrial', rating: 4.5 },
        debit: 6250.0,
        credit: 0,
        quantity: 2500,
        unit: 'gram',
        status_in: 'pending',
        status_out: 'draft',
        weight: 88.0,
        description: '',
        longitude: -104.9903,
        latitude: 39.7392,
        current_location: 'Denver, CO',
    },
    {
        id: '8',
        created_at: '2026-03-12T15:30:00Z',
        inventory_item: {
            id: 'i8',
            name: 'Welding Rod E7018',
            sku: 'SKU-88934-WD',
        },
        warehouse: { id: 'w3', name: 'Warehouse C', zone: 'Zone 3' },
        supplier: { id: 's3', name: 'Global Parts Co.', rating: 4.2 },
        debit: 4500.0,
        credit: 0,
        quantity: 300,
        unit: 'kilogram',
        status_in: 'received',
        status_out: 'draft',
        weight: 300.0,
        description: '',
        longitude: -122.3321,
        latitude: 47.6062,
        current_location: 'Seattle, WA',
    },
]

const statusInStyles: Record<StatusIn, string> = {
    draft: 'bg-muted/60 text-muted-foreground border-border',
    pending: 'bg-warning/10 text-warning border-warning/20',
    approved: 'bg-primary/10 text-primary border-primary/20',
    receiving: 'bg-accent text-accent-foreground border-border',
    received: 'bg-success/10 text-success border-success/20',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
    missing: 'bg-hazard/10 text-hazard border-hazard/20',
}

const statusOutStyles: Record<StatusOut, string> = {
    draft: 'bg-muted/60 text-muted-foreground border-border',
    pending: 'bg-warning/10 text-warning border-warning/20',
    approved: 'bg-primary/10 text-primary border-primary/20',
    picking: 'bg-accent text-accent-foreground border-border',
    out_for_delivery: 'bg-warning/10 text-warning border-warning/20',
    delivered: 'bg-success/10 text-success border-success/20',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
}

function formatStatus(s: string) {
    return s.replace(/_/g, ' ')
}

function isInbound(entry: InventoryItemEntryResponse) {
    return entry.status_in !== 'draft'
}

export const InventoryItemsList: React.FC = () => {
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-5 border-b space-y-4 bg-secondary/30 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-foreground" />
                        <h2 className="text-sm font-semibold text-foreground">
                            Inventory Entries
                        </h2>
                        <Badge
                            className="text-[10px] font-mono-sku"
                            variant="secondary"
                        >
                            {MOCK_ENTRIES.length} records
                        </Badge>
                    </div>
                    <Button
                        className="h-8 text-xs gap-1.5"
                        size="sm"
                        variant="outline"
                    >
                        <Filter className="h-3 w-3" />
                        Filter
                    </Button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        className="pl-9 h-9 text-xs"
                        placeholder="Search by SKU, item name, or supplier..."
                    />
                </div>
            </div>

            {/* Cards Grid */}
            <ScrollArea className="flex-1">
                <div className="p-5 flex  flex-wrap gap-3">
                    {MOCK_ENTRIES.map((entry) => {
                        const inbound = isInbound(entry)
                        return (
                            <div
                                className="group rounded-xl border w-full min-w-full 2xl:max-w-sm  2xl:min-w-sm bg-card p-4 space-y-3 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
                                key={entry.id}
                            >
                                {/* Top row: direction + item + status */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-2.5">
                                        <div
                                            className={`mt-0.5 rounded-md p-1.5 ${inbound ? 'bg-success/10' : 'bg-warning/10'}`}
                                        >
                                            {inbound ? (
                                                <ArrowDownLeft className="h-3.5 w-3.5 text-success" />
                                            ) : (
                                                <ArrowUpRight className="h-3.5 w-3.5 text-warning" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                                {entry.inventory_item?.name}
                                            </p>
                                            <p className="font-mono-sku text-[10px] text-muted-foreground mt-0.5">
                                                {entry.inventory_item?.sku}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        {inbound &&
                                            entry.status_in !== 'draft' && (
                                                <Badge
                                                    className={`text-[9px] capitalize ${statusInStyles[entry.status_in]}`}
                                                    variant="outline"
                                                >
                                                    IN:{' '}
                                                    {formatStatus(
                                                        entry.status_in
                                                    )}
                                                </Badge>
                                            )}
                                        {!inbound &&
                                            entry.status_out !== 'draft' && (
                                                <Badge
                                                    className={`text-[9px] capitalize ${statusOutStyles[entry.status_out]}`}
                                                    variant="outline"
                                                >
                                                    OUT:{' '}
                                                    {formatStatus(
                                                        entry.status_out
                                                    )}
                                                </Badge>
                                            )}
                                    </div>
                                </div>

                                {/* Details row */}
                                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Box className="h-3 w-3" />
                                        {entry.quantity.toLocaleString()}{' '}
                                        {entry.unit}
                                    </span>
                                    {entry.weight && (
                                        <span className="flex items-center gap-1">
                                            <Scale className="h-3 w-3" />
                                            {entry.weight} kg
                                        </span>
                                    )}
                                    {entry.warehouse && (
                                        <span>{entry.warehouse.name}</span>
                                    )}
                                    {entry.current_location && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {entry.current_location}
                                        </span>
                                    )}
                                </div>

                                {/* Bottom row: financial + meta */}
                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                    <div className="flex items-center gap-3">
                                        {entry.debit > 0 && (
                                            <span className="text-[10px] font-mono-sku">
                                                <span className="text-muted-foreground">
                                                    DR{' '}
                                                </span>
                                                <span className="text-foreground font-medium">
                                                    $
                                                    {entry.debit.toLocaleString(
                                                        'en-US',
                                                        {
                                                            minimumFractionDigits: 2,
                                                        }
                                                    )}
                                                </span>
                                            </span>
                                        )}
                                        {entry.credit > 0 && (
                                            <span className="text-[10px] font-mono-sku">
                                                <span className="text-muted-foreground">
                                                    CR{' '}
                                                </span>
                                                <span className="text-foreground font-medium">
                                                    $
                                                    {entry.credit.toLocaleString(
                                                        'en-US',
                                                        {
                                                            minimumFractionDigits: 2,
                                                        }
                                                    )}
                                                </span>
                                            </span>
                                        )}
                                        {entry.supplier && (
                                            <span className="text-[10px] text-muted-foreground">
                                                {entry.supplier.name}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(
                                            entry.created_at
                                        ).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
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
