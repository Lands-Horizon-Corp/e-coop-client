import { FaBug } from 'react-icons/fa'
import { TbGrowth } from 'react-icons/tb'

import { SoftwareUpdates, UpdateStatus } from '@/types'

export const softwareUpdates: SoftwareUpdates = {
    name: 'e-Coop Beta',
    version: 'v0.0.1',
    description: 'Updated version with performance improvements.',
    date: new Date('2024-09-15'),
    updates: [
        {
            text: 'Improved loading times by optimizing database queries.',
            updateStatus: UpdateStatus.GENERAL,
            Icon: <TbGrowth />,
        },
        {
            text: 'Resolved a bug in the reporting feature.',
            updateStatus: UpdateStatus.BUG,
            Icon: <FaBug />,
        },
    ],
}
