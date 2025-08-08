import { cn } from '@/lib'
import { useAuthUserWithOrg } from '@/store/user-auth-store'

import BranchSettingsForm from '@/components/forms/settings-forms/branch-settings-form'
import FormErrorMessage from '@/components/ui/form-error-message'

import { IClassProps } from '@/types'

interface Props extends IClassProps {}

const BranchSettings = ({ className }: Props) => {
    const {
        currentAuth: {
            user_organization: { branch, ...other },
        },
        updateCurrentAuth,
    } = useAuthUserWithOrg()

    return (
        <div className={cn('flex flex-col gap-y-4 flex-1 w-full', className)}>
            <div>
                <p className="text-lg">Branch Settings</p>
                <p className="text-muted-foreground text-sm">
                    Configure settings and preferences for your branch
                    operations.
                </p>
            </div>
            {branch && (
                <BranchSettingsForm
                    defaultValues={branch}
                    onSuccess={(data) =>
                        updateCurrentAuth({
                            user_organization: { ...other, branch: data },
                        })
                    }
                />
            )}
            {!branch && (
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
