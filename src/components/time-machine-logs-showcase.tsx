import { ITimeMachineLog } from '@/modules/time-machine-log'

import TimeMachineLogDisplay from '../modules/time-machine-log/components/time-machine-log-display'

type Props = {
    logs: ITimeMachineLog[]
}

/**
 * Example component showing how to use TimeMachineLogDisplay
 *
 * Usage:
 * ```tsx
 * <TimeMachineLogDisplay log={timeMachineLog} />
 * ```
 *
 * Props:
 * - log: ITimeMachineLog (required)
 * - triggerClassName?: string - customize the trigger button
 * - contentClassName?: string - customize the popover content
 * - showDescription?: boolean - show/hide description (default: true)
 * - className?: string - wrapper div classes
 */
const TimeMachineLogsShowcase = ({ logs }: Props) => {
    return (
        <div className="space-y-4 p-4">
            <div>
                <h2 className="mb-4 text-lg font-bold">Time Machine Logs</h2>
                <div className="flex flex-wrap gap-3">
                    {logs.map((log) => (
                        <TimeMachineLogDisplay
                            key={log.id}
                            log={log}
                            triggerClassName="cursor-pointer"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TimeMachineLogsShowcase
