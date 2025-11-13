import { IAccount, TAccountType } from '@/modules/account'
import { IGeneralLedger } from '@/modules/general-ledger'

import { TEntityId } from '@/types'

export const getAccountTypePriority = (accountType: TAccountType) => {
    switch (accountType) {
        case 'Loan':
            return 1
        case 'Interest':
            return 2
        case 'SVF-Ledger':
            return 3
        case 'Fines':
            return 4
        default:
            return 5
    }
}

export const getLedgerUniqueAccounts = ({
    ledgerEntries = [],
}: {
    ledgerEntries: IGeneralLedger[]
}) => {
    const uniqueAccounts: Record<
        TEntityId,
        IAccount & { account_history_id: TEntityId }
    > = {}

    for (const record of ledgerEntries) {
        if (
            !uniqueAccounts[record.account_id] &&
            (record.account_id !== undefined || record.account_id !== null)
        ) {
            uniqueAccounts[record.account_id] = {
                ...record.account,
                account_history_id: record.account_history_id,
            }
        }
    }

    return {
        uniqueAccountsArray: Object.values(uniqueAccounts),
        uniqueAccountsMap: uniqueAccounts,
    }
}

// TEST DATA
// const ledgerEntries = [
//     // Initial loan disbursement
//     {
//         id: 'gl-001',
//         entry_date: '2025-01-15T09:00:00',
//         account_id: 'loan-principal-001',
//         account: {
//             id: 'loan-principal-001',
//             name: 'Loan Receivable - Principal',
//         },
//         debit: 50000,
//         credit: 0,
//         balance: 50000,
//         SPEC: true,
//     },
//     // Loan interest charge
//     {
//         id: 'gl-002',
//         entry_date: '2025-02-15T08:30:00',
//         account_id: 'loan-interest-001',
//         account: {
//             id: 'loan-interest-001',
//             name: 'Loan Receivable - Interest',
//         },
//         debit: 2500,
//         credit: 0,
//         balance: 2500,
//         SPEC: true,
//     },
//     // Payment applied to interest (full payment)
//     {
//         id: 'gl-003',
//         entry_date: '2025-02-15T14:00:00',
//         account_id: 'loan-interest-001',
//         account: {
//             id: 'loan-interest-001',
//             name: 'Loan Receivable - Interest',
//         },
//         debit: 0,
//         credit: 2500,
//         balance: 0,
//         SPEC: true,
//     },
//     // Payment applied to loan principal (1st payment)
//     {
//         id: 'gl-004',
//         entry_date: '2025-02-20T14:25:00',
//         account_id: 'loan-principal-001',
//         account: {
//             id: 'loan-principal-001',
//             name: 'Loan Receivable - Principal',
//         },
//         debit: 0,
//         credit: 3000,
//         balance: 47000,
//         SPEC: true,
//     },
//     // Payment applied to loan principal (2nd payment same day)
//     {
//         id: 'gl-004-b',
//         entry_date: '2025-02-20T16:15:00',
//         account_id: 'loan-principal-001',
//         account: {
//             id: 'loan-principal-001',
//             name: 'Loan Receivable - Principal',
//         },
//         debit: 0,
//         credit: 2000,
//         balance: 45000,
//         SPEC: true,
//     },
//     // Next month interest charge
//     {
//         id: 'gl-005',
//         entry_date: '2025-03-15T08:30:00',
//         account_id: 'loan-interest-001',
//         account: {
//             id: 'loan-interest-001',
//             name: 'Loan Receivable - Interest',
//         },
//         debit: 2250,
//         credit: 0,
//         balance: 2250,
//         SPEC: true,
//     },
//     // Payment applied to interest (1st payment - partial)
//     {
//         id: 'gl-006',
//         entry_date: '2025-03-25T15:50:00',
//         account_id: 'loan-interest-001',
//         account: {
//             id: 'loan-interest-001',
//             name: 'Loan Receivable - Interest',
//         },
//         debit: 0,
//         credit: 1000,
//         balance: 1250,
//         SPEC: true,
//     },
//     // Payment applied to interest (2nd payment same day - full payment)
//     {
//         id: 'gl-007',
//         entry_date: '2025-03-25T17:35:00',
//         account_id: 'loan-interest-001',
//         account: {
//             id: 'loan-interest-001',
//             name: 'Loan Receivable - Interest',
//         },
//         debit: 0,
//         credit: 1250,
//         balance: 0,
//         SPEC: true,
//     },
//     // April interest charge
//     {
//         id: 'gl-008',
//         entry_date: '2025-04-15T08:30:00',
//         account_id: 'loan-interest-001',
//         account: {
//             id: 'loan-interest-001',
//             name: 'Loan Receivable - Interest',
//         },
//         debit: 3000,
//         credit: 0,
//         balance: 3000,
//         SPEC: true,
//     },
//     // Multiple payments on April 20 - Interest payment 1 of 2
//     {
//         id: 'gl-009',
//         entry_date: '2025-04-20T10:30:00',
//         account_id: 'loan-interest-001',
//         account: {
//             id: 'loan-interest-001',
//             name: 'Loan Receivable - Interest',
//         },
//         debit: 0,
//         credit: 1500,
//         balance: 1500,
//         SPEC: true,
//     },
//     // Interest payment 2 of 2 (same day)
//     {
//         id: 'gl-010',
//         entry_date: '2025-04-20T16:30:00',
//         account_id: 'loan-interest-001',
//         account: {
//             id: 'loan-interest-001',
//             name: 'Loan Receivable - Interest',
//         },
//         debit: 0,
//         credit: 1500,
//         balance: 0,
//         SPEC: true,
//     },
//     // Principal payment 1 of 2 (same day)
//     {
//         id: 'gl-011',
//         entry_date: '2025-04-20T17:00:00',
//         account_id: 'loan-principal-001',
//         account: {
//             id: 'loan-principal-001',
//             name: 'Loan Receivable - Principal',
//         },
//         debit: 0,
//         credit: 3000,
//         balance: 42000,
//         SPEC: true,
//     },
//     // Principal payment 2 of 2 (same day)
//     {
//         id: 'gl-012',
//         entry_date: '2025-04-20T17:30:00',
//         account_id: 'loan-principal-001',
//         account: {
//             id: 'loan-principal-001',
//             name: 'Loan Receivable - Principal',
//         },
//         debit: 0,
//         credit: 2000,
//         balance: 40000,
//         SPEC: true,
//     },
// ]

