import { ITimeStamps, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'

export interface IAccountsComputationTypeRequest {
    id: TEntityId
    companyId: TEntityId
    name: string
    description: string
}

export interface IAccountsComputationTypeResource extends ITimeStamps {
    id: TEntityId
    companyId: TEntityId
    name: string
    description: string
    createdBy: TEntityId
    updatedBy: TEntityId
}

export interface IAccountsComputationTypePaginatedResource
    extends IPaginatedResult<IAccountsComputationTypeResource> {}

export const dummyAccountComputationTypeData: IAccountsComputationTypeResource[] =
    [
        {
            id: '1',
            companyId: '1001',
            name: 'Interest-Based',
            description: 'Calculates based on interest rates',
            createdAt: new Date().toISOString(),
            createdBy: '2001',
            updatedAt: new Date().toISOString(),
            updatedBy: '2002',
        },
        {
            id: '2',
            companyId: '1002',
            name: 'Flat Rate',
            description: 'Fixed percentage computation',
            createdAt: new Date().toISOString(),
            createdBy: '2003',
            updatedAt: new Date().toISOString(),
            updatedBy: '2004',
        },
        {
            id: '3',
            companyId: '1003',
            name: 'Tiered Interest',
            description: 'Different rates for different tiers',
            createdAt: new Date().toISOString(),
            createdBy: '2005',
            updatedAt: new Date().toISOString(),
            updatedBy: '2006',
        },
        {
            id: '4',
            companyId: '1004',
            name: 'Amortization',
            description: 'Standard amortization calculation',
            createdAt: new Date().toISOString(),
            createdBy: '2007',
            updatedAt: new Date().toISOString(),
            updatedBy: '2008',
        },
        {
            id: '5',
            companyId: '1005',
            name: 'Balloon Payment',
            description: 'Lump sum payment at the end',
            createdAt: new Date().toISOString(),
            createdBy: '2009',
            updatedAt: new Date().toISOString(),
            updatedBy: '2010',
        },
    ]
