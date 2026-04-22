import z from 'zod'

import {
    IBaseEntityMeta,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types'

import { IMedia } from '../media'
import { AreaSchema } from './area.validation'

export interface IArea extends IBaseEntityMeta {
    media_id: TEntityId
    media: IMedia
    name: string
    latitude: number
    longitude: number
}

export type TPositions = Pick<ITimeStamps, 'updated_at'> & {
    longitude: number
    latitude: number
}

export type TUserLocation = {
    id: TEntityId
    media: IMedia
    full_name: string
    longitude: number
    latitute: number
    last_update_datetime: string
    positions: TPositions[]
}

export type IAreaRequest = z.infer<typeof AreaSchema>

export interface IAreaPaginated extends IPaginatedResult<IArea> {}

export const dummyUserLocations: TUserLocation[] = [
    {
        id: 'user-1',
        full_name: 'Juan Dela Cruz',
        longitude: 121.0437,
        latitute: 14.676,
        last_update_datetime: '2026-04-10T08:30:00Z',
        media: {
            id: 'media-1',
            file_name: 'profile-juan.jpg',
            file_size: 245678,
            file_type: 'image/jpeg',
            storage_key: 'users/user-1/profile.jpg',
            bucket_name: 'user-assets',
            download_url: 'https://cdn.example.com/users/user-1/profile.jpg',
            description: 'Profile picture',
            progress: 100,
            created_at: '2026-01-15T10:00:00Z',
        },
        positions: [
            {
                latitude: 14.675,
                longitude: 121.042,
                updated_at: '2026-04-10T08:00:00Z',
            },
            {
                latitude: 14.676,
                longitude: 121.0437,
                updated_at: '2026-04-10T08:30:00Z',
            },
        ],
    },
    {
        id: 'user-2',
        full_name: 'Maria Santos',
        longitude: 121.05,
        latitute: 14.68,
        last_update_datetime: '2026-04-10T09:15:00Z',
        media: {
            id: 'media-2',
            file_name: 'profile-maria.png',
            file_size: 198432,
            file_type: 'image/png',
            storage_key: 'users/user-2/profile.png',
            bucket_name: 'user-assets',
            download_url: 'https://cdn.example.com/users/user-2/profile.png',
            created_at: '2026-02-20T14:30:00Z',
        },
        positions: [
            {
                latitude: 14.6785,
                longitude: 121.048,
                updated_at: '2026-04-10T08:45:00Z',
            },
            {
                latitude: 14.68,
                longitude: 121.05,
                updated_at: '2026-04-10T09:15:00Z',
            },
        ],
    },
    {
        id: 'user-3',
        full_name: 'Carlos Reyes',
        longitude: 121.035,
        latitute: 14.67,
        last_update_datetime: '2026-04-10T07:50:00Z',
        media: {
            id: 'media-3',
            file_name: 'avatar-carlos.webp',
            file_size: 150123,
            file_type: 'image/webp',
            storage_key: 'users/user-3/avatar.webp',
            bucket_name: 'user-assets',
            download_url: 'https://cdn.example.com/users/user-3/avatar.webp',
            progress: 100,
            created_at: '2026-03-05T09:45:00Z',
        },
        positions: [
            {
                latitude: 14.668,
                longitude: 121.033,
                updated_at: '2026-04-10T07:20:00Z',
            },
            {
                latitude: 14.67,
                longitude: 121.035,
                updated_at: '2026-04-10T07:50:00Z',
            },
        ],
    },
]
