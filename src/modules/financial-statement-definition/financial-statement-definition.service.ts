import { Logger } from '@/helpers/loggers'
import { createGLSFSService } from '@/modules/gl-fs/gl-fs.services'

import { ConnectAccountType } from '../gl-fs'
import {
    IFinancialStatementDefinition,
    IFinancialStatementDefinitionRequest,
} from './financial-statement-definition.types'

export const {
    useCreate,
    useGetAll,
    useGetById,
    useDeleteById,
    useUpdateById,
    useUpdateIndex,
    useConnectAccount,
} = createGLSFSService<
    IFinancialStatementDefinition,
    IFinancialStatementDefinitionRequest,
    ConnectAccountType
>({
    url: '/api/v1/financial-statement-definition',
    baseKey: 'financial-statement-definition',
    connectAccountMutationKey:
        'connect-account-to-financial-statement-definition',
    updateIndexMutationKey: 'update-financial-statement-index',
})

export {
    useUpdateIndex as useFinancialStatementUpdateIndex,
    useConnectAccount as useConnectAccountToFinancialStatementDefinition,
}

export const logger = Logger.getInstance('financial-statement-definition')
