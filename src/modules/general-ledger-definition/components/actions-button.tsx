import { useState } from 'react'

import { cn } from '@/helpers/tw-utils'
import { ArrowUpCircle, BookCheck, Pencil } from 'lucide-react'

import { Card } from '@/components/ui/card'

import GLCashFlowModal from './forms/gl-cash-flow-modal'
import GLPostModal from './forms/post-gl-accounts-modal'
import FSAccountModal from './forms/update-fs-account-modal'

const GLToolsBar = () => {
    const [activeModal, setActiveModal] = useState<string | null>(null)

    const actions = [
        {
            key: 'close-book',
            label: 'Close Book',
            description: 'Finalize the ledger for a selected year',
            icon: BookCheck,
        },
        {
            key: 'post-gl',
            label: 'Post / Unpost GL',
            description: 'Transfer journal entries to GL',
            icon: ArrowUpCircle,
        },
        {
            key: 'fs-accounts',
            label: 'Update FS Accounts',
            description: 'Modify financial statement mappings',
            icon: Pencil,
        },
    ]

    return (
        <>
            {/* Card Buttons */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 py-2 lg:grid-cols-3">
                {actions.map((action) => {
                    const Icon = action.icon

                    return (
                        <Card
                            className={cn(
                                'group flex flex-col gap-3 rounded-xl border p-3 text-left transition',
                                'hover:border-primary hover:bg-muted/40 hover:shadow-md'
                            )}
                            key={action.key}
                            onClick={() => setActiveModal(action.key)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon size={20} />
                                </div>

                                <span className="text-sm font-semibold">
                                    {action.label}
                                </span>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                {action.description}
                            </p>
                        </Card>
                    )
                })}
            </div>

            {/* Modals */}

            <GLCashFlowModal
                onOpenChange={(open) =>
                    setActiveModal(open ? 'close-book' : null)
                }
                open={activeModal === 'close-book'}
            />

            <GLPostModal
                onOpenChange={(open) => setActiveModal(open ? 'post-gl' : null)}
                open={activeModal === 'post-gl'}
            />

            <FSAccountModal
                onOpenChange={(open) =>
                    setActiveModal(open ? 'fs-accounts' : null)
                }
                open={activeModal === 'fs-accounts'}
            />
        </>
    )
}

export default GLToolsBar
