import { useRef } from 'react'

import { AccountCreateUpdateFormModal } from '@/modules/account'

import { ChevronDownIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

import { AccountList } from '../components/account-list'
import { useAccountContext } from '../context/account-provider'

const AccountWrapper = () => {
    const accountListRef = useRef<HTMLDivElement | null>(null)

    const scrollTo = (direction: 'up' | 'down') => {
        const container = accountListRef.current
        if (!container) return

        container.scrollTo({
            top: direction === 'up' ? 0 : container.scrollHeight,
            behavior: 'smooth',
        })
    }
    const { settings_payment_type_default_value, createModal } =
        useAccountContext()

    return (
        <div
            className="flex w-full flex-col ecoop-scroll h-screen overflow-y-auto items-start gap-4"
            ref={accountListRef}
        >
            <AccountCreateUpdateFormModal
                className=" min-w-[80vw] max-w-[80vw]"
                formProps={{
                    defaultValues: {
                        default_payment_type_id:
                            settings_payment_type_default_value?.id,
                        default_payment_type:
                            settings_payment_type_default_value,
                    },
                }}
                {...createModal}
            />
            <AccountList />
            <div className="fixed bottom-20 right-6 flex flex-col gap-2 z-50">
                <Button
                    className="rounded-full shadow-lg border border-border h-10 w-10"
                    onClick={() => scrollTo('up')}
                    size="icon"
                    variant="secondary"
                >
                    <ChevronDownIcon className="h-5 w-5 rote-180" />
                </Button>
                <Button
                    className="rounded-full shadow-lg border border-border h-10 w-10"
                    onClick={() => scrollTo('down')}
                    size="icon"
                    variant="secondary"
                >
                    <ChevronDownIcon className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}

export default AccountWrapper
