import React, { useState } from 'react'

import { FiEye, FiEyeOff } from 'react-icons/fi'

import { Input, InputProps } from '@/components/ui/input'

import { cn } from '@/lib/utils'

interface Props extends Omit<InputProps, 'type'> {}

const PasswordInput = React.forwardRef<HTMLInputElement, Props>(
    ({ className, disabled, ...props }: Props, ref) => {
        const [visible, setVisible] = useState(false)

        const VisibilityIcon = visible ? FiEye : FiEyeOff

        return (
            <div className={cn('relative w-full', className)}>
                <Input
                    ref={ref}
                    {...props}
                    disabled={disabled}
                    className={className}
                    type={visible ? 'text' : 'password'}
                />
                <VisibilityIcon
                    onClick={() => setVisible((prev) => !prev)}
                    className={cn(
                        'absolute right-4 top-1/2 size-4 -translate-y-1/2 cursor-pointer',
                        disabled && 'opacity-80'
                    )}
                />
            </div>
        )
    }
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
