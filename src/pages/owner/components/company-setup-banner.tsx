import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { BuildingIcon } from '@/components/icons'
import { CompanyCreateFormModal } from '@/components/forms'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import { useUserAuthStore } from '@/store/user-auth-store'

interface Props extends IClassProps {}

const CompanySetupBanner = ({ className }: Props) => {
    const queryClient = useQueryClient()
    const [modal, setModal] = useState(false)
    const { currentUser } = useUserAuthStore()

    return (
        <div
            className={cn(
                'flex max-w-3xl flex-col justify-center gap-y-3 rounded-xl border bg-secondary p-5 align-middle dark:bg-popover',
                className
            )}
        >
            <CompanyCreateFormModal
                open={modal}
                onOpenChange={setModal}
                formProps={{
                    disabledFields: ['ownerId'],
                    defaultValues: {
                        name: '',
                        contactNumber: '',
                        ownerId: currentUser?.id,
                    },
                    onSuccess: (newCompany) => {
                        queryClient.setQueryData(
                            ['owner', 'company', currentUser?.id],
                            newCompany
                        )
                    },
                }}
            />
            <p className="text-2xl font-medium">Setup your Company</p>
            <p className="text-sm text-foreground/75">
                Create your company to unlock the full potential of ECoop. Once
                your company is set up, you can easily manage branches,
                employees, and streamline your operations!
            </p>
            <Button
                onClick={() => setModal((val) => !val)}
                className="w-fit self-center"
            >
                Create Company <BuildingIcon className="ml-2" />
            </Button>
        </div>
    )
}

export default CompanySetupBanner
