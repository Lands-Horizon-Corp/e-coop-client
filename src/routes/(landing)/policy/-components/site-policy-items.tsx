import React, { forwardRef } from 'react'

import { LinkIcon } from '@/components/icons'

type SitePolicyItemProps = {
    title: string
    id: string
    children?: React.ReactNode
    onClick?: () => void
}

const SitePolicyItem = forwardRef<HTMLDivElement, SitePolicyItemProps>(
    ({ title, id, children, onClick }, ref) => {
        return (
            <div
                className="mb-4 border   rounded-lg p-4 w-full"
                id={id}
                ref={ref}
            >
                <h2 className="text-xl font-bold flex items-center pb-2">
                    <span
                        className="mr-2 cursor-pointer text-gray-400 "
                        title={`Copy link to section "${title}"`}
                    >
                        <LinkIcon
                            className="hover:opacity-100 opacity-100"
                            onClick={onClick}
                        />
                    </span>
                    <span className="group">{title}</span>
                </h2>
                {children}
            </div>
        )
    }
)

export default SitePolicyItem
