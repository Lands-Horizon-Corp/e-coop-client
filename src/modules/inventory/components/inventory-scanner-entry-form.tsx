import { FileText, Landmark, Package, Scale } from 'lucide-react'

import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

// Aligned with Go TUnit consts
const UNITS = [
    { value: 'microgram', label: 'Microgram' },
    { value: 'milligram', label: 'Milligram' },
    { value: 'gram', label: 'Gram' },
    { value: 'kilogram', label: 'Kilogram' },
    { value: 'metric_ton', label: 'Metric Ton' },
    { value: 'ounce', label: 'Ounce' },
    { value: 'pound', label: 'Pound' },
    { value: 'n/a', label: 'N/A' },
]

// Aligned with Go StatusIn consts
const STATUS_IN = [
    'draft',
    'pending',
    'approved',
    'receiving',
    'received',
    'cancelled',
    'missing',
]

// Aligned with Go StatusOut consts
const STATUS_OUT = [
    'draft',
    'pending',
    'approved',
    'picking',
    'out_for_delivery',
    'delivered',
    'cancelled',
]

const WAREHOUSES = [
    { id: '1', name: 'Warehouse A', zone: 'Zone 1' },
    { id: '2', name: 'Warehouse B', zone: 'Zone 2' },
]

const ACCOUNTS = [
    { id: '1', code: '1001-00', name: 'Inventory Asset' },
    { id: '2', code: '5001-00', name: 'Cost of Goods' },
]

export const InventoryEntryForm = () => {
    return (
        <div className="space-y-5">
            {/* Logistics */}
            <section className="space-y-4">
                <div className="flex items-center gap-1.5 text-foreground">
                    <Package className="h-3.5 w-3.5" />
                    <h3 className="font-semibold text-[11px] uppercase tracking-wide">
                        Logistics
                    </h3>
                </div>

                <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="label-field">Warehouse</label>
                        <Select>
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Select Warehouse" />
                            </SelectTrigger>
                            <SelectContent>
                                {WAREHOUSES.map((w) => (
                                    <SelectItem
                                        className="text-xs"
                                        key={w.id}
                                        value={w.id}
                                    >
                                        {w.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                            <label className="label-field">Quantity</label>
                            <Input
                                className="h-8 text-xs"
                                placeholder="0.00"
                                type="number"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="label-field">Unit</label>
                            <Select>
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {UNITS.map((u) => (
                                        <SelectItem
                                            className="text-xs"
                                            key={u.value}
                                            value={u.value}
                                        >
                                            {u.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <label className="label-field">Weight</label>
                            <Input
                                className="h-8 text-xs"
                                placeholder="0.00"
                                step="0.01"
                                type="number"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <label className="label-field">Status In</label>
                            <Select>
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Inbound Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_IN.map((s) => (
                                        <SelectItem
                                            className="text-xs capitalize"
                                            key={s}
                                            value={s}
                                        >
                                            {s.replace('_', ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <label className="label-field">Status Out</label>
                            <Select>
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Outbound Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_OUT.map((s) => (
                                        <SelectItem
                                            className="text-xs capitalize"
                                            key={s}
                                            value={s}
                                        >
                                            {s.replace('_', ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Financial */}
            <section className="space-y-4">
                <div className="flex items-center gap-1.5 text-foreground">
                    <Landmark className="h-3.5 w-3.5" />
                    <h3 className="font-semibold text-[11px] uppercase tracking-wide">
                        Financial
                    </h3>
                </div>
                <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-secondary border border-border space-y-2">
                        <label className="label-field">Debit Account</label>
                        <Select>
                            <SelectTrigger className="h-8 text-xs bg-card">
                                <SelectValue placeholder="Select Debit Account" />
                            </SelectTrigger>
                            <SelectContent>
                                {ACCOUNTS.map((a) => (
                                    <SelectItem
                                        className="text-xs"
                                        key={a.id}
                                        value={a.id}
                                    >
                                        {a.code} — {a.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            className="h-8 text-xs bg-card"
                            placeholder="Debit Amount"
                            step="0.01"
                            type="number"
                        />
                    </div>
                    <div className="p-3 rounded-lg bg-secondary border border-border space-y-2">
                        <label className="label-field">Credit Account</label>
                        <Select>
                            <SelectTrigger className="h-8 text-xs bg-card">
                                <SelectValue placeholder="Select Credit Account" />
                            </SelectTrigger>
                            <SelectContent>
                                {ACCOUNTS.map((a) => (
                                    <SelectItem
                                        className="text-xs"
                                        key={a.id}
                                        value={a.id}
                                    >
                                        {a.code} — {a.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            className="h-8 text-xs bg-card"
                            placeholder="Credit Amount"
                            step="0.01"
                            type="number"
                        />
                    </div>
                </div>
            </section>

            {/* Dimensions */}
            <section className="space-y-4">
                <div className="flex items-center gap-1.5 text-foreground">
                    <Scale className="h-3.5 w-3.5" />
                    <h3 className="font-semibold text-[11px] uppercase tracking-wide">
                        Dimensions
                    </h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                        <label className="label-field">Width</label>
                        <Input
                            className="h-8 text-xs"
                            placeholder="W"
                            type="number"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="label-field">Length</label>
                        <Input
                            className="h-8 text-xs"
                            placeholder="L"
                            type="number"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="label-field">Height</label>
                        <Input
                            className="h-8 text-xs"
                            placeholder="H"
                            type="number"
                        />
                    </div>
                </div>
            </section>

            {/* Notes */}
            <section className="space-y-3">
                <div className="flex items-center gap-1.5 text-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    <h3 className="font-semibold text-[11px] uppercase tracking-wide">
                        Description
                    </h3>
                </div>
                <Textarea
                    className="min-h-[80px] resize-none text-xs"
                    placeholder="Internal description or notes..."
                />
            </section>
        </div>
    )
}