// Normalize ledger entries for loan ledger table
export const loanNormalizeLedgerEntries = ({
    ledgerEntries,
}: {
    ledgerEntries: IGeneralLedger[]
}) => {
    // 1st step - unique by date
    const records: Record<string, IGeneralLedger[]> = {}
    for (const record of ledgerEntries) {
        const parsedDate = new Date(record.entry_date).toDateString()
        if (!records[parsedDate]) {
            records[parsedDate] = [record]
        } else {
            records[parsedDate].push(record)
        }
    }

    // step 2 - convert to array and sort by date
    const ledgerByDate: Array<{
        entry_date: string
        ledger: IGeneralLedger[]
    }> = []

    for (const [entry_date, ledger] of Object.entries(records)) {
        ledgerByDate.push({
            entry_date,
            ledger: ledger.sort(
                (a, b) =>
                    new Date(a.entry_date).getTime() -
                    new Date(b.entry_date).getTime()
            ),
        })
    }

    ledgerByDate.sort(
        (a, b) =>
            new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
    )

    // step 3 - unique accounts
    const { uniqueAccountsMap: uniqueAccounts } = getLedgerUniqueAccounts({
        ledgerEntries,
    })

    // step 4 - ledger by date
    const result: IGeneralLedger[] = []
    for (const entry of ledgerByDate) {
        const generalLedgerPaymentPerAccount: Record<
            TEntityId,
            IGeneralLedger[]
        > = {}

        entry.ledger.forEach((ldgr) => {
            if (generalLedgerPaymentPerAccount[ldgr.account_id]) {
                generalLedgerPaymentPerAccount[ldgr.account_id].push(ldgr)
            } else {
                generalLedgerPaymentPerAccount[ldgr.account_id] = [ldgr]
            }
        })

        const maxPayment = Object.values(generalLedgerPaymentPerAccount)
            .map((payments) => payments.length)
            .reduce((a, b) => Math.max(a, b), 0)

        Object.keys(generalLedgerPaymentPerAccount).forEach((accountId) => {
            if (generalLedgerPaymentPerAccount[accountId].length < maxPayment) {
                const missingPaymentsCount =
                    maxPayment -
                    generalLedgerPaymentPerAccount[accountId].length

                for (let i = 0; i < missingPaymentsCount; i++) {
                    generalLedgerPaymentPerAccount[accountId].push({
                        id: `ghost-${Math.random().toString(36).substring(2, 15)}`,
                        entry_date: new Date(entry.entry_date).toISOString(),
                        account_id: accountId,
                        account: uniqueAccounts[accountId],
                        account_history_id:
                            uniqueAccounts[accountId].account_history_id,
                        debit: 0,
                        credit: 0,
                        balance: 0,
                    } as unknown as IGeneralLedger)
                }
            }
        })

        const missingAccounts = Object.values(uniqueAccounts).filter(
            (acc) =>
                !Object.keys(generalLedgerPaymentPerAccount)
                    .map((act) => act)
                    .includes(acc.id)
        )

        for (const missingAcc of missingAccounts) {
            generalLedgerPaymentPerAccount[missingAcc.id] = []
            for (let i = 0; i < maxPayment; i++) {
                generalLedgerPaymentPerAccount[missingAcc.id].push({
                    id: `ghost-${Math.random().toString(36).substring(2, 15)}`,
                    entry_date: new Date(entry.entry_date).toISOString(),
                    account_id: missingAcc.id,
                    account: missingAcc,
                    account_history_id:
                        uniqueAccounts[missingAcc.id].account_history_id,
                    debit: 0,
                    credit: 0,
                    balance: 0,
                } as unknown as IGeneralLedger)
            }
        }

        for (const entry of Object.keys(generalLedgerPaymentPerAccount)) {
            generalLedgerPaymentPerAccount[entry].sort((a) => {
                return a.balance === 0 ? 1 : -1
            })
        }

        const generalLedgerPayments: IGeneralLedger[] = []
        const headers: IGeneralLedger[][] = []

        for (const entryValues of Object.keys(generalLedgerPaymentPerAccount)) {
            const head: IGeneralLedger[] = []

            generalLedgerPaymentPerAccount[entryValues].forEach((genLeg) => {
                head.push({
                    [`${entryValues}_credit`]: genLeg.credit,
                    [`${entryValues}_debit`]: genLeg.debit,
                    [`${entryValues}_balance`]: genLeg.balance,
                    ...(genLeg.entry_date ? genLeg : {}),
                } as unknown as IGeneralLedger)
            })

            headers.push(head)
        }

        for (let i = 0; i < maxPayment; i++) {
            let ledger: IGeneralLedger = {} as unknown as IGeneralLedger
            for (const header of headers) {
                ledger = { ...ledger, ...header[i] }
            }
            generalLedgerPayments.push(ledger)
            result.push({ ...ledger, entry_date: entry.entry_date })
        }
    }

    return result
}

