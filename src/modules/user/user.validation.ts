import z from 'zod'

import { USER_TYPE } from './user.constants'

export const userAccountTypeSchema = z.enum(USER_TYPE, {
    message: `Valid options are ${USER_TYPE.join(',')}`,
})
