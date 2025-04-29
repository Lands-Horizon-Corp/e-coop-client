import { useState } from 'react'

import EcoopLogo from '@/components/ecoop-logo'
import StepIndicator from '@/components/steps-indicator'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import VerifyForm from '@/components/forms/auth-forms/verify-form'

import { IUserData } from '@/types'
import { IBaseProps } from '@/types/components'
import { useUserAuthStore } from '@/store/user-auth-store'
import { useSkipUserContactVerification } from '@/hooks/api-hooks/use-auth'

interface Props extends IBaseProps {
    readOnly?: boolean
    userData: IUserData

    onSkip: () => void
    onVerifyChange?: (newUserData: IUserData) => void
    onVerifyComplete?: (newUserData: IUserData) => void
}

const countCompleted = (userData: IUserData) => {
    let completed = 0

    if (userData.isEmailVerified) completed++
    if (userData.isContactVerified) completed++

    return completed
}

const VerifyRoot = ({
    userData,
    readOnly = false,
    onSkip,
    onVerifyChange,
    onVerifyComplete,
}: Props) => {
    const { setCurrentUser } = useUserAuthStore()
    const [userStoredData, setStoredUserData] = useState(userData)

    const completedCount = countCompleted(userStoredData)

    const { mutate: handleSkip, isPending: isSkipping } =
        useSkipUserContactVerification({
            onSuccess: (data) => {
                setCurrentUser(data)
                onSkip()
            },
        })

    if (completedCount === 2) {
        onVerifyComplete?.(userData)
        return
    }

    return (
        <div>
            <div className="my-5 flex w-full items-center gap-x-4">
                <EcoopLogo className="size-10" />
                <StepIndicator
                    totalSteps={2}
                    className="w-full"
                    currentStep={completedCount + 1}
                />
            </div>
            {!userStoredData.isContactVerified && !isSkipping && (
                <VerifyForm
                    key="1"
                    readOnly={readOnly}
                    verifyMode="mobile"
                    onSuccess={(data) => {
                        onVerifyChange?.(data)
                        setStoredUserData(data)
                    }}
                    onSkip={handleSkip}
                />
            )}
            {!userStoredData.isEmailVerified &&
                userStoredData.isContactVerified &&
                !isSkipping && (
                    <VerifyForm
                        key="2"
                        verifyMode="email"
                        readOnly={readOnly}
                        onSuccess={(data) => {
                            onVerifyChange?.(data)
                            setStoredUserData(data)
                        }}
                        onSkip={handleSkip}
                    />
                )}
            {isSkipping && <LoadingSpinner className="mx-auto" />}
        </div>
    )
}

export default VerifyRoot
