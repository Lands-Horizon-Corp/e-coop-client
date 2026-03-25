import { UseFormReturn } from 'react-hook-form'

import {
    STATUS_IN,
    STATUS_OUT,
    TInventoryUnifiedFormValues,
    UNITS,
} from '@/modules/inventory'
import InventoryBrandPicker from '@/modules/inventory-brand/components/inventory-brand-picker'
import InventoryCategoryPicker from '@/modules/inventory-category/components/inventory-category-picker'
import InventorySupplierPicker from '@/modules/inventory-supplier/components/inventory-supplier-picker'
import InventoryWarehousePicker from '@/modules/inventory-warehouse/pages/inventory-warehouse-picker'
import { Package } from 'lucide-react'

import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface InventoryUnifiedFormProps {
    form: UseFormReturn<TInventoryUnifiedFormValues>
}

export const InventoryUnifiedEntryForm = ({
    form,
}: InventoryUnifiedFormProps) => {
    return (
        <div className="px-5">
            {/* Barcode / Name */}
            <div className="grid grid-cols-2 gap-2">
                <FormFieldWrapper
                    control={form.control}
                    label="Barcode"
                    name="barcode"
                    render={({ field }) => (
                        <Input {...field} className="h-8 text-xs" />
                    )}
                />
                <FormFieldWrapper
                    control={form.control}
                    label="Item Name"
                    name="name"
                    render={({ field }) => (
                        <Input {...field} className="h-8 text-xs" />
                    )}
                />
            </div>
            <FormFieldWrapper
                control={form.control}
                label="Category"
                name="category_id"
                render={({ field }) => (
                    <InventoryCategoryPicker
                        {...field}
                        onSelect={(item) => {
                            form.setValue('category', item)
                            form.setValue('category_id', item.id)
                        }}
                        value={form.getValues('category')}
                    />
                )}
            />

            <FormFieldWrapper
                control={form.control}
                label="Brand"
                name="brand_id"
                render={({ field }) => (
                    <InventoryBrandPicker
                        {...field}
                        onSelect={(item) => {
                            form.setValue('brand', item)
                            form.setValue('brand_id', item.id)
                        }}
                        value={form.getValues('brand')}
                    />
                )}
            />
            <FormFieldWrapper
                control={form.control}
                label="Supplier"
                name="supplier_id"
                render={({ field }) => (
                    <InventorySupplierPicker
                        {...field}
                        onSelect={(item) => {
                            form.setValue('supplier', item)
                            form.setValue('supplier_id', item.id)
                        }}
                        value={form.getValues('supplier')}
                    />
                )}
            />
            {/* Logistics */}
            <div className="flex items-center gap-1.5 text-foreground">
                <Package className="h-3.5 w-3.5" />
                <h3 className="font-semibold text-[11px] uppercase tracking-wide">
                    Logistics
                </h3>
            </div>
            <FormFieldWrapper
                control={form.control}
                label="Warehouse"
                name="warehouse_id"
                render={({ field }) => (
                    <InventoryWarehousePicker
                        {...field}
                        onSelect={(item) => {
                            form.setValue('warehouse', item)
                            form.setValue('warehouse_id', item.id)
                        }}
                        value={form.getValues('warehouse')}
                    />
                )}
            />
            <FormFieldWrapper
                control={form.control}
                label="Quantity"
                name="quantity"
                render={({ field }) => <Input {...field} />}
            />

            <FormFieldWrapper
                control={form.control}
                label="Unit"
                name="unit"
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="h-8 text-xs w-full">
                            <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                            {UNITS.map((u) => (
                                <SelectItem key={u.value} value={u.value}>
                                    {u.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />

            {/* Cost */}
            <FormFieldWrapper
                className=""
                control={form.control}
                label="Unit Cost"
                name="unit_cost"
                render={({ field }) => (
                    <Input
                        {...field}
                        className="w-full"
                        step="0.01"
                        type="number"
                    />
                )}
            />

            {/* Flow Selection */}
            <div className="grid grid-cols-2 gap-2">
                <FormFieldWrapper
                    control={form.control}
                    label="Stock In"
                    name="status_in"
                    render={({ field }) => (
                        <Select
                            onValueChange={(val) => {
                                form.setValue('status_out', undefined)
                                field.onChange(val)
                            }}
                            value={field.value}
                        >
                            <SelectTrigger className="h-8 text-xs w-full">
                                <SelectValue placeholder="Inbound Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_IN.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                <FormFieldWrapper
                    control={form.control}
                    label="Stock Out"
                    name="status_out"
                    render={({ field }) => (
                        <Select
                            onValueChange={(val) => {
                                form.setValue('status_in', undefined)
                                field.onChange(val)
                            }}
                            value={field.value}
                        >
                            <SelectTrigger className="h-8 text-xs w-full">
                                <SelectValue placeholder="Outbound Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OUT.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {/* Description */}
            <FormFieldWrapper
                control={form.control}
                label="Description"
                name="description"
                render={({ field }) => (
                    <Textarea {...field} className="text-xs" />
                )}
            />
        </div>
    )
}