export const loanNormalizeLedgerEntries2 = ({
    ledgerEntries: entries,
}: {
    ledgerEntries: IGeneralLedger[]
}) => {
    const groupedByDate = new Map<string, IGeneralLedger[]>()

    // Use your unique accounts helper
    const { uniqueAccountsMap } = getLedgerUniqueAccounts({
        ledgerEntries: entries,
    })

    // 1️⃣ Group by date (ignore time)
    for (const entry of entries) {
        const dateOnly = entry.entry_date.split('T')[0]
        if (!groupedByDate.has(dateOnly)) groupedByDate.set(dateOnly, [])
        groupedByDate.get(dateOnly)!.push(entry)
    }

    const result: Record<string, any>[] = []

    // 2️⃣ Process each date group
    for (const [_, dayEntries] of groupedByDate) {
        // Group entries by account id for that day
        const accountGroups = new Map<string, IGeneralLedger[]>()
        for (const e of dayEntries) {
            if (!accountGroups.has(e.account.id))
                accountGroups.set(e.account.id, [])
            accountGroups.get(e.account.id)!.push(e)
        }

        // 3️⃣ Build rows (split if debit+credit exist)
        const dayRows: Record<string, any>[] = []

        for (const [_, accEntries] of accountGroups) {
            const hasDebit = accEntries.some((e) => e.debit > 0)
            const hasCredit = accEntries.some((e) => e.credit > 0)

            if (hasDebit && hasCredit) {
                const debitRow = accEntries.filter((e) => e.debit > 0)
                const creditRow = accEntries.filter((e) => e.credit > 0)
                dayRows.push(...[debitRow, creditRow].map(buildRow))
            } else {
                dayRows.push(buildRow(accEntries))
            }
        }

        // 4️⃣ Each built row still must include ghost accounts
        for (const row of dayRows) {
            for (const accId of Object.keys(uniqueAccountsMap)) {
                const prefix = accId.replace(/\s+/g, '_').toLowerCase()
                if (!(`${prefix}_debit` in row)) {
                    row[`${prefix}_debit`] = 0
                    row[`${prefix}_credit`] = 0
                    row[`${prefix}_balance`] = 0
                }
            }

            result.push(row)
        }
    }

    // 5️⃣ Sort by entry date (chronologically)
    result.sort((a, b) => a.entry_date.localeCompare(b.entry_date))

    return result

    // 🧩 Helper to build one legal row
    function buildRow(entries: IGeneralLedger[]): Record<string, any> {
        const { entry_date, id, ...other } = entries[0]
        const row: Record<string, any> = { entry_date, id, ...other }

        for (const e of entries) {
            const prefix = e.account.id.replace(/\s+/g, '_').toLowerCase()
            row[`${prefix}_debit`] = e.debit
            row[`${prefix}_credit`] = e.credit
            row[`${prefix}_balance`] = e.balance
        }

        return row
    }
}
