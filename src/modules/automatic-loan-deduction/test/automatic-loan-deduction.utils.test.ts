// import { expect, test } from "bun:test";
// import { computation } from ".";
// import { testArray } from "./test";
// import type { AutomaticLoanDeductionEntry, LoanTransacton } from "./types";
// testArray.forEach(({ ald, lt, result }, index) => {
//   const testNumber = index + 1;
//   test(`Test ${testNumber}/${testArray.length}`, () => {
//     const computed = computation(ald, lt);
//     // Bun's expect gives you better output than console.assert
//     expect(computed).toBe(result);
//   });
// });
import { describe, expect, it } from 'vitest'

import { computation } from '../'

const def = {
    charges_percentage_1: 0,
    charges_percentage_2: 0,
    anum: 0,
    charges_amount: 0,
    charges_divisor: 0,
    max_amount: 0,
    min_amount: 0,
    number_of_months: 0,
}

describe('%1 SUITE', () => {
    it('charges_percentage_1: 4, add on: false, number_of_months: 0, anum: 0, charges_amount: 0, charges_divisor: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_1: 4,
                    number_of_months: 0,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(200)
    })

    it('charges_percentage_1: 4, add on: true, number_of_months: 0, anum: 0, charges_amount: 0, charges_divisor: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_1: 4,
                    number_of_months: 0,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(50)
    })

    it('charges_percentage_1: 4, add on: false, number_of_months: 6, anum: 0, charges_amount: 0, charges_divisor: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_1: 4,
                    number_of_months: 6,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(1200)
    })

    it('charges_percentage_1: 4, add on: true, number_of_months: 6, anum: 0, charges_amount: 0, charges_divisor: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_1: 4,
                    number_of_months: 6,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(1200)
    })

    it('charges_percentage_1: 4, add on: false, number_of_months: 6, anum: 1, charges_amount: 0, charges_divisor: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_1: 4,
                    number_of_months: 6,
                    anum: 1,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(100)
    })

    it('charges_percentage_1: 4, add on: true, number_of_months: 6, anum: 1, charges_amount: 0, charges_divisor: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_1: 4,
                    number_of_months: 6,
                    anum: 1,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(100)
    })

    it('charges_percentage_1: 4, add on: false, number_of_months: 6, anum: 4, charges_amount: 0, charges_divisor: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_1: 4,
                    number_of_months: 6,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(100)
    })

    it('charges_percentage_1: 4, add on: true, number_of_months: 6, anum: 4, charges_amount: 0, charges_divisor: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_1: 4,
                    number_of_months: 6,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(100)
    })

    it('charges_percentage_1: 4, add on: false, number_of_months: 6, anum: 4, charges_divisor: 2, charges_amount: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_1: 4,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 2,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0)
    })

    it('charges_percentage_1: 4, add on: true, number_of_months: 6, anum: 4, charges_divisor: 2, charges_amount: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_1: 4,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 2,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0)
    })

    it('charges_percentage_1: 4, add on: false, number_of_months: 6, anum: 4, charges_divisor: 1000, charges_amount: 15, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_1: 4,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(1.5)
    })

    it('charges_percentage_1: 4, add on: true, number_of_months: 6, anum: 4, charges_divisor: 1000, charges_amount: 15, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_1: 4,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(1.5)
    })

    it('charges_percentage_1: 4, charges_percentage_2: 2, add on: false, number_of_months: 6, anum: 4, charges_divisor: 1000, charges_amount: 15', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_1: 4,
                    charges_percentage_2: 2,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(1.5)
    })

    it('charges_percentage_1: 4, charges_percentage_2: 2, add on: true, number_of_months: 6, anum: 4, charges_divisor: 1000, charges_amount: 15', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_1: 4,
                    charges_percentage_2: 2,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0.75)
    })

    it('charges_percentage_1: 4, charges_percentage_2: 2, add on: false, number_of_months: 6, anum: 4, charges_amount: 15, charges_divisor: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_1: 4,
                    charges_percentage_2: 2,
                    number_of_months: 6,
                    anum: 4,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(100) // <-- fill this value
    })

    it('charges_percentage_1: 4, charges_percentage_2: 2, add on: true, number_of_months: 6, anum: 4, charges_amount: 15, charges_divisor: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_1: 4,
                    charges_percentage_2: 2,
                    number_of_months: 6,
                    anum: 4,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(50) // <-- fill this value
    })
})

