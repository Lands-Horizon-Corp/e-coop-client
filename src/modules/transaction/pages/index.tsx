import PermissionGuard from '@/modules/permission/components/permission-guard'
import {
    TransactionCurrentPaymentEntry,
    TransactionModalSuccessPayment,
} from '@/modules/transaction'
import TransactionMemberScanner from '@/modules/transaction/components/transaction-member-scanner'

import PageContainer from '@/components/containers/page-container'

import { TEntityId } from '@/types'

import TransactionAccountMemberLedger from '../components/tables/transaction-account-member-ledger'
import { TransactionProvider } from '../context/transaction-context'

type TTransactionProps = {
    transactionId: TEntityId
    fullPath: string
}

// const Transaction = ({ transactionId, fullPath }: TTransactionProps) => {
//     const queryClient = useQueryClient()

//     const {
//         openSuccessModal,
//         transactionFormSuccess,
//         setOpenSuccessModal,
//         setSelectedAccountId,
//         setTransactionFormSuccess,
//     } = useTransactionStore()

//     const { payment_or_allow_user_input, userOrganization, ORWithPadding } =
//         useGetUserSettings()

//     const transactionForm = useForm<z.infer<typeof TransactionFromSchema>>({
//         resolver: standardSchemaResolver(TransactionFromSchema),
//         defaultValues: {
//             reference_number: paymentORResolver(userOrganization),
//             or_auto_generated: false,
//         },
//     })

//     const {
//         selectedMember,
//         selectedMemberId,
//         isTransactionMismatchCurrentBatch,
//         navigate,
//         hasNoTransactionBatch,
//         currentTransactionBatch,
//         accountPickerModalState,
//         isOpen,
//         modalData,
//         onClose,
//         memberModalState,
//     } = useTransactionController({
//         fullPath,
//         transactionId,
//         transactionForm,
//         userOrganization,
//         payment_or_allow_user_input,
//         ORWithPadding,
//         setOpenSuccessModal,
//         setTransactionFormSuccess,
//         setSelectedAccountId,
//     })

//     useSubscribe(
//         `member_occupation_history.create.member_profile.${selectedMember}`
//     )
//     useSubscribe(
//         `member_occupation_history.update.member_profile.${selectedMember}`
//     )
//     useSubscribe(
//         `member_occupation_history.delete.member_profile.${selectedMember}`
//     )
//     useSubscribe(`transaction.create.${transactionId}`)
//     useSubscribe(`transaction.update.${transactionId}`)

//     const handleOnSuccessPaymentCallBack = (transaction: IGeneralLedger) => {
//         if (!transaction) return

//         setTransactionFormSuccess(transaction)
//         setOpenSuccessModal(true)
//         setSelectedAccountId(undefined)

//         transactionForm.reset(
//             {
//                 ...transactionForm.getValues(),
//                 member_profile: transaction.member_profile,
//                 member_profile_id: transaction.member_profile_id,
//             },
//             {
//                 keepDirty: false,
//                 keepTouched: false,
//             }
//         )
//     }

//     return (
//         <div>
//             <PermissionGuard
//                 action={['Read', 'Create', 'Update']}
//                 conditionLogic="all"
//                 resourceType="Transaction"
//             >
//                 <TransactionReverseRequestFormModal
//                     formProps={{
//                         onSuccess: () => {
//                             toast.success('success request verification')
//                             modalData?.onSuccess?.()
//                         },
//                     }}
//                     onOpenChange={onClose}
//                     open={isOpen}
//                     title={modalData?.title || 'Request Reverse Transaction'}
//                 />
//                 {/* {selectedMember && (
//                 <LoanPicker
//                     memberProfileId={selectedMember.id}
//                     modalState={loanPickerState}
//                     mode="member-profile"
//                     triggerClassName="hidden"
//                 />
//             )} */}
//                 <PageContainer className="flex h-fit lg:h-[90vh] w-full overflow-hidden!">
//                     <TransactionModalSuccessPayment
//                         isOpen={openSuccessModal}
//                         onClose={handleCloseSuccessModal}
//                         onOpenChange={(newState) => {
//                             if (!newState) {
//                                 accountPickerModalState.onOpenChange(true)
//                             }
//                             setOpenSuccessModal(newState)
//                         }}
//                         open={openSuccessModal}
//                         transaction={transactionFormSuccess}
//                     />
//                     <div className="flex h-full flex-col lg:flex-row w-full gap-2 overflow-hidden">
//                         {/* Left Section (Payment) */}
//                         <div className="w-full lg:w-[40%] ecoop-scroll pr-px flex flex-col overflow-y-auto">
//                             <TransactionCurrentPaymentEntry
//                                 form={transactionForm}
//                                 fullPath={fullPath}
//                                 totalAmount={transaction?.amount}
//                                 transaction={transaction as ITransaction}
//                                 transactionId={transactionId}
//                             />
//                             {transactionId && (
//                                 <Button
//                                     className="w-full mb-2"
//                                     onClick={(e) => {
//                                         e.preventDefault()
//                                         navigate.open(transactionId)
//                                         queryClient.resetQueries({
//                                             queryKey: ['transaction'],
//                                         })
//                                     }}
//                                     size="sm"
//                                     variant="outline"
//                                 >
//                                     <ResetIcon className="mr-2" />
//                                     reset current transaction
//                                 </Button>
//                             )}
//                         </div>
//                         {/* Right Section (Ledger Table) */}
//                         <div className="flex-1 flex flex-col p-2 rounded-2xl bg-background ecoop-scroll overflow-y-auto">
//                             <TransactionMemberScanner
//                                 memberModalState={memberModalState}
//                                 form={transactionForm}
//                                 fullPath={fullPath}
//                                 handleRemoveMember={() => {
//                                     navigate.clear()
//                                     transactionForm.reset()
//                                 }}
//                                 transactionId={transactionId}
//                             />
//                             <TransactionAccountMemberLedger
//                                 memberProfileId={selectedMemberId as TEntityId}
//                                 onRowClick={(data) => {
//                                     if (!currentTransactionBatch) {
//                                         return toast.warning(
//                                             'You do not have an active transaction batch. Please create a transaction batch to proceed.'
//                                         )
//                                     }

