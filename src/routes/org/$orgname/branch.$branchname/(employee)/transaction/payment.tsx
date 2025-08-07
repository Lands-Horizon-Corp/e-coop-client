import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import {
    usePaymentsDataStore,
    usePaymentsModalStore,
} from '@/store/transaction/payments-entry-store'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

import PageContainer from '@/components/containers/page-container'
import { DisbursementTransactionCreateFormModal } from '@/components/forms/disbursement-transaction-create-form'
import CreateTransactionFormModal from '@/components/forms/transaction-forms/create-transaction-form'
import { MoneyIcon, TransactionListIcon, XIcon } from '@/components/icons'
import MemberAccountingLedger from '@/components/member-infos/member-accounts-loans/member-accounting-ledger'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Label } from '@/components/ui/label'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { useShortcut } from '@/components/use-shorcuts'

import { useGetTransactionById } from '@/hooks/api-hooks/use-transaction'
import { useUpdateReferenceNumber } from '@/hooks/api-hooks/use-transaction'
import { useSubscribe } from '@/hooks/use-pubsub'

import { IGeneralLedger, TEntityId } from '@/types'

import TransactionPaymentEntryModal from '../../../../../../components/forms/transaction-forms/create-payments-entry-form'
import QuickTransactionEntryModal from '../../../../../../components/forms/transaction-forms/quick-create-payment-transaction-form'
import CurrentPaymentsEntry from './-components/current-payments-entry'
import TransactionCardList from './-components/current-transaction'
import MemberProfileTransactionView from './-components/member-profile-view-card'
import PaymentSuccessModal from './-components/payment-succes-modal'
import ReferenceNumber from './-components/reference-number-field'
import TransactionActions from './-components/transaction-actions'

const updateTransactionOR = z.object({
    reference_number: z.string().min(1, 'Reference number is required'),
    description: z.string().max(250, 'Description is required'),
})

