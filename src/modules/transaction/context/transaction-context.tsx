import React, { createContext, useCallback, useContext, useEffect } from 'react'

import { FormProvider, UseFormReturn } from 'react-hook-form'

import { IGeneralLedger } from '@/modules/general-ledger'
import { IMemberProfile } from '@/modules/member-profile'
import { useGetUserSettings } from '@/modules/user-profile'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import { ITransaction } from '..'
import {
    UseTransactionControllerProps,
    useTransactionController,
    useTransactionFormLogic,
    useTransactionModals,
} from '../hooks/use-transaction-controller'
import { paymentORResolver } from '../transaction.utils'
import { TTransactionFormSchema } from '../transaction.validation'

type TModalState = ReturnType<typeof useModalState>

export interface ITransactionFeatureContext extends Partial<UseTransactionControllerProps> {
    // ID & Path
    transactionId: TEntityId
    fullPath: string
    // Form & Data
    form: UseFormReturn<TTransactionFormSchema>
    transaction?: IGeneralLedger
    getTransaction?: ITransaction
    selectedMember: IMemberProfile
    selectedMemberId?: TEntityId
    selectedAccountId?: TEntityId
    // Modals
    modals: {
        success: TModalState
        accountPicker: TModalState
        memberScanner: TModalState
        ledger: TModalState
        reverseRequest: TModalState
    }
    // Actions/Handlers
    handlers: {
        onPaymentSuccess: (transaction: IGeneralLedger) => void
        handleMemberOnClick: (member: IMemberProfile) => void
        resetForm: () => void
        handleRemoveMember: () => void
        resetTransactionForm: () => void
    }
    // Navigation
    navigate: {
        open: (id: TEntityId) => void
        clear: () => void
    }
    // Flags & Stores
    hasNoTransactionBatch: boolean
    currentTransactionBatch: any
    isTransactionMismatch: boolean
}

const TransactionFeatureContext =
    createContext<ITransactionFeatureContext | null>(null)

type TTransactipnProviderProps = {
    children: React.ReactNode
    transactionId: TEntityId
    fullPath: string
}
export const TransactionProvider = ({
    children,
    transactionId,
    fullPath,
}: TTransactipnProviderProps) => {
    const { payment_or_allow_user_input, userOrganization, ORWithPadding } =
        useGetUserSettings()

    const modals = useTransactionModals()

    const { form, syncOR } = useTransactionFormLogic({
        userOrganization,
        payment_or_allow_user_input,
        ORWithPadding,
    })

    // 2. Initialize Controller with access to the above
    const controller = useTransactionController({
        transactionId,
        fullPath,
        form,
        modals,
        userOrganization,
        payment_or_allow_user_input,
        ORWithPadding,
    })
    const resetTransactionForm = useCallback(() => {
        form.reset({
            member_join: undefined,
            member_profile: undefined,
            member_profile_id: undefined,
        })
        form.setValue('reference_number', paymentORResolver(userOrganization))
        form.setValue('or_auto_generated', !payment_or_allow_user_input)

        if (payment_or_allow_user_input) {
            form.setValue('reference_number', ORWithPadding)
        }
    }, [form, userOrganization, payment_or_allow_user_input, ORWithPadding])

    useEffect(() => {
        if (!payment_or_allow_user_input) {
            form.setValue('or_auto_generated', true)
            form.setValue(
                'reference_number',
                paymentORResolver(userOrganization)
            )
        } else {
            form.setValue('reference_number', ORWithPadding)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const value: ITransactionFeatureContext = {
        form,
        ...controller,
        transaction: controller.transaction,
        getTransaction: controller.getTransaction,
        selectedMember: form.getValues('member_profile'),
        selectedMemberId: form.getValues('member_profile_id'),
        modals: {
            success: modals.success,
            accountPicker: modals.accountPicker,
            memberScanner: modals.memberScanner,
            ledger: modals.ledger,
            reverseRequest: modals.othersCollapsible,
        },
        handlers: {
            ...controller.handlers,
            handleMemberOnClick: (member) =>
                form.setValue('member_profile', member),
            resetTransactionForm,
        },
        navigate: controller.navigate,
        hasNoTransactionBatch: controller.hasNoTransactionBatch,
        currentTransactionBatch: controller.currentTransactionBatch,
        isTransactionMismatch: false,
        userOrganization,
        payment_or_allow_user_input,
        ORWithPadding,
    }

    return (
        <TransactionFeatureContext.Provider value={value}>
            <FormProvider {...form}>{children}</FormProvider>
        </TransactionFeatureContext.Provider>
    )
}

export const useTransactionContext = () => {
    const context = useContext(TransactionFeatureContext)
    if (!context)
        throw new Error(
            'useTransactionFeature must be used within TransactionProvider'
        )
    return context
}