//                                     // if (data.original.account?.type === 'Loan') {
//                                     //     return loanPickerState.onOpenChange(true)
//                                     // }

//                                     if (
//                                         data.original.account.currency_id !==
//                                         currentTransactionBatch?.currency_id
//                                     ) {
//                                         return toast.warning(
//                                             'The account currency does not match the current transaction batch currency.'
//                                         )
//                                     }

//                                     transactionForm.setValue(
//                                         'account',
//                                         data.original.account
//                                     )
//                                     transactionForm.setValue(
//                                         'account_id',
//                                         data.original.account_id
//                                     )
//                                 }}
//                             />
//                         </div>
//                     </div>
//                     {/* bottom Section (transaction  Payment) */}
//                 </PageContainer>
//                 {selectedMemberId && !isTransactionMismatchCurrentBatch && (
//                     <PaymentWithTransactionForm
//                         accountPickerModalState={accountPickerModalState}
//                         currentTransactionBatch={currentTransactionBatch}
//                         handleResetTransaction={() => {
//                             navigate.clear()
//                         }}
//                         memberJointId={transactionForm.getValues(
//                             'member_join_id'
//                         )}
//                         memberProfileId={transactionForm.getValues(
//                             'member_profile_id'
//                         )}
//                         onSuccess={(transaction) => {
//                             queryClient.invalidateQueries({
//                                 queryKey: [
//                                     'member-accounting-ledger',
//                                     'filtered-paginated',
//                                     'member',
//                                     selectedMemberId,
//                                 ],
//                             })
//                             queryClient.invalidateQueries({
//                                 queryKey: ['transaction'],
//                             })
//                             queryClient.invalidateQueries({
//                                 queryKey: [
//                                     'general-ledger',
//                                     'filtered-paginated',
//                                     'transaction',
//                                 ],
//                                 exact: false,
//                             })
//                             // handleSetTransactionId({
//                             //     transactionId: transaction.transaction_id,
//                             //     fullPath,
//                             // })
//                             navigate.open(transactionId)
//                             handleOnSuccessPaymentCallBack(transaction)
//                         }}
//                         readOnly={!hasNoTransactionBatch}
//                         transaction={transaction}
//                         transactionForm={transactionForm}
//                         transactionId={transactionId}
//                     />
//                 )}
//             </PermissionGuard>
//         </div>
//     )
// }
const Transaction = ({ transactionId, fullPath }: TTransactionProps) => {
    return (
        <PermissionGuard
            resourceType="Transaction"
            action={['Read', 'Create', 'Update']}
        >
            <TransactionProvider
                transactionId={transactionId}
                fullPath={fullPath}
            >
                <PageContainer className="flex h-fit lg:h-[90vh] w-full overflow-hidden!">
                    <TransactionModalSuccessPayment
                        isOpen={openSuccessModal}
                        onClose={handleCloseSuccessModal}
                        onOpenChange={(newState) => {
                        if (!newState) {
                            accountPickerModalState.onOpenChange(true)
                        }
                        setOpenSuccessModal(newState)
                    }}
                        open={openSuccessModal}
                        transaction={transactionFormSuccess}
                    />
                    <div className="flex h-full flex-col lg:flex-row w-full gap-2 overflow-hidden">
                        <aside className="w-full ecoop-scroll lg:w-[40%] flex flex-col overflow-y-auto">
                            <TransactionCurrentPaymentEntry />
                            {/* <ResetCurrentTransactionButton /> */}
                        </aside>

                        {/* Right: Scanner & Ledger */}
                        <main className="flex-1 flex flex-col p-2 bg-background overflow-y-auto">
                            <TransactionMemberScanner />
                            <TransactionAccountMemberLedger />
                        </main>
                    </div>
                </PageContainer>
                {selectedMemberId && !isTransactionMismatchCurrentBatch && (
                    <PaymentWithTransactionForm
                        accountPickerModalState={accountPickerModalState}
                    currentTransactionBatch={currentTransactionBatch}
                        handleResetTransaction={() => {
                            handleSetTransactionId({ fullPath })
                        }}
                        memberJointId={transactionForm.getValues(
                            'member_join_id'
                        )}
                        memberProfileId={transactionForm.getValues(
                            'member_profile_id'
                        )}
                        onSuccess={(transaction) => {
                            queryClient.invalidateQueries({
                                queryKey: [
                                    'member-accounting-ledger',
                                    'filtered-paginated',
                                    'member',
                                    selectedMemberId,
                                ],
                            })
                            queryClient.invalidateQueries({
                                queryKey: ['transaction'],
                            })
                            queryClient.invalidateQueries({
                                queryKey: [
                                    'general-ledger',
                                    'filtered-paginated',
                                    'transaction',
                                ],
                                exact: false,
                            })
                            handleSetTransactionId({
                                transactionId: transaction.transaction_id,
                                fullPath,
                            })
                            handleOnSuccessPaymentCallBack(transaction)
                        }}
                        readOnly={!hasNoTransactionBatch}
                        transaction={transaction}
                        transactionForm={transactionForm}
                        transactionId={transactionId}
                    />
                )}
            </PermissionGuard>
        </div>
    )
}

export default Transaction
