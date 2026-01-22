import { describe, expect, it } from 'vitest'

import { IUserOrganization } from '../user-organization'
import {
    PERMISSION_BASE_ACTIONS,
    generateBaseAction,
} from './permission.constants'
import { TPermission, TPermissionAction } from './permission.types'
import {
    getCrudPermissions,
    hasPermission,
    permissionArrayToMap,
    permissionMapToPermissionArray,
} from './permission.utils'

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

describe('generateBaseAction', () => {
    it('Should exclude "Create"', () => {
        const result = generateBaseAction({ excludeActions: ['Create'] })
        expect(result).toEqual(
            PERMISSION_BASE_ACTIONS.filter((action) => action !== 'Create')
        )
    })

    it('Should not exclude anything', () => {
        const result = generateBaseAction()
        expect(result).toEqual(PERMISSION_BASE_ACTIONS)
    })
})

// TEST HELPERS

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const makeUserOrg = (overrides?: Partial<any>) =>
    ({
        user_id: 'user-1',
        user_type: 'employee',
        permissions: [] as TPermission[],
        ...overrides,
    }) as IUserOrganization

export const makeResource = (createdBy = 'user-1') => ({
    id: 'res-1',
    created_by_id: createdBy,
})

// FOR SINGLE/MULTI GET PERMISSION
describe('hasPermission - core logic', () => {
    it('returns false when userOrg is missing', () => {
        expect(
            hasPermission({
                userOrg: null,
                resourceType: 'Account',
                action: 'Read',
            })
        ).toBe(false)
    })

    it('allows owner to perform any action', () => {
        expect(
            hasPermission({
                userOrg: makeUserOrg({ user_type: 'owner' }),
                resourceType: 'LoanScheme',
                action: 'Read',
            })
        ).toBe(true)
    })

    it('allows general permission', () => {
        expect(
            hasPermission({
                userOrg: makeUserOrg({
                    permissions: ['Account:Read'],
                }),
                resourceType: 'Account',
                action: 'Read',
            })
        ).toBe(true)
    })

    it('allows if one of two or more perm exists', () => {
        expect(
            hasPermission({
                userOrg: makeUserOrg({
                    permissions: ['Account:Read', 'Account:Update'],
                }),
                action: ['Read'],
                resourceType: 'Account',
                conditionLogic: 'some',
            })
        ).toBe(true)
    })

    it('allows if all perm required exists', () => {
        expect(
            hasPermission({
                userOrg: makeUserOrg({
                    permissions: ['Account:Read', 'Account:Update'],
                }),
                action: ['Read', 'Update'],
                resourceType: 'Account',
                conditionLogic: 'all',
            })
        ).toBe(true)
    })

    it('denies if one of all perm required does not exist', () => {
        expect(
            hasPermission({
                userOrg: makeUserOrg({
                    permissions: ['Account:Read', 'Account:Update'],
                }),
                action: ['Read', 'Update', 'Delete'],
                resourceType: 'Account',
                conditionLogic: 'all',
            })
        ).toBe(false)
    })

    it('denies since user dont have any of them', () => {
        expect(
            hasPermission({
                userOrg: makeUserOrg({
                    permissions: [],
                }),
                action: ['Delete', 'OwnDelete'],
                resourceType: 'Account',
                conditionLogic: 'some',
            })
        ).toBe(false)
    })

    it('denies if one of two or more perm exists', () => {
        expect(
            hasPermission({
                userOrg: makeUserOrg({
                    permissions: ['Account:Read', 'Account:Update'],
                }),
                action: ['Delete'],
                resourceType: 'Account',
                conditionLogic: 'some',
            })
        ).toBe(false)
    })

    it('denies missing general permission', () => {
        expect(
            hasPermission({
                userOrg: makeUserOrg(),
                resourceType: 'Account',
                action: 'Read',
            })
        ).toBe(false)
    })

    it('allows Own permission when user owns resource', () => {
        expect(
            hasPermission({
                userOrg: makeUserOrg({
                    permissions: ['MemberProfile:OwnUpdate' as TPermission],
                }),
                resourceType: 'MemberProfile',
                action: 'OwnUpdate',
                resource: makeResource('user-1'),
            })
        ).toBe(true)
    })

    it('denies Own permission when user does not own resource', () => {
        expect(
            hasPermission({
                userOrg: makeUserOrg({
                    permissions: ['MemberProfile:OwnUpdate' as TPermission],
                }),
                resourceType: 'MemberProfile',
                action: 'OwnUpdate',
                resource: makeResource('user-2'),
            })
        ).toBe(false)
    })

    it('denies Own permission when resource is missing', () => {
        expect(
            hasPermission({
                userOrg: makeUserOrg({
                    permissions: ['MemberProfile:OwnUpdate' as TPermission],
                }),
                resourceType: 'MemberProfile',
                action: 'OwnUpdate',
            })
        ).toBe(false)
    })

    it('does NOT fallback Own action to general permission', () => {
        expect(
            hasPermission({
                userOrg: makeUserOrg({
                    permissions: ['MemberProfile:OwnUpdate' as TPermission],
                }),
                resourceType: 'MemberProfile',
                action: 'OwnUpdate',
                resource: makeResource('user-2'),
            })
        ).toBe(false)
    })
})