describe('%2 SUITE', () => {
    it('charges_percentage_2: 4, add on: false, number_of_months: 0, anum: 0, charges_amount: 0, charges_divisor: 0, charges_percentage_1: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_2: 4,
                    number_of_months: 0,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0)
    })

    it('charges_percentage_2: 4, add on: true, number_of_months: 0, anum: 0, charges_amount: 0, charges_divisor: 0, charges_percentage_1: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_2: 4,
                    number_of_months: 0,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(200)
    })

    it('charges_percentage_2: 4, add on: false, number_of_months: 6, anum: 0, charges_amount: 0, charges_divisor: 0, charges_percentage_1: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_2: 4,
                    number_of_months: 6,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0)
    })

    it('charges_percentage_2: 4, add on: true, number_of_months: 6, anum: 0, charges_amount: 0, charges_divisor: 0, charges_percentage_1: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_2: 4,
                    number_of_months: 6,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(1200)
    })

    it('charges_percentage_2: 4, add on: false, number_of_months: 6, anum: 1, charges_amount: 0, charges_divisor: 0, charges_percentage_1: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_2: 4,
                    number_of_months: 6,
                    anum: 1,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0)
    })

    it('charges_percentage_2: 4, add on: true, number_of_months: 6, anum: 1, charges_amount: 0, charges_divisor: 0, charges_percentage_1: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_2: 4,
                    number_of_months: 6,
                    anum: 1,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(100)
    })

    it('charges_percentage_2: 4, add on: false, number_of_months: 6, anum: 4, charges_amount: 0, charges_divisor: 0, charges_percentage_1: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_2: 4,
                    number_of_months: 6,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0)
    })

    it('charges_percentage_2: 4, add on: true, number_of_months: 6, anum: 4, charges_amount: 0, charges_divisor: 0, charges_percentage_1: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_2: 4,
                    number_of_months: 6,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(100)
    })

    it('charges_percentage_2: 4, add on: false, number_of_months: 6, anum: 4, charges_divisor: 2, charges_amount: 0, charges_percentage_1: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_2: 4,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 2,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0)
    })

    it('charges_percentage_2: 4, add on: true, number_of_months: 6, anum: 4, charges_divisor: 2, charges_amount: 0, charges_percentage_1: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_2: 4,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 2,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0)
    })

    it('charges_percentage_2: 4, add on: false, number_of_months: 6, anum: 4, charges_divisor: 1000, charges_amount: 15, charges_percentage_1: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_2: 4,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(37.5)
    })

    it('charges_percentage_2: 4, add on: true, number_of_months: 6, anum: 4, charges_divisor: 1000, charges_amount: 15, charges_percentage_1: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_2: 4,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(1.5)
    })

    it('charges_percentage_2: 4, charges_percentage_1: 2, add on: false, number_of_months: 6, anum: 4, charges_divisor: 1000, charges_amount: 15', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_2: 4,
                    charges_percentage_1: 2,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0.75)
    })

    it('charges_percentage_2: 4, charges_percentage_1: 2, add on: true, number_of_months: 6, anum: 4, charges_divisor: 1000, charges_amount: 15', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_2: 4,
                    charges_percentage_1: 2,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(1.5)
    })

    it('charges_percentage_2: 4, charges_percentage_1: 2, add on: false, number_of_months: 6, anum: 4, charges_amount: 15, charges_divisor: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_2: 4,
                    charges_percentage_1: 2,
                    number_of_months: 6,
                    anum: 4,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(50)
    })

    it('charges_percentage_2: 4, charges_percentage_1: 2, add on: true, number_of_months: 6, anum: 4, charges_amount: 15, charges_divisor: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_percentage_2: 4,
                    charges_percentage_1: 2,
                    number_of_months: 6,
                    anum: 4,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(100)
    })
})

