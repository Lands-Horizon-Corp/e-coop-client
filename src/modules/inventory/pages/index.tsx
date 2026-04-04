import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { AnimatePresence } from 'framer-motion'
import { Loader2, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

import { useFormHelper } from '@/hooks/use-form-helper'

import BarcodeScanner from '../components/inventory-barcode-scanner'
import { InventoryUnifiedEntryForm } from '../components/inventory-entry-form'
import { InventoryItemsList } from '../components/inventory-item-list'
import { useStockInInventory, useStockOutInventory } from '../inventory.service'
import {
    InventoryUnifiedSchema,
    TInventoryUnifiedFormValues,
} from '../inventory.validation'

export const InventoryPage = () => {
    const form = useForm<TInventoryUnifiedFormValues>({
        resolver: standardSchemaResolver(InventoryUnifiedSchema),
        defaultValues: {
            quantity: 0,
            unit: '',
            name: '',
            barcode: '',
        },
    })

    const stockInMutation = useStockInInventory({
        options: withToastCallbacks({
            textSuccess: 'Stock In recorded',
        }),
    })

    const stockOutMutation = useStockOutInventory({
        options: withToastCallbacks({
            textSuccess: 'Stock Out recorded',
        }),
    })

    const { formRef, handleFocusError } =
        useFormHelper<TInventoryUnifiedFormValues>({
            form,
        })

    const onSubmit = form.handleSubmit((data) => {
        if (data.status_in) {
            stockInMutation.mutate(data)
        } else {
            stockOutMutation.mutate(data)
        }
    }, handleFocusError)

    const isPending = stockInMutation.isPending || stockOutMutation.isPending
    return (
        <div className="flex min-h-screen bg-background">
            {/* Left Panel: Scanner + Entry Form (~30%) */}
            <main className="flex-1 min-w-0 h-screen flex flex-col">
                <InventoryItemsList />
            </main>
            <aside className="flex-0 min-w-xs max-w-xs 2xl:min-w-sm shrink-0 border-r bg-card flex flex-col h-screen sticky top-0">
                {/* Scanner Section */}

                <Form {...form}>
                    <form
                        className="space-y-2 min-h-screen overflow-y-auto ecoop-scroll"
                        onSubmit={onSubmit}
                        ref={formRef}
                    >
                        {/* Barcode / Name */}

                        <div className="p-4 space-y-6 sticky bg-background top-0 ">
                            <header className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-semibold text-foreground">
                                        Record Movement
                                    </h2>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        Log inventory entry or shipment
                                    </p>
                                </div>
                                <Badge
                                    className="h-5 font-mono-sku text-[9px]"
                                    variant="secondary"
                                >
                                    #TRK-8829
                                </Badge>
                            </header>
                            <BarcodeScanner
                                onScan={(item) => {
                                    form.setValue('barcode', item)
                                }}
                            />
                        </div>
                        <InventoryUnifiedEntryForm form={form} />
                        {/* Action Footer */}
                        <div className="border-t bg-card p-3 px-5 flex items-center justify-between gap-2 shrink-0">
                            <AnimatePresence>
                                {/* {saved && (
                                    <motion.div
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-1 text-success text-[10px] font-medium"
                                        exit={{ opacity: 0, x: -10 }}
                                        initial={{ opacity: 0, x: -10 }}
                                    >
                                        <CheckCircle2 className="h-3 w-3" />
                                        Saved
                                    </motion.div>
                                )} */}
                            </AnimatePresence>
                            {/* {! && (
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                    <span className="text-[10px] text-muted-foreground font-medium">
                                        Ready
                                    </span>
                                </div>
                            )} */}
                            <div className="flex gap-2 justify-end w-full">
                                <Button
                                    className="h-7 text-[11px] text-muted-foreground px-2"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        form.reset()
                                    }}
                                    size="sm"
                                    variant="ghost"
                                >
                                    <X className="mr-1 h-3 w-3" />
                                    Reset
                                </Button>
                                <Button
                                    className="h-7 text-[11px] px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                                    disabled={isPending}
                                    size="sm"
                                >
                                    {isPending && (
                                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                    )}
                                    {isPending ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </aside>
        </div>
    )
}
