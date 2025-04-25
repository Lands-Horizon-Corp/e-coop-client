### TRANSACTION

- transaction batch (this will be the teller monitoring & transaction of the day tracking, this also contains the is closed when the teller has completed shit balance trans, this is also what blotter contains)

- General Ledger
    - payment type
        - payment
        - withdrawal
        - deposit
- checks entry
    - online checks entry
    - cash payment entry
- disbursements entry
- cash count (connect to trans batch)
- inter batch funding (record of money given to teller and given by whom in a specific batch)
- blotter
    - before terminate need papproval & signature
- cash/check voucher entry (lahat napupunta sa petty cash)
    - Payee table (Pay to ito)
    - may aproval ang cash check voucher
        - enum nang status check voucher
        - approve, print, release
- journal voucher (non cash transact, kung ano nasa system, yun yung itatransfer lang, not reflect in blotter, but reflect in ledger
- accounts - add icon (react icon)

### LOAN

- Loan Table
    - enum loan status (pending, approved, released)
    - loan comaker table
    - loan type enum
    - clearance analysis
    - other
        - appraised value
            - description
    - loan ledger table
