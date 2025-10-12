import { cn } from '@/helpers'

import { ArrowUpLongIcon } from '../icons'

type ArrowSize =
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'

interface TripleArrowProps {
    size?: ArrowSize
    className?: string
}
const sizeConfig = {
    xs: { iconClass: 'size-6', spacing: '5px' },
    sm: { iconClass: 'size-8', spacing: '7px' },
    md: { iconClass: 'size-12', spacing: '10px' },
    lg: { iconClass: 'size-16', spacing: '14px' },
    xl: { iconClass: 'size-20', spacing: '14px' },
    '2xl': { iconClass: 'size-26', spacing: '22px' },
    '3xl': { iconClass: 'size-32', spacing: '27px' },
    '4xl': { iconClass: 'size-42', spacing: '34px' },
    '5xl': { iconClass: 'size-52', spacing: '42px' },
    '6xl': { iconClass: 'size-64', spacing: '50px' },
    '7xl': { iconClass: 'size-72', spacing: '58px' },
    '8xl': { iconClass: 'size-84', spacing: '66px' },
    '9xl': { iconClass: 'size-96', spacing: '74px' },
    '10xl': { iconClass: 'size-112', spacing: '84px' },
}

const TripleArrow: React.FC<TripleArrowProps> = ({
    size = 'lg',
    className,
}) => {
    const config = sizeConfig[size]

    return (
        <div
            className={cn('relative', className)}
            style={
                {
                    '--arrow-spacing': config.spacing,
                    height: `calc(${config.iconClass.split('-')[1]} * 0.25rem + 2 * var(--arrow-spacing))`,
                    width: `calc(${config.iconClass.split('-')[1]} * 0.25rem)`,
                } as React.CSSProperties
            }
        >
            <div
                className="absolute left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-primary/0 via-primary/20 to-primary/40 rounded-tl-full rounded-se-full pointer-events-none overflow-hidden"
                style={{
                    top: `calc(${config.iconClass.split('-')[1]} * 0.25rem * 0.43)`,
                    width: `calc(${config.iconClass.split('-')[1]} * 0.25rem * 0.47)`,
                    height: `calc(100vh - ${config.iconClass.split('-')[1]} * 0.25rem * 0.43)`,
                    maxHeight: `calc(100vh - ${config.iconClass.split('-')[1]} * 0.25rem * 0.43)`,
                    zIndex: -1,
                }}
            />

            <ArrowUpLongIcon
                className={cn(
                    'absolute top-0 left-0 text-primary z-10 brightness-150 ',
                    config.iconClass
                )}
            />
            <ArrowUpLongIcon
                className={cn(
                    'absolute left-0 text-primary brightness-100  delay-200',
                    config.iconClass
                )}
                style={{ top: 'var(--arrow-spacing)' } as React.CSSProperties}
            />
            <ArrowUpLongIcon
                className={cn(
                    'absolute left-0 text-primary brightness-75  delay-300',
                    config.iconClass
                )}
                style={
                    {
                        top: 'calc(2 * var(--arrow-spacing))',
                    } as React.CSSProperties
                }
            />
        </div>
    )
}
export default TripleArrow