type FormValues = z.infer<typeof updateTransactionOR>
type TransactionSearch = {
    transactionId: TEntityId
}

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/payment'
)({
    validateSearch: (search: Record<string, unknown>): TransactionSearch => {
        return {
            transactionId: String(search?.transactionId ?? ''),
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const queryClient = useQueryClient()
    const { transactionId } = Route.useSearch()

    const navigate = useNavigate({ from: Route.fullPath })
    const [onOpenToast, setOnOpenToast] = useState(false)
    const [transactionFormSuccess, setTransactionFormSuccess] =
        useState<IGeneralLedger | null>(null)
    const {
        selectedMember,
        setSelectedMember,
        setFocusTypePayment,
        focusTypePayment,
    } = usePaymentsDataStore()

    const { setOpenPaymentsEntryModal, openPaymentsEntryModal } =
        usePaymentsModalStore()

    const [openTransactionEntryModal, setOpenTransactionEntryModal] =
        useState(false)

    const [openDepositEntryModal, setOpenQuickPaymentEntryModal] =
        useState(false)

    const [openDisbursementEntryModal, setOpenDisbursementEntryModal] =
        useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(updateTransactionOR),
        defaultValues: {
            reference_number: '',
            description: '',
        },
    })

    const {
        mutate: updateReferenceNumber,
        isPending: isLoadingUpdateReferenceNumber,
    } = useUpdateReferenceNumber()

    const { data: transaction } = useGetTransactionById({
        transactionId,
        enabled: !!transactionId,
        onSuccess: (transaction) => {
            form.setValue(
                'reference_number',
                transaction?.reference_number || ''
            )
            form.setValue('description', transaction?.description || '')
        },
    })

    const referenceNumber = transaction?.reference_number || ''
    const description = transaction?.description || ''

    const onSubmit = form.handleSubmit((values: FormValues) => {
        if (transaction) {
            updateReferenceNumber({
                transactionId: transaction.id,
                reference_number: values.reference_number,
                description: values.description,
            })
        }
    })

    const handleResetForm = () => {
        form.reset({
            reference_number: referenceNumber || '',
            description: description || '',
        })
    }

    const referenceNotEqual = form.watch('reference_number') !== referenceNumber
    const descriptionNotEqual = form.watch('description') !== description

    const quickPaymentTitle = (
        <div className="flex items-center">
            <MoneyIcon className="mr-2" />
            <span className="font-bold">{`${focusTypePayment?.charAt(0).toUpperCase()}${focusTypePayment?.slice(1)}`}</span>
        </div>
    )

    useSubscribe(
        `member_occupation_history.create.member_profile.${selectedMember?.id}`
    )
    useSubscribe(
        `member_occupation_history.update.member_profile.${selectedMember?.id}`
    )
    useSubscribe(
        `member_occupation_history.delete.member_profile.${selectedMember?.id}`
    )
    useShortcut(
        'alt+q',
        () => {
            setOpenTransactionEntryModal(true)
        },
        {
            disableTextInputs: true,
        }
    )
    useShortcut(
        'alt+w',
        () => {
            setOpenQuickPaymentEntryModal(true)
            setFocusTypePayment('withdraw')
        },
        {
            disableTextInputs: true,
        }
    )
    useShortcut(
        'alt+d',
        () => {
            setOpenQuickPaymentEntryModal(true)
            setFocusTypePayment('deposit')
        },
        {
            disableTextInputs: true,
        }
    )

    const HandleNewTransaction = () => {
        setOnOpenToast(false)
        setOpenTransactionEntryModal(true)
        setSelectedMember(transaction?.member_profile || null)
        setOnOpenToast(false)
        navigate({
            to: Route.fullPath,
            search: {
                transactionId: '',
            },
        })
    }

    const HandleUseCurrentMember = () => {
        setOnOpenToast(false)
        setSelectedMember(transaction?.member_profile || null)
        setOnOpenToast(false)
        setOpenPaymentsEntryModal(true)
    }

    return (
        <PageContainer className="flex h-[110vh] min-h-[100vh] items-center w-full">
            <PaymentSuccessModal
                open={onOpenToast}
                onOpenChange={setOnOpenToast}
                transaction={transactionFormSuccess}
                newTransaction={HandleNewTransaction}
                currentMember={HandleUseCurrentMember}
            />
            <TransactionPaymentEntryModal
                onOpenChange={setOpenPaymentsEntryModal}
                open={openPaymentsEntryModal}
                className="max-w-3xl"
                formProps={{
                    transactionId: transactionId,
                    transaction: transaction,
                    onSuccess(transaction) {
                        setOpenPaymentsEntryModal(false)
                        setSelectedMember(null)

                        queryClient.invalidateQueries({
                            queryKey: [
                                'current-transaction-list',
                                'current-transaction',
                            ],
                        })
                        queryClient.invalidateQueries({
                            queryKey: [
                                'general-ledger-based-on-transaction',
                                transactionId,
                            ],
                        })

                        queryClient.invalidateQueries({
                            queryKey: ['get-transaction-by-id', transactionId],
                        })

                        queryClient.invalidateQueries({
                            queryKey: [
                                'general-ledger',
                                'resource-query',
                                transactionId,
                            ],
                        })

                        setTransactionFormSuccess(transaction)
                        setOnOpenToast(true)
                    },
                }}
            />
            <CreateTransactionFormModal
                open={openTransactionEntryModal}
                onOpenChange={setOpenTransactionEntryModal}
                formProps={{
                    member_id: selectedMember?.id,
                    onSuccess(transaction) {
                        setOpenTransactionEntryModal(false)
                        navigate({
                            to: Route.fullPath,
                            search: {
                                transactionId: transaction.id,
                            },
                        })
                    },
                }}
            />
            <QuickTransactionEntryModal
                open={openDepositEntryModal}
                title={quickPaymentTitle}
                onOpenChange={setOpenQuickPaymentEntryModal}
                formProps={{
                    transaction: transaction,
                    onSuccess() {
                        setOpenQuickPaymentEntryModal(false)
                        setSelectedMember(null)

                        queryClient.invalidateQueries({
                            queryKey: ['current-transaction-list'],
                        })
                        queryClient.invalidateQueries({
                            queryKey: ['get-transaction-by-id', transactionId],
                        })
                    },
                }}
            />
            <DisbursementTransactionCreateFormModal
                open={openDisbursementEntryModal}
                onOpenChange={setOpenDisbursementEntryModal}
                formProps={{
                    // disbursementId: transaction?.disbursement_id,
                    onSuccess() {
                        setOpenDisbursementEntryModal(false)
                        setSelectedMember(null)
                    },
                }}
            />

            {!transactionId && (
                <div className=" w-full lg:w-[90%] mx-auto  p-5">
                    <div className="flex items-center">
                        <TransactionListIcon size={25} className="mr-2" />
                        <Label className="text-2xl">Current Transaction</Label>
                    </div>
                    <TransactionActions
                        paymentOnClick={() => {
                            setFocusTypePayment('')
                            setOpenTransactionEntryModal(true)
                        }}
                        depositOnClick={() => {
                            setFocusTypePayment('deposit')
                            setOpenQuickPaymentEntryModal(true)
                        }}
                        withdrawOnClick={() => {
                            setFocusTypePayment('withdraw')
                            setOpenQuickPaymentEntryModal(true)
                        }}
                        disbursementLabel="Disbursement"
                        disbursementOnClick={() => {
                            setFocusTypePayment('disbursement')
                            setOpenDisbursementEntryModal(true)
                        }}
                    />
                    <TransactionCardList fullPath={Route.fullPath} />
                </div>
            )}
            {transactionId && (
                <ResizablePanelGroup
                    direction="horizontal"
                    className="h-full w-full !flex-col gap-4 md:!flex-row"
                >
                    <ResizablePanel defaultSize={70} minSize={10}>
                        <ResizablePanelGroup direction="vertical">
                            <ResizablePanel
                                defaultSize={50}
                                maxSize={50}
                                className="p-2"
                            >
                                <div className="flex w-full min-w-[30vw] flex-col gap-y-2">
                                    <Form {...form}>
                                        <form onSubmit={onSubmit}>
                                            <div className="flex justify-between items-center space-y-2 px-2 flex-col w-full">
                                                <FormFieldWrapper
                                                    className="grow"
                                                    control={form.control}
                                                    name="reference_number"
                                                    label="Reference Number"
                                                    labelClassName="text-xs font-medium text-muted-foreground"
                                                    render={({ field }) => (
                                                        <ReferenceNumber
                                                            {...field}
                                                            id={field.name}
                                                            placeholder="Reference Number"
                                                            autoComplete="reference-number"
                                                            value={
                                                                field.value ||
                                                                referenceNumber ||
                                                                ''
                                                            }
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            disabled={
                                                                !referenceNotEqual &&
                                                                !transaction
                                                            }
                                                        />
                                                    )}
                                                />
                                                <div className="flex w-full space-x-2">
                                                    <FormFieldWrapper
                                                        control={form.control}
                                                        name="description"
                                                        className="grow "
                                                        label="Description"
                                                        labelClassName="text-xs font-medium text-muted-foreground"
                                                        render={({ field }) => (
                                                            <div className="flex space-x-2 ">
                                                                <Textarea
                                                                    {...field}
                                                                    id={
                                                                        field.name
                                                                    }
                                                                    value={
                                                                        field.value ||
                                                                        description ||
                                                                        ''
                                                                    }
                                                                    autoComplete="off"
                                                                    className="grow h-10 min-h-10 resize-none"
                                                                    placeholder="Description"
                                                                />
                                                                <div className="flex space-x-1">
                                                                    <Button
                                                                        variant="destructive"
                                                                        className=""
                                                                        disabled={
                                                                            !referenceNotEqual &&
                                                                            !descriptionNotEqual
                                                                        }
                                                                        size="icon"
                                                                        onClick={() =>
                                                                            handleResetForm()
                                                                        }
                                                                    >
                                                                        <XIcon className="" />
                                                                    </Button>
                                                                    {(referenceNotEqual ||
                                                                        descriptionNotEqual) && (
                                                                        <Button
                                                                            variant="secondary"
                                                                            className=""
                                                                            type="submit"
                                                                            disabled={
                                                                                isLoadingUpdateReferenceNumber
                                                                            }
                                                                        >
                                                                            {isLoadingUpdateReferenceNumber ? (
                                                                                <LoadingSpinner className="animate-spin" />
                                                                            ) : (
                                                                                'save'
                                                                            )}
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </form>
                                    </Form>
                                    {transaction?.member_profile && (
                                        <MemberProfileTransactionView
                                            memberInfo={
                                                transaction.member_profile
                                            }
                                        />
                                    )}

                                    <TransactionActions
                                        paymentLabel="Add Payment"
                                        paymentOnClick={() => {
                                            setFocusTypePayment('')
                                            setOpenPaymentsEntryModal(true)
                                        }}
                                        depositOnClick={() => {
                                            setFocusTypePayment('deposit')
                                            setOpenQuickPaymentEntryModal(true)
                                        }}
                                        withdrawOnClick={() => {
                                            setFocusTypePayment('withdraw')
                                            setOpenQuickPaymentEntryModal(true)
                                        }}
                                    />
                                </div>
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={60} className="p-2">
                                <div className="w-full min-w-[30vw] p-2">
                                    <ScrollArea className="ecoop-scroll w-full overflow-auto py-2">
                                        <CurrentPaymentsEntry
                                            totalAmount={transaction?.amount}
                                            transactionId={transactionId}
                                        />
                                    </ScrollArea>
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                    <ResizableHandle withHandle className="hidden md:flex" />
                    <ResizablePanel
                        defaultSize={40}
                        minSize={10}
                        className="!flex-col p-2 md:!flex-row"
                    >
                        <div className="w-full p-2">
                            {transaction?.member_profile_id && (
                                <MemberAccountingLedger
                                    memberProfileId={
                                        transaction?.member_profile_id
                                    }
                                />
                            )}
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            )}
        </PageContainer>
    )
}