// GET PERMISSION CRUD FUNC TEST
describe('getCrudPermissions', () => {
    it('returns all base actions as keys and false when userOrg is missing', () => {
        const result = getCrudPermissions({
            userOrg: null,
            resourceType: 'Account',
        })

        for (const action of PERMISSION_BASE_ACTIONS) {
            expect(result).toHaveProperty(action)
            expect(result[action]).toBe(false)
        }
    })

    it('resolves general permissions correctly', () => {
        const result = getCrudPermissions({
            userOrg: makeUserOrg({
                permissions: ['Account:Read', 'Account:Create'],
            }),
            resourceType: 'Account',
        })

        expect(result.Read).toBe(true)
        expect(result.Create).toBe(true)

        for (const action of PERMISSION_BASE_ACTIONS) {
            if (!['Read', 'Create'].includes(action)) {
                expect(result[action]).toBe(false)
            }
        }
    })

    it('handles Own permissions with ownership correctly', () => {
        const result = getCrudPermissions({
            userOrg: makeUserOrg({
                permissions: ['MemberProfile:OwnUpdate' as TPermission],
            }),
            resourceType: 'MemberProfile',
            resource: makeResource('user-1'),
        })

        expect(result.OwnUpdate).toBe(true)
    })

    it('denies Own permissions when resource is not owned', () => {
        const result = getCrudPermissions({
            userOrg: makeUserOrg({
                permissions: ['MemberProfile:OwnUpdate' as TPermission],
            }),
            resourceType: 'MemberProfile',
            resource: makeResource('user-2'),
        })

        expect(result.OwnUpdate).toBe(false)
    })

    it('owner bypass enables all base actions', () => {
        const result = getCrudPermissions({
            userOrg: makeUserOrg({
                user_type: 'owner',
            }),
            resourceType: 'LoanScheme',
        })

        for (const action of PERMISSION_BASE_ACTIONS) {
            expect(result[action]).toBe(true)
        }
    })

    it('never throws and always returns a boolean map', () => {
        const result = getCrudPermissions({
            userOrg: makeUserOrg(),
            resourceType: 'Account',
        })

        for (const action of PERMISSION_BASE_ACTIONS) {
            expect(typeof result[action]).toBe('boolean')
        }
    })

    it('returns all CRUD permissions as true when user has all base permissions', () => {
        const allPermissions = PERMISSION_BASE_ACTIONS.map(
            (action) => `Account:${action}` as TPermission
        )

        const result = getCrudPermissions({
            userOrg: makeUserOrg({
                permissions: allPermissions,
            }),
            resourceType: 'Account',
            resource: makeResource('user-1'),
        })

        for (const action of PERMISSION_BASE_ACTIONS) {
            expect(result[action]).toBe(true)
        }
    })
})
