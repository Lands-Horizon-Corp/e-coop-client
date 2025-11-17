import { useMemo } from 'react'

import BankTableColumns, {
    IBankTableColumnProps,
} from '@/modules/bank/components/bank-table/columns'
import BankAction from '@/modules/bank/components/bank-table/row-action-context'

import Modal, { IModalProps } from '@/components/modals/modal'

import { useGenerateReportCreateUpdateModalService } from '../../components/forms/generate-report-create-update-modal'


