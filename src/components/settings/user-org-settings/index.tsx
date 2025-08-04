import { cn } from '@/lib'
import { useAuthUserWithOrg } from '@/store/user-auth-store'

import UserOrgSettingsForm, {
    TUserOrgSettingsFormValues,
} from '@/components/forms/settings-forms/user-org-settings-form'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'

import { useUserOrganiaztion } from '@/hooks/api-hooks/use-user-organization'

import { IClassProps } from '@/types'

interface Props extends IClassProps {}

const UserOrganizationSettings = ({ className }: Props) => {
    const {
        currentAuth: {
            user_organization: { id },
        },
        updateCurrentAuth,
    } = useAuthUserWithOrg()

    const {
        data: userOrganization,
        error,
        isPending,
        refetch,
    } = useUserOrganiaztion({ id })

    return (
        <div className={cn('flex flex-col gap-y-4 flex-1 w-full', className)}>
            <div>
                <p className="text-lg">My Settings</p>
                <p className="text-muted-foreground text-sm">
                    Customize your ecoop operation settings for this current
                    branch
                </p>
            </div>
            {isPending && <LoadingSpinner className="mx-auto" />}
            {!isPending && userOrganization && (
                <UserOrgSettingsForm
                    mode="current"
                    defaultValues={
                        userOrganization as TUserOrgSettingsFormValues
                    }
                    onSuccess={(data) =>
                        updateCurrentAuth({ user_organization: data })
                    }
                />
            )}
            {error && (
                <>
                    <p className="text-xs text-muted-foreground">
                        Failed to load your info :{' '}
                        <FormErrorMessage errorMessage={error} />
                    </p>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => refetch()}
                    >
                        Retry
                    </Button>
                </>
            )}
        </div>
    )
}

export default UserOrganizationSettings
