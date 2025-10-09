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
                className={cn('', className)}
                href={`https://www.google.com/maps?q=${lat},${lon}`}
                ref={ref}
                target="_blank"
                {...props}
            />
        )
    }
)

OpenExternalMap.displayName = 'OpenExternalMap'

export default OpenExternalMap
