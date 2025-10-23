import React, { useState } from 'react'

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/components/ui/input-group'

import { EyeIcon, EyeOffIcon } from '../icons'
import { InputProps } from './input'

interface Props extends Omit<InputProps, 'type'> {
    defaultVisibility?: boolean
}

const PasswordInput = React.forwardRef<HTMLInputElement, Props>(
    (
        { className, disabled, defaultVisibility = false, ...props }: Props,
        ref
    ) => {
        const [visible, setVisible] = useState(defaultVisibility)

        const VisibilityIcon = visible ? EyeIcon : EyeOffIcon

        return (
            <InputGroup className={className}>
                <InputGroupInput
                    ref={ref}
                    {...props}
                    disabled={disabled}
                    type={visible ? 'text' : 'password'}
                />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton
                        aria-label={visible ? 'Hide password' : 'Show password'}
                        disabled={disabled}
                        onClick={() => setVisible((prev) => !prev)}
                        size="icon-xs"
                        variant="ghost"
                    >
                        <VisibilityIcon className="size-4" />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        )
    }
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
