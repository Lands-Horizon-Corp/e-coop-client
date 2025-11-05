import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import {
    IAccount,
    IAccountRequest,
    IAccountRequestSchema,
    TAccountFormValues,
    useCreate,
    useUpdateById,
} from '@/modules/account'
import AccountHistorySheet from '@/modules/account-history/forms/account-history-sheet'
import { AccountTagsManagerPopover } from '@/modules/account-tag/components/account-tag-management'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import { LoadingSpinnerIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import AccountContentForm from './account-content-form'
import AccountHeaderForm, {
    AccountGlSourceVisibility,
} from './account-header-form'
import LoanConnectAccountSection from './sections/loan-connect-account-section'

export interface IAccountCreateUpdateFormProps
    extends IClassProps,
        IForm<Partial<IAccountRequest>, IAccount, string, TAccountFormValues> {
    accountId?: TEntityId
}

const AccountCreateUpdateForm = ({
    className,
    accountId,
    ...formProps
}: IAccountCreateUpdateFormProps) => {
    const { currentAuth } = useAuthUserWithOrgBranch()
    const organizationId = currentAuth.user_organization.organization_id
    const branchId = currentAuth.user_organization.branch_id

    const form = useForm<TAccountFormValues>({
        resolver: standardSchemaResolver(IAccountRequestSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            show_in_general_ledger_source_withdraw: true,
            show_in_general_ledger_source_deposit: true,
            show_in_general_ledger_source_journal: true,
            show_in_general_ledger_source_payment: true,
            show_in_general_ledger_source_adjustment: true,
            show_in_general_ledger_source_journal_voucher: true,
            show_in_general_ledger_source_check_voucher: true,
            compassion_fund: false,
            compassion_fund_amount: 0,
            icon: 'Money Bag',
            computation_type: 'Straight',
            type: 'Other',
            currency_id:
                currentAuth.user_organization.branch.branch_setting.currency_id,
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreate({
        options: {
            onSuccess: formProps.onSuccess,
        },
    })

    const updateMutation = useUpdateById({
        options: {
            onSuccess: (newData) => {
                formProps.onSuccess?.(newData)
                form.reset(newData as unknown as IAccountRequest)
            },
        },
    })

    const { formRef, handleFocusError, isDisabled, firstError } =
        useFormHelper<TAccountFormValues>({
            form,
            ...formProps,
            autoSave: accountId !== undefined,
        })

    const onSubmit = form.handleSubmit((data: TAccountFormValues) => {
        const request = {
            branch_id: branchId,
            organization_id: organizationId,
            ...data,
        }
        if (accountId) {
            updateMutation.mutate({ id: accountId, payload: request })
        } else {
            createMutation.mutate(request)
        }
    }, handleFocusError)

    const { error: errorResponse, isPending: isLoading } = accountId
        ? updateMutation
        : createMutation

    const error =
        serverRequestErrExtractor({ error: errorResponse }) || firstError

    return (
        <Form {...form}>
            <form
                className={cn('w-full', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <div className="absolute top-4 inline-flex space-x-2 right-10">
                    {accountId && (
                        <>
                            {' '}
                            <AccountHistorySheet accountId={accountId} />
                            <AccountTagsManagerPopover
                                accountId={accountId}
                                size="sm"
                            />
                        </>
                    )}
                    <AccountGlSourceVisibility
                        form={form}
                        isDisabled={isDisabled}
                        isLoading={isLoading}
                    />
                </div>

                <FormErrorMessage errorMessage={error} />
                <AccountHeaderForm
                    form={form}
                    isDisabled={isDisabled}
                    isReadOnly={formProps.readOnly}
                />
                <div className="flex gap-x-2">
                    <AccountContentForm form={form} isDisabled={isDisabled} />
                    <LoanConnectAccountSection
                        className="my-2 w-[240px]"
                        form={form}
                    />
                </div>
                {!formProps.readOnly && (
                    <div className="space-y-2 sticky bottom-0">
                        <div className="flex items-center justify-end gap-x-2">
                            <Button
                                className="w-full self-end px-8 sm:w-fit"
                                disabled={isLoading}
                                onClick={() => {
                                    form.reset()
                                }}
                                size="sm"
                                type="button"
                                variant="ghost"
                            >
                                Reset
                            </Button>
                            <Button
                                className=""
                                disabled={isLoading}
                                type="submit"
                            >
                                {isLoading ? (
                                    <div className="flex space-x-2">
                                        {accountId ? 'updating ' : 'Creating '}{' '}
                                        <LoadingSpinnerIcon
                                            className="ml-2 animate-spin"
                                            size={18}
                                        />
                                    </div>
                                ) : (
                                    `${accountId ? 'Update' : 'Create'} Account `
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </Form>
    )
}

export const AccountCreateUpdateFormModal = ({
    title = 'Create Account',
    description = 'Fill out the form to add a new account',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IAccountCreateUpdateFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-[99vw]', className)}
            description={description}
            title={title}
            {...props}
        >
            <AccountCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                }}
            />
        </Modal>
    )
}

export default AccountCreateUpdateFormModal
