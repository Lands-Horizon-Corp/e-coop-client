import { ConnectAccountType } from '@/modules/gl-fs'
import { createGLSFSService } from '@/modules/gl-fs/gl-fs.services'

import { IGeneralLedgerDefinition, IGeneralLedgerDefinitionRequest } from '.'

export const {
    useCreate,
    useGetAll,
    useGetById,
    useDeleteById,
    useUpdateById,
    useUpdateIndex,
    useConnectAccount,
} = createGLSFSService<
    IGeneralLedgerDefinition,
    IGeneralLedgerDefinitionRequest,
    ConnectAccountType
>({
    url: '/api/v1/general-ledger-definition',
    baseKey: 'general-ledger-definition',
    connectAccountMutationKey: 'connect-account-to-general-ledger-definition',
    updateIndexMutationKey: 'update-general-ledger-index',
})
