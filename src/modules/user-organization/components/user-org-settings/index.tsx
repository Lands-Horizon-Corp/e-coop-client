import { Path } from 'react-hook-form'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { useAuthUserWithOrg } from '@/modules/authentication/authgentication.store'
import { useUserOrganizationById } from '@/modules/user-organization'

import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'
import { Skeleton } from '@/components/ui/skeleton'

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

    useSubscribe('user_organization', `update.${id}`, refetch)

    return (
        <div className={cn('flex flex-col gap-y-4 flex-1 w-full', className)}>
            <div>
                <p className="text-lg">My Settings</p>
                <p className="text-muted-foreground text-sm">
                    Customize your ecoop operation settings for this current
                    branch
                </p>
            </div>
            {isPending && (
                <div className="w-full mx-auto space-y-6">
                    <div className="rounded-lg border border-border bg-muted p-5 space-y-4">
                        <div className="flex items-start gap-3">
                            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-5 w-44" />
                                <Skeleton className="h-3.5 w-72" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Skeleton className="h-3.5 w-20" />
                            <Skeleton className="h-16 w-full rounded-md" />
                        </div>
                        <div className="space-y-1.5">
                            <Skeleton className="h-3.5 w-12" />
                            <Skeleton className="h-20 w-full rounded-md" />
                        </div>
                    </div>

                    <div className="rounded-lg border border-border bg-muted p-5 space-y-4">
                        <div className="flex items-start gap-3">
                            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3.5 w-80" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-3.5 w-28" />
                            <Skeleton className="h-3.5 w-36" />
                        </div>
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>

                    <div className="rounded-lg border border-border bg-muted p-5 space-y-4">
                        <div className="flex items-start gap-3">
                            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-3.5 w-[90%]" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Skeleton className="h-3.5 w-10" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                            <div className="space-y-1.5">
                                <Skeleton className="h-3.5 w-20" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                            <div className="space-y-1.5">
                                <Skeleton className="h-3.5 w-14" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Skeleton className="h-3.5 w-24" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                            <div className="space-y-1.5">
                                <Skeleton className="h-3.5 w-24" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                            <div className="space-y-1.5">
                                <Skeleton className="h-3.5 w-28" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