describe('Amount SUITE', () => {
    it('charges_amount: 15, add on: false, number_of_months: 0, anum: 0, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_amount: 15,
                    number_of_months: 0,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(15)
    })

    it('charges_amount: 15, add on: true, number_of_months: 0, anum: 0, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_amount: 15,
                    number_of_months: 0,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(15)
    })

    it('charges_amount: 15, add on: false, number_of_months: 6, anum: 0, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_amount: 15,
                    number_of_months: 6,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(15)
    })

    it('charges_amount: 15, add on: true, number_of_months: 6, anum: 0, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_amount: 15,
                    number_of_months: 6,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(15)
    })

    it('charges_amount: 15, add on: false, number_of_months: 6, anum: 1, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_amount: 15,
                    number_of_months: 6,
                    anum: 1,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(15)
    })

    it('charges_amount: 15, add on: true, number_of_months: 6, anum: 1, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_amount: 15,
                    number_of_months: 6,
                    anum: 1,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(15)
    })

    it('charges_amount: 15, add on: false, number_of_months: 6, anum: 4, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_amount: 15,
                    number_of_months: 6,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(15)
    })

    it('charges_amount: 15, add on: true, number_of_months: 6, anum: 4, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_amount: 15,
                    number_of_months: 6,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(15)
    })

    it('charges_amount: 15, add on: false, number_of_months: 6, anum: 4, charges_divisor: 2, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_amount: 15,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 2,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(18_750)
    })

    it('charges_amount: 15, add on: true, number_of_months: 6, anum: 4, charges_divisor: 2, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_amount: 15,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 2,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(18_750)
    })

    it('charges_amount: 15, add on: false, number_of_months: 6, anum: 4, charges_divisor: 1000, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_amount: 15,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 1000,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(37.5)
    })

    it('charges_amount: 15, add on: true, number_of_months: 6, anum: 4, charges_divisor: 1000, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_amount: 15,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 1000,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(37.5)
    })

    it('charges_amount: 15, charges_percentage_1: 2, add on: false, number_of_months: 6, anum: 4, charges_divisor: 1000, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_amount: 15,
                    charges_percentage_1: 2,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 1000,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(37.5)
    })

    it('charges_amount: 15, charges_percentage_1: 2, add on: true, number_of_months: 6, anum: 4, charges_divisor: 1000, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_amount: 15,
                    charges_percentage_1: 2,
                    number_of_months: 6,
                    anum: 4,
                    charges_divisor: 1000,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0.75)
    })

    it('charges_amount: 15, charges_percentage_1: 2, charges_percentage_2: 2, add on: false, number_of_months: 6, anum: 4, charges_divisor: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_amount: 15,
                    charges_percentage_1: 2,
                    charges_percentage_2: 2,
                    number_of_months: 6,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0.75)
    })

    it('charges_amount: 15, charges_percentage_1: 2, charges_percentage_2: 2, add on: true, number_of_months: 6, anum: 4, charges_divisor: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_amount: 15,
                    charges_percentage_1: 2,
                    charges_percentage_2: 2,
                    number_of_months: 6,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0.75)
    })
})

describe('Divisor SUITE', () => {
    it('charges_divisor: 1000, add on: false, number_of_months: 0, anum: 0, charges_amount: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_divisor: 1000,
                    number_of_months: 0,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0)
    })

    it('charges_divisor: 1000, add on: true, number_of_months: 0, anum: 0, charges_amount: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_divisor: 1000,
                    number_of_months: 0,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0)
    })

    it('charges_divisor: 1000, add on: false, number_of_months: 6, anum: 0, charges_amount: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_divisor: 1000,
                    number_of_months: 6,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0)
    })

    it('charges_divisor: 1000, add on: true, number_of_months: 6, anum: 0, charges_amount: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_divisor: 1000,
                    number_of_months: 6,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0)
    })

    it('charges_divisor: 1000, add on: false, number_of_months: 6, anum: 1, charges_amount: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_divisor: 1000,
                    number_of_months: 6,
                    anum: 1,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0)
    })

    it('charges_divisor: 1000, add on: true, number_of_months: 6, anum: 1, charges_amount: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_divisor: 1000,
                    number_of_months: 6,
                    anum: 1,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0)
    })

    it('charges_divisor: 1000, add on: false, number_of_months: 6, anum: 4, charges_amount: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_divisor: 1000,
                    number_of_months: 6,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0)
    })

    it('charges_divisor: 1000, add on: true, number_of_months: 6, anum: 4, charges_amount: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_divisor: 1000,
                    number_of_months: 6,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0)
    })

    it('charges_divisor: 1000, add on: false, number_of_months: 6, anum: 4, charges_amount: 15, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_divisor: 1000,
                    number_of_months: 6,
                    anum: 4,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(37.5)
    })

    it('charges_divisor: 1000, add on: true, number_of_months: 6, anum: 4, charges_amount: 15, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_divisor: 1000,
                    number_of_months: 6,
                    anum: 4,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(37.5)
    })

    it('charges_divisor: 1000, add on: false, number_of_months: 6, anum: 4, charges_amount: 15, charges_percentage_1: 2, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_divisor: 1000,
                    charges_percentage_1: 2,
                    number_of_months: 6,
                    anum: 4,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0.75)
    })

    it('charges_divisor: 1000, add on: true, number_of_months: 6, anum: 4, charges_amount: 15, charges_percentage_1: 2, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_divisor: 1000,
                    charges_percentage_1: 2,
                    number_of_months: 6,
                    anum: 4,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0.75)
    })

    it('charges_divisor: 1000, add on: false, number_of_months: 6, anum: 4, charges_amount: 15, charges_percentage_1: 0, charges_percentage_2: 2', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_divisor: 1000,
                    charges_percentage_2: 2,
                    number_of_months: 6,
                    anum: 4,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(37.5)
    })

    it('charges_divisor: 1000, add on: true, number_of_months: 6, anum: 4, charges_amount: 15, charges_percentage_1: 0, charges_percentage_2: 2', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_divisor: 1000,
                    charges_percentage_2: 2,
                    number_of_months: 6,
                    anum: 4,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0.75)
    })

    it('charges_divisor: 1000, add on: false, number_of_months: 6, anum: 4, charges_amount: 15, charges_percentage_1: 2, charges_percentage_2: 2', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_divisor: 1000,
                    charges_percentage_1: 2,
                    charges_percentage_2: 2,
                    number_of_months: 6,
                    anum: 4,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0.75)
    })

    it('charges_divisor: 1000, add on: true, number_of_months: 6, anum: 4, charges_amount: 15, charges_percentage_1: 2, charges_percentage_2: 2', () => {
        expect(
            computation(
                {
                    ...def,
                    charges_divisor: 1000,
                    charges_percentage_1: 2,
                    charges_percentage_2: 2,
                    number_of_months: 6,
                    anum: 4,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0.75)
    })
})

