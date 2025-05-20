import { Button } from '../ui/button'
import { LayersSharpDotIcon } from '../icons'

import { IClassProps } from '@/types'

interface Props extends IClassProps {}

const TransactionBatchNavButton = (_props: Props) => {
    return (
        <>
            <Button
                variant="secondary"
                hoverVariant="primary"
                className="group rounded-full"
            >
                <LayersSharpDotIcon className="mr-2 text-primary duration-300 group-hover:text-inherit" />
                Start Batch
            </Button>
        </>
    )
}

export default TransactionBatchNavButton
