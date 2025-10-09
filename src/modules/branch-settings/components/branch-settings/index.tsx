import { useCallback } from 'react'

import { cn } from '@/helpers'
import { IAuthContext, useAuthContext } from '@/modules/authentication'
import { useAuthUserWithOrg } from '@/modules/authentication/authgentication.store'

import FormErrorMessage from '@/components/ui/form-error-message'

import { useSubscribe } from '@/hooks/use-pubsub'
import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'

import { IClassProps } from '@/types'

import BranchSettingsForm from '../forms/branch-settings-form'

interface Props extends IClassProps {}

const BranchSettings = ({ className }: Props) => {
    const {
        currentAuth: { user_organization },
        updateCurrentAuth,
    } = useAuthUserWithOrg()

    const { refetch, isError, error, isSuccess, data } = useAuthContext({})

    const onSuccess = useCallback(
        (data: IAuthContext) => {
            updateCurrentAuth(data)
        },
        [updateCurrentAuth]
    )

    useQeueryHookCallback({
        data,
        error,
        isError,
        isSuccess,
        onSuccess,
    })

    useSubscribe(`branch.update.${user_organization.branch_id}`, () => {
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
                    defaultValues={user_organization.branch.branch_setting}
                    onSuccess={(data) =>
                        updateCurrentAuth({
                            user_organization: {
                                ...user_organization,
                                branch: {
                                    ...user_organization.branch,
                                    branch_setting: data,
                                },
                            },
                        })
                    }
                    resetOnDefaultChange
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
