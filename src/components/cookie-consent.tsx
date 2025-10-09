import { useEffect, useState } from 'react'

import CookieSvg from '@/assets/cookie-icon.svg'
import { cn } from '@/helpers/tw-utils'
import { addYears } from 'date-fns'
import Cookies from 'js-cookie'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import Image from './image'

const CookieConsent = () => {
    const [accepted, setAccepted] = useState(true)

    const onAccept = () => {
        const expirationDate = addYears(new Date(), 1)
        Cookies.set('ecoop-cookie-consent', 'true', {
            expires: expirationDate,
            path: '/',
            secure: true,
            sameSite: 'Lax',
        })

        setAccepted(true)
    }

    const loadCookie = () => {
        const val = Cookies.get('ecoop-cookie-consent')
        if (val) return setAccepted(true)
        return setAccepted(false)
    }

    useEffect(() => {
        loadCookie()
    }, [])

    return (
        <Alert
            className={cn(
                'fixed bottom-0 left-1/2 z-50 mb-3 flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-x-4 gap-y-4 rounded-xl bg-popover/95 text-center shadow-center-md backdrop-blur delay-150 duration-500 ease-in-out md:mb-6 lg:w-fit lg:max-w-none lg:flex-row lg:text-left',
                accepted && 'pointer-events-none opacity-0'
            )}
        >
            <span className="absolute -top-6 block size-fit rounded-full bg-secondary p-1 lg:static">
                <Image
                    alt="cookie"
                    className="size-9 lg:size-6"
                    src={CookieSvg}
                />
            </span>
            <AlertDescription className="pt-4 lg:pt-0">
                ECoop uses cookies to enhance the user experience.
            </AlertDescription>
            <Button
                className="w-full rounded-xl lg:w-fit"
                onClick={onAccept}
                variant="secondary"
            >
                I understand
            </Button>
        </Alert>
    )
}

export default CookieConsent
