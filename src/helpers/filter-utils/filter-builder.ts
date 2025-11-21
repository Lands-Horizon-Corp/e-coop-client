import {
    TColumnDataTypes,
    TFilterLogic,
    TFilterModes,
    TFilterPayload,
    TFinalFilter,
} from '@/contexts/filter-context'

type Primitive = string | number | boolean | Date

export class FilterBuilder<
    T = unknown,
    TField extends string = string,
    TValue = Primitive,
> {
    private logic: TFilterLogic = 'AND'
    private filters: TFinalFilter<T, TValue>[] = []
    private current?: {
        field: TField
        dataType: TColumnDataTypes
    }

    constructor(initialLogic?: TFilterLogic) {
        if (initialLogic) {
            this.logic = initialLogic
        }
    }

    setLogic(logic: TFilterLogic) {
        this.logic = logic
        return this
    }

    where(field: TField, dataType: TColumnDataTypes) {
        this.current = { field, dataType }
        return this
    }

    private add(mode: TFilterModes, value?: any, value2?: any) {
        if (!this.current) {
            throw new Error('Call where(field, type) first.')
        }

        const { field, dataType } = this.current
        let finalValue = value

        if (mode === 'range') {
            finalValue = { from: value, to: value2 }
        }

        const final: TFinalFilter<T, TValue> = {
            field,
            mode,
            dataType,
            value: finalValue,
        }

        this.filters.push(final)
        return this
    }

    equal(value: TValue) {
        return this.add('equal', value)
    }
    nequal(value: TValue) {
        return this.add('nequal', value)
    }
    contains(value: TValue) {
        return this.add('contains', value)
    }
    ncontains(value: TValue) {
        return this.add('ncontains', value)
    }
    startsWith(value: TValue) {
        return this.add('startswith', value)
    }
    endsWith(value: TValue) {
        return this.add('endswith', value)
    }

    isempty() {
        return this.add('isempty')
    }
    isnotempty() {
        return this.add('isnotempty')
    }

    gt(value: TValue) {
        return this.add('gt', value)
    }
    gte(value: TValue) {
        return this.add('gte', value)
    }
    lt(value: TValue) {
        return this.add('lt', value)
    }
    lte(value: TValue) {
        return this.add('lte', value)
    }

    range(from: TValue, to: TValue) {
        return this.add('range', from, to)
    }

    before(value: TValue) {
        return this.add('before', value)
    }
    after(value: TValue) {
        return this.add('after', value)
    }

    build(): TFilterPayload {
        return {
            logic: this.logic,
            filters: this.filters as unknown as TFinalFilter<
                unknown,
                unknown
            >[],
        }
    }
}
