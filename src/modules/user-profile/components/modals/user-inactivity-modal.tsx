import { useEffect, useRef, useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { useSignOut } from '@/modules/authentication'
import { useAuthStore } from '@/modules/authentication/authgentication.store'
import { logger } from '@/modules/user-profile'

import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'

import { DEFAULT_AUTO_SIGNOUT_MODAL_DURATION } from '../../user-profile.constants'

export const UserInactivityPromptModal = ({
    title = 'Are you still there?',
    className,
    handleContinueSession,
    ...props
}: IModalProps & { handleContinueSession: () => void }) => {
    const { resetAuth } = useAuthStore()
    const [countdown, setCountdown] = useState(
        DEFAULT_AUTO_SIGNOUT_MODAL_DURATION
    )
    const isAutoLogoutRef = useRef(false)
    const hasLoggedOutRef = useRef(false)

    const handleContinue = () => {
        handleContinueSession?.()
    }

    const { mutate: handleSignout } = useSignOut({
        options: {
            onSuccess: () => {
                resetAuth()
                if (isAutoLogoutRef.current && !hasLoggedOutRef.current) {
                    hasLoggedOutRef.current = true
                    toast.info('You have been logged out due to inactivity.')
                }
            },
            onError: (error) => {
                const errorMessage = serverRequestErrExtractor({ error })
                logger.error(errorMessage)
            },
        },
    })

    const handleSignoutRef = useRef(handleSignout)

    useEffect(() => {
        handleSignoutRef.current = handleSignout
    }, [handleSignout])

    useEffect(() => {
        if (!props.open) {
            setCountdown(DEFAULT_AUTO_SIGNOUT_MODAL_DURATION)
            isAutoLogoutRef.current = false
            hasLoggedOutRef.current = false
            return
        }

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    isAutoLogoutRef.current = true
                    handleSignoutRef.current()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [props.open])

    useEffect(() => {}, [])

    return (
        <Modal
            className={cn('py-0', className)}
            closeButtonClassName="hidden"
            descriptionClassName="hidden"
            title={title}
            titleClassName="hidden"
            {...props}
        >
            <Empty className="">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <span className="text-4xl">⏱️</span>
                    </EmptyMedia>
                    <EmptyTitle>Are you still there?</EmptyTitle>
                    <p className="text-sm">
                        It&apos;s seems you have been inactive for a while.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Auto logout in{' '}
                        <span className="font-bold text-destructive">
                            {countdown}
                        </span>{' '}
                        seconds if no action is taken.
                    </p>
                </EmptyHeader>
                <EmptyContent>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => handleSignout()}
                            size="sm"
                            variant="outline"
                        >
                            Log Out
                        </Button>
                        <Button onClick={handleContinue} size="sm">
                            Continue Session
                        </Button>
                    </div>
                </EmptyContent>
            </Empty>
        </Modal>
    )
}
