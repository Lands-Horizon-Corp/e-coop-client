import { forwardRef } from 'react'

import { cn } from '@/helpers/tw-utils'

import { IBaseProps } from '@/types'

interface Props extends IBaseProps {
    lon: number
    lat: number
}

const OpenExternalMap = forwardRef<HTMLAnchorElement, Props>(
    ({ lon, lat, className, ...props }, ref) => {
        return (
            <a
                ref={ref}
                href={`https://www.google.com/maps?q=${lat},${lon}`}
                target="_blank"
                className={cn('', className)}
                {...props}
            />
        )
    }
)

OpenExternalMap.displayName = 'OpenExternalMap'

export default OpenExternalMap
