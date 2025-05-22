import { IInvitationCode } from '@/types'
import APIService from '../api-service'

// GET /invitation-code/verfiy/:code
export const verifyInvitationCode = async (code: string) => {
    const response = await APIService.get<IInvitationCode>(
        `/invitation-code/verify/${code}`
    )
    return response.data
}
