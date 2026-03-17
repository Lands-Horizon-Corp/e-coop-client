import React, { useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
// import { InventoryEntryForm } from './InventoryEntryForm';
// import { InventoryItemsList } from './InventoryItemsList';
import { CheckCircle2, Loader2, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { InventoryItemsList } from '../components/inventory-item-list'
import { InventoryEntryForm } from '../components/inventory-scanner-entry-form'
import { InventoryScannerSidebar } from '../components/inventory-scanner-sidebar'

export const InventoryPage: React.FC = () => {
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        setSaving(true)
        setTimeout(() => {
            setSaving(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        }, 1200)
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left Panel: Scanner + Entry Form (~30%) */}
            <main className="flex-1 min-w-0 h-screen flex flex-col">
                <InventoryItemsList />
            </main>
            <aside className="w-[380px] shrink-0 border-r bg-card flex flex-col h-screen sticky top-0">
                {/* Scanner Section */}
                <InventoryScannerSidebar />

                {/* Entry Form below scanner */}
                <div className="flex-1 min-h-0 border-t">
                    <ScrollArea className="h-full">
                        <div className="p-5 space-y-6 pb-32">
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
                            <InventoryEntryForm />
                        </div>
                    </ScrollArea>
                </div>

                {/* Action Footer */}
                <div className="border-t bg-card p-3 px-5 flex items-center justify-between gap-2 shrink-0">
                    <AnimatePresence>
                        {saved && (
                            <motion.div
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-1 text-success text-[10px] font-medium"
                                exit={{ opacity: 0, x: -10 }}
                                initial={{ opacity: 0, x: -10 }}
                            >
                                <CheckCircle2 className="h-3 w-3" />
                                Saved
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {!saved && (
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            <span className="text-[10px] text-muted-foreground font-medium">
                                Ready
                            </span>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button
                            className="h-7 text-[11px] text-muted-foreground px-2"
                            size="sm"
                            variant="ghost"
                        >
                            <X className="mr-1 h-3 w-3" />
                            Cancel
                        </Button>
                        <Button
                            className="h-7 text-[11px] px-3"
                            disabled={saving}
                            onClick={handleSave}
                            size="sm"
                            variant="outline"
                        >
                            Save & Next
                        </Button>
                        <Button
                            className="h-7 text-[11px] px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={saving}
                            onClick={handleSave}
                            size="sm"
                        >
                            {saving && (
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            )}
                            {saving ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Right Panel: Items List (~70%) */}
        </div>
    )
}
