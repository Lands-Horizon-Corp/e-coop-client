export const TIME_MACHINE_REASON_OPTIONS = [
    'Wrong posting date was selected for a journal entry correction',
    'Loan amortization simulation is complete and must return to live dates',
    'Interest accrual backtesting window has ended',
    'End-of-day cash reconciliation is finalized',
    'Month-end closing checks are done; revert to real-time accounting',
    'Regulatory report snapshot has been generated successfully',
    'Treasury cash position validation has finished',
    'Payment batch reprocessing for a prior date is complete',
    'Deposit maturity date scenario testing has been completed',
    'Delinquency aging analysis run is finished',
    'General ledger trial balance verification under simulated date is complete',
    'Member withdrawal cutoff simulation has ended',
    'Penalty and fee computation validation is done',
    'Foreign exchange revaluation test window has closed',
    'Audit trail review requires resuming current timestamp integrity',
    'Fraud/risk alert investigation requires live transaction timing',
    'Settlement and clearing cycle has moved to current business day',
    'Liquidity ratio stress-test session is complete',
    'Backdated voucher approval workflow has been validated',
    'Compliance team requested immediate return to current system time',
    'Manual correction after selecting the wrong date/time',
    'End-of-day reconciliation is finished and normal time should resume',
    'Temporary audit window has ended',
    'QA or testing session is complete',
    'Migration/data backfill task is done',
    'Debugging scenario has been resolved',
    'User reported confusion due to non-current timestamps',
    'Scheduled access duration has expired',
    'Security policy requires immediate rollback to real time',
    'Compliance review requires live timestamp integrity',
    'Potential fraud/risk investigation requires current-time operations',
    'Cashiering/payment posting needs real-time validation',
    'Batch process dependent on current date/time is starting',
    'Timezone configuration was incorrect and must be reset',
    'Duplicate or overlapping time machine session was created',
    'Requested simulation objective has been achieved',
    'Supervisor/admin requested forced termination',
    'Performance issues detected while time machine is active',
    'Data consistency checks failed under simulated time',
    'Emergency operational incident requires real-time mode',
    'Blotter balancing verification is in progress',
] as const

export type TTimeMachineReasonOption =
    (typeof TIME_MACHINE_REASON_OPTIONS)[number]

export const timeLeft = (
    startTime: Date,
    currentTime: Date,
    totalSeconds: number
): number => {
    const elapsedMs = currentTime.getTime() - startTime.getTime()
    const elapsedSeconds = elapsedMs / 1000
    const remaining = totalSeconds - elapsedSeconds

    return Math.max(0, Math.floor(remaining))
}

export const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60

    return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':')
}
