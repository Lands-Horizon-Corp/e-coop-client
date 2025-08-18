import { useEffect, useState } from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog'

import { cn } from '@/helpers/tw-utils' 

const ConnectionProvider = ({ interval = 10_000 }: { interval?: number }) => {
    const [isConnected, setIsConnected] = useState(true)

    useEffect(() => {
        const updateConnectionStatus = () => {
            setIsConnected(navigator.onLine)
        }

        const checkerFunction = setInterval(updateConnectionStatus, interval)

        window.addEventListener('online', updateConnectionStatus)
        window.addEventListener('offline', updateConnectionStatus)

        return () => {
            clearInterval(checkerFunction)
            window.removeEventListener('online', updateConnectionStatus)
            window.removeEventListener('offline', updateConnectionStatus)
        }
    }, [interval])

    return (
        <Dialog open={!isConnected}>
            <DialogContent
                hideCloseButton
                overlayClassName={cn(
                    'backdrop-blur ease-in-out ![animation-duration:1s]',
                    isConnected && 'backdrop-blur-none'
                )}
                onContextMenu={() => false}
                className="pointer-events-none flex max-w-[90vw] flex-col items-center !rounded-2xl shadow-center-md backdrop-blur focus:outline-none sm:w-fit sm:max-w-[32rem]"
            >
                <DialogTitle className="text-xl">Connection Lost</DialogTitle>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="none"
                    viewBox="0 0 32 32"
                    className="my-2 size-10 animate-spin text-primary [animation-duration:4s]"
                >
                    <g filter="url(#customFilter1)">
                        <path
                            fill="#000"
                            fillOpacity="0.05"
                            fillRule="evenodd"
                            d="M32 16c0-8.837-7.163-16-16-16S0 7.163 0 16s7.163 16 16 16 16-7.163 16-16zM5 16C5 9.925 9.925 5 16 5s11 4.925 11 11-4.925 11-11 11S5 22.075 5 16z"
                            clipRule="evenodd"
                        ></path>
                    </g>
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M16 5a2.5 2.5 0 010-5c8.837 0 16 7.163 16 16s-7.163 16-16 16c-4.32 0-8.241-1.713-11.12-4.496a2.5 2.5 0 113.337-3.721l.005-.005A10.965 10.965 0 0016 27c6.075 0 11-4.925 11-11S22.075 5 16 5z"
                        clipRule="evenodd"
                    ></path>
                    <defs>
                        <filter
                            id="customFilter1"
                            width="32"
                            height="33"
                            x="0"
                            y="0"
                            colorInterpolationFilters="sRGB"
                            filterUnits="userSpaceOnUse"
                        >
                            <feFlood
                                floodOpacity="0"
                                result="BackgroundImageFix"
                            ></feFlood>
                            <feBlend
                                in="SourceGraphic"
                                in2="BackgroundImageFix"
                                result="shape"
                            ></feBlend>
                            <feColorMatrix
                                in="SourceAlpha"
                                result="hardAlpha"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            ></feColorMatrix>
                            <feOffset></feOffset>
                            <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                            <feComposite
                                in2="hardAlpha"
                                k2="-1"
                                k3="1"
                                operator="arithmetic"
                            ></feComposite>
                            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"></feColorMatrix>
                            <feBlend
                                in2="shape"
                                result="customEffect1"
                            ></feBlend>
                            <feColorMatrix
                                in="SourceAlpha"
                                result="hardAlpha"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            ></feColorMatrix>
                            <feOffset></feOffset>
                            <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                            <feComposite
                                in2="hardAlpha"
                                k2="-1"
                                k3="1"
                                operator="arithmetic"
                            ></feComposite>
                            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"></feColorMatrix>
                            <feBlend
                                in2="customEffect1"
                                result="customEffect2"
                            ></feBlend>
                            <feColorMatrix
                                in="SourceAlpha"
                                result="hardAlpha"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            ></feColorMatrix>
                            <feOffset dy="1"></feOffset>
                            <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                            <feComposite
                                in2="hardAlpha"
                                k2="-1"
                                k3="1"
                                operator="arithmetic"
                            ></feComposite>
                            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0"></feColorMatrix>
                            <feBlend
                                in2="customEffect2"
                                result="customEffect3"
                            ></feBlend>
                        </filter>
                    </defs>
                </svg>
                <DialogDescription className="text-center font-normal">
                    <strong>Attention:</strong> Connection to the backend has
                    been lost. Please do not refresh the page. We are working to
                    reconnect. Thank you for your patience.
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

export default ConnectionProvider
