import { BugIcon, PlantGrowthIcon } from '@/components/icons'

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
            Icon: <PlantGrowthIcon />,
        },
        {
            text: 'Resolved a bug in the reporting feature.',
            updateStatus: UpdateStatus.BUG,
            Icon: <BugIcon />,
        },
    ],
}
