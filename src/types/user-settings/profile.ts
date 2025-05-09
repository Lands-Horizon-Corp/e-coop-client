import { TEntityId } from '../common'

export interface IUserSettingsProfileRequest {
    first_name: string
    middle_name?: string
    last_name: string
    suffix?: string
}

export interface IUserSettingsPhotoUpdateRequest {
    // ID of uploaded media
    id: TEntityId
}