describe('Anum SUITE', () => {
    it('anum: 4, add on: false, number_of_months: 0, charges_amount: 0, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    anum: 4,
                    number_of_months: 0,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0)
    })

    it('anum: 4, add on: true, number_of_months: 0, charges_amount: 0, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    anum: 4,
                    number_of_months: 0,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0)
    })

    it('anum: 4, add on: false, number_of_months: 6, charges_amount: 0, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    anum: 4,
                    number_of_months: 6,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0)
    })

    it('anum: 4, add on: true, number_of_months: 6, charges_amount: 0, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    anum: 4,
                    number_of_months: 6,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0)
    })

    it('anum: 4, add on: false, number_of_months: 6, charges_amount: 15, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    anum: 4,
                    number_of_months: 6,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(15)
    })

    it('anum: 4, add on: true, number_of_months: 6, charges_amount: 15, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    anum: 4,
                    number_of_months: 6,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(15)
    })

    it('anum: 4, add on: false, number_of_months: 6, charges_amount: 15, charges_divisor: 1000, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    anum: 4,
                    number_of_months: 6,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(37.5)
    })

    it('anum: 4, add on: true, number_of_months: 6, charges_amount: 15, charges_divisor: 1000, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    anum: 4,
                    number_of_months: 6,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(37.5)
    })

    it('anum: 4, add on: false, number_of_months: 6, charges_amount: 15, charges_divisor: 1000, charges_percentage_1: 2, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    anum: 4,
                    charges_percentage_1: 2,
                    number_of_months: 6,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0.75)
    })

    it('anum: 4, add on: true, number_of_months: 6, charges_amount: 15, charges_divisor: 1000, charges_percentage_1: 2, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    anum: 4,
                    charges_percentage_1: 2,
                    number_of_months: 6,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0.75)
    })

    it('anum: 4, add on: false, number_of_months: 6, charges_amount: 15, charges_divisor: 1000, charges_percentage_1: 0, charges_percentage_2: 2', () => {
        expect(
            computation(
                {
                    ...def,
                    anum: 4,
                    charges_percentage_2: 2,
                    number_of_months: 6,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(37.5)
    })

    it('anum: 4, add on: true, number_of_months: 6, charges_amount: 15, charges_divisor: 1000, charges_percentage_1: 0, charges_percentage_2: 2', () => {
        expect(
            computation(
                {
                    ...def,
                    anum: 4,
                    charges_percentage_2: 2,
                    number_of_months: 6,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0.75)
    })

    it('anum: 4, add on: false, number_of_months: 6, charges_amount: 15, charges_divisor: 1000, charges_percentage_1: 2, charges_percentage_2: 2', () => {
        expect(
            computation(
                {
                    ...def,
                    anum: 4,
                    charges_percentage_1: 2,
                    charges_percentage_2: 2,
                    number_of_months: 6,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0.75)
    })

    it('anum: 4, add on: true, number_of_months: 6, charges_amount: 15, charges_divisor: 1000, charges_percentage_1: 2, charges_percentage_2: 2', () => {
        expect(
            computation(
                {
                    ...def,
                    anum: 4,
                    charges_percentage_1: 2,
                    charges_percentage_2: 2,
                    number_of_months: 6,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0.75)
    })
})

describe('Month SUITE', () => {
    it('#mos = 6, add on: false, anum: 0, charges_amount: 0, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    number_of_months: 6,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0)
    })

    it('#mos = 6, add on: true, anum: 0, charges_amount: 0, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    number_of_months: 6,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0)
    })

    it('#mos = 6, add on: false, anum: 4, charges_amount: 0, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    number_of_months: 6,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0)
    })

    it('#mos = 6, add on: true, anum: 4, charges_amount: 0, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    number_of_months: 6,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0)
    })

    it('#mos = 6, add on: false, anum: 4, charges_amount: 15, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    number_of_months: 6,
                    charges_amount: 15,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(15)
    })

    it('#mos = 6, add on: true, anum: 4, charges_amount: 15, charges_divisor: 0, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    number_of_months: 6,
                    charges_amount: 15,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(15)
    })

    it('#mos = 6, add on: false, anum: 4, charges_amount: 15, charges_divisor: 1000, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    number_of_months: 6,
                    charges_divisor: 1000,
                    charges_amount: 15,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(37.5)
    })

    it('#mos = 6, add on: true, anum: 4, charges_amount: 15, charges_divisor: 1000, charges_percentage_1: 0, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    number_of_months: 6,
                    charges_divisor: 1000,
                    charges_amount: 15,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(37.5)
    })

    it('#mos = 6, add on: false, anum: 4, charges_amount: 15, charges_divisor: 1000, charges_percentage_1: 2, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    number_of_months: 6,
                    charges_percentage_1: 2,
                    charges_divisor: 1000,
                    charges_amount: 15,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0.75)
    })

    it('#mos = 6, add on: true, anum: 4, charges_amount: 15, charges_divisor: 1000, charges_percentage_1: 2, charges_percentage_2: 0', () => {
        expect(
            computation(
                {
                    ...def,
                    number_of_months: 6,
                    charges_percentage_1: 2,
                    charges_divisor: 1000,
                    charges_amount: 15,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0.75)
    })

    it('#mos = 6, add on: false, anum: 4, charges_amount: 15, charges_divisor: 1000, charges_percentage_1: 0, charges_percentage_2: 2', () => {
        expect(
            computation(
                {
                    ...def,
                    number_of_months: 6,
                    charges_percentage_2: 2,
                    charges_divisor: 1000,
                    charges_amount: 15,
                    anum: 4,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(37.5)
    })

    it('#mos = 6, add on: true, anum: 4, charges_amount: 15, charges_divisor: 1000, charges_percentage_1: 0, charges_percentage_2: 2', () => {
        expect(
            computation(
                {
                    ...def,
                    number_of_months: 6,
                    charges_percentage_2: 2,
                    charges_divisor: 1000,
                    anum: 4,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0.75)
    })

    it('#mos = 6, add on: false, anum: 4, charges_amount: 15, charges_divisor: 1000, charges_percentage_1: 2, charges_percentage_2: 2', () => {
        expect(
            computation(
                {
                    ...def,
                    number_of_months: 6,
                    charges_percentage_1: 2,
                    charges_percentage_2: 2,
                    charges_divisor: 1000,
                    anum: 4,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: false, terms: 12 }
            )
        ).toBe(0.75)
    })

    it('#mos = 6, add on: true, anum: 4, charges_amount: 15, charges_divisor: 1000, charges_percentage_1: 2, charges_percentage_2: 2', () => {
        expect(
            computation(
                {
                    ...def,
                    number_of_months: 6,
                    charges_percentage_1: 2,
                    charges_percentage_2: 2,
                    anum: 4,
                    charges_divisor: 1000,
                    charges_amount: 15,
                },
                { applied_1: 5000, is_add_on: true, terms: 12 }
            )
        ).toBe(0.75)
    })
})
