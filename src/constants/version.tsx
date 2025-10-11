import { SoftwareUpdates } from '@/modules/feedback'

import { BugIcon, PlantGrowthIcon } from '@/components/icons'

import { APP_VERSION } from './envs'

export const softwareUpdates: SoftwareUpdates = {
    name: 'e-Coop Beta',
    version: `v${APP_VERSION}`,
    description: 'Updated version with performance improvements.',
    date: new Date('2024-09-15'),
    updates: [
        {
            text: 'Improved loading times by optimizing database queries.',
            updateStatus: 'general',
            Icon: <PlantGrowthIcon />,
        },
        {
            text: 'Resolved a bug in the reporting feature.',
            updateStatus: 'bug',
            Icon: <BugIcon />,
        },
    ],
}
