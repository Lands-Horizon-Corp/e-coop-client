// import { useState } from 'react'

import TransactionBatch from '.'
import { Button } from '../ui/button'
import { LayersSharpDotIcon } from '../icons'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
// import { TransactionBatchCreateFormModal } from './transaction-batch-create-form'

// import { useAuthUser } from '@/store/user-auth-store'
// import { useTransactionBatchStore } from '@/store/transaction-batch-store'

import { IClassProps } from '@/types'
// import { toReadableDate } from '@/utils'

interface Props extends IClassProps {}

const TransactionBatchNavButton = (_props: Props) => {
    // const {
    //     currentAuth: { user },
    // } = useAuthUser()
    // } = useAuthUserWithOrgBranch<IEmployee>()
    // TODO: replace soon

    // const { data: transactionBatch } = useTransactionBatchStore()
    // const [createModal, setCreateModal] = useState(false)

    // if (!transactionBatch)
    //     return (
    //         <>
    //             <Button
    //                 variant="secondary"
    //                 hoverVariant="primary"
    //                 onClick={() => setCreateModal((prev) => !prev)}
    //                 className="group rounded-full text-foreground/70"
    //             >
    //                 <LayersSharpDotIcon className="mr-2 text-primary duration-300 group-hover:text-inherit" />
    //                 Start Batch
    //             </Button>
    //             <TransactionBatchCreateFormModal
    //                 open={createModal}
    //                 onOpenChange={setCreateModal}
    //                 formProps={{
    //                     defaultValues: {
    //                         name: `${user.user_name}'s-batch-${toReadableDate(new Date(), 'MM-dd-yyyy')}`.toLowerCase(),
    //                         // TODO: ONCE SWITCHER IS IMPLEMENTED
    //                         // branch_id: user_organization.branch_id,
    //                         // organization_id: user_organization.organization_id,
    //                     },
    //                 }}
    //             />
    //         </>
    //     )

    return (
        <Popover modal>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    hoverVariant="primary"
                    className="group rounded-full text-foreground/70"
                >
                    <LayersSharpDotIcon className="mr-2 text-primary duration-300 group-hover:text-inherit" />
                    Manage Batch
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="h-fit w-fit border-none bg-transparent p-0 shadow-none"
            >
                <TransactionBatch />
            </PopoverContent>
        </Popover>
    )
}

export default TransactionBatchNavButton
