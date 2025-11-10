import { Path } from 'react-hook-form'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { useAuthUserWithOrg } from '@/modules/authentication/authgentication.store'
import { useUserOrganizationById } from '@/modules/user-organization'

import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'

import { useSubscribe } from '@/hooks/use-pubsub'

import { IClassProps } from '@/types'

import UserOrgSettingsForm, {
    TUserOrgSettingsFormValues,
} from '../forms/user-org-settings-form'

interface Props extends IClassProps {}

const UserOrganizationSettings = ({ className }: Props) => {
    const {
        currentAuth: {
            user_organization: { id, user_type },
        },
        updateCurrentAuth,
    } = useAuthUserWithOrg()

    const {
        data: userOrganization,
        error: rawError,
        isPending,
        refetch,
    } = useUserOrganizationById({ id })

    const error = serverRequestErrExtractor({ error: rawError })

    useSubscribe(`user_organization.update.${id}`, refetch)

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
                    defaultValues={
                        userOrganization as TUserOrgSettingsFormValues
                    }
                    disabledFields={[
                        ...((user_type !== 'owner'
                            ? ['time_machine_time']
                            : []) as Path<TUserOrgSettingsFormValues>[]),
                    ]}
                    mode="current"
                    onSuccess={(data) =>
                        updateCurrentAuth({ user_organization: data })
                    }
                    resetOnDefaultChange
                />
            )}
            {error && (
                <>
                    <p className="text-xs text-muted-foreground">
                        Failed to load your info :{' '}
                        <FormErrorMessage errorMessage={error} />
                    </p>
                    <Button
                        onClick={() => refetch()}
                        size="sm"
                        variant="secondary"
                    >
                        Retry
                    </Button>
                </>
            )}
        </div>
    )
}

export default UserOrganizationSettings
