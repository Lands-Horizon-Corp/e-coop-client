import { cn } from '@/lib'
import { useAuthUserWithOrg } from '@/store/user-auth-store'

import BranchSettingsForm from '@/components/forms/settings-forms/branch-settings-form'
import FormErrorMessage from '@/components/ui/form-error-message'

import { useAuthContext } from '@/hooks/api-hooks/use-auth'
import { useSubscribe } from '@/hooks/use-pubsub'

import { IClassProps } from '@/types'

interface Props extends IClassProps {}

const BranchSettings = ({ className }: Props) => {
    const {
        currentAuth: { user_organization },
        updateCurrentAuth,
    } = useAuthUserWithOrg()

    const { refetch } = useAuthContext({
        onSuccess: (data) => updateCurrentAuth(data),
    })

    useSubscribe(`branch.update.${user_organization.branch_id}`, () => {
        alert('changed')
        refetch()
    })

    return (
        <div className={cn('flex flex-col gap-y-4 flex-1 w-full', className)}>
            <div>
                <p className="text-lg">Branch Settings</p>
                <p className="text-muted-foreground text-sm">
                    Configure settings and preferences for your branch
                    operations.
                </p>
            </div>
            {user_organization.branch && (
                <BranchSettingsForm
                    resetOnDefaultChange
                    defaultValues={user_organization.branch}
                    onSuccess={(data) =>
                        updateCurrentAuth({
                            user_organization: {
                                ...user_organization,
                                branch: data,
                            },
                        })
                    }
                />
            )}
            {!user_organization.branch && (
                <>
                    <p className="text-xs text-muted-foreground">
                        Failed to load your branch info :{' '}
                        <FormErrorMessage
                            errorMessage={
                                'Your current authentication info does not have branch'
                            }
                        />
                    </p>
                </>
            )}
        </div>
    )
}

export default BranchSettings
