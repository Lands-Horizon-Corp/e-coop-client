import { describe, expect, it } from 'vitest'

import { TPermissionAction } from '@/types'

import {
    permissionArrayToMap,
    permissionMapToPermissionArray,
} from './permission-utils'

describe('permissionArrayToMap', () => {
    it('["User:Read", "User:Update", "Bank:Read", "User:Delete"] → {User: ["Read", "Update", "Delete"], Bank: ["Read"]}', () => {
        expect(
            permissionArrayToMap([
                'User:Read',
                'User:Update',
                'Bank:Read',
                'User:Delete',
            ])
        ).toEqual({
            User: ['Read', 'Update', 'Delete'],
            Bank: ['Read'],
        })
    })

    it('empty array → {}', () => {
        expect(permissionArrayToMap([])).toEqual({})
    })

    it('["Foo:Bar"] → {Foo: ["Bar"]}', () => {
        expect(permissionArrayToMap(['Foo:Bar'])).toEqual({ Foo: ['Bar'] })
    })
})

describe('permissionMapToPermissionArray', () => {
    it('{User: ["Read", "Update"], Bank: ["Delete"]} → ["User:Read", "User:Update", "Bank:Delete"]', () => {
        expect(
            permissionMapToPermissionArray({
                User: ['Read', 'Update'],
                Bank: ['Delete'],
            })
        ).toEqual(['User:Read', 'User:Update', 'Bank:Delete'])
    })

    it('empty object → []', () => {
        expect(permissionMapToPermissionArray({})).toEqual([])
    })

    it('{Foo: ["Bar", "Baz"]} → ["Foo:Bar", "Foo:Baz"]', () => {
        expect(
            permissionMapToPermissionArray({
                Foo: ['Bar', 'Baz'] as unknown as TPermissionAction[],
            })
        ).toEqual(['Foo:Bar', 'Foo:Baz'])
    })
})

describe('roundtrip', () => {
    it('array → map → array should equal original (order-insensitive)', () => {
        const arr = ['User:Read', 'User:Update', 'Bank:Delete']
        const back = permissionMapToPermissionArray(permissionArrayToMap(arr))
        expect(back.sort()).toEqual(arr.sort())
    })

    it('map → array → map should equal original', () => {
        const map = {
            User: ['Read', 'Update'] as TPermissionAction[],
            Bank: ['Delete'] as TPermissionAction[],
        }
        const back = permissionArrayToMap(permissionMapToPermissionArray(map))
        expect(back).toEqual(map)
    })
})
