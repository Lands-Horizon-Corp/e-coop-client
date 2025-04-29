import { IMediaResource } from '@/types/coop-types'

export const sampleMediaResourceList: IMediaResource[] = [
    {
        id: '7f76efd0-940a-42f9-afa9-8644453e20aa',
        fileName: 'sample-image.png',
        fileSize: 5242880, // 5 MB in bytes
        fileType: 'image/jpeg',
        storageKey: 'media/resources/sample-image.jpg',
        url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // This is viewable directly in the browser
        bucketName: 'example-media-bucket',
        createdAt: '2024-10-29T08:45:00Z',
        updatedAt: '2024-10-29T10:20:00Z',
        downloadURL: 'https://cdn.example.com/media/resources/sample-image.jpg',
    },
    {
        id: '324d740f2-f57f-4579-a9a3-03d6ddec44b5',
        fileName: 'sample-image2.png',
        fileSize: 7340032, // 7 MB in bytes
        fileType: 'audio/mpeg',
        storageKey: 'media/resources/music-track.mp3',
        url: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Direct URL
        bucketName: 'example-media-bucket',
        createdAt: '2024-10-28T09:30:00Z',
        updatedAt: '2024-10-28T11:00:00Z',
        downloadURL: 'https://cdn.example.com/media/resources/music-track.mp3',
    },
    {
        id: '9482cd20-df59-49a2-b6ce-bf88bed349e3',
        fileName: 'sample-image3.png',
        fileSize: 2097152, // 2 MB in bytes
        fileType: 'application/pdf',
        storageKey: 'media/resources/document.pdf',
        url: 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Direct URL
        bucketName: 'example-media-bucket',
        createdAt: '2024-10-27T07:15:00Z',
        updatedAt: '2024-10-27T08:45:00Z',
        downloadURL: 'https://cdn.example.com/media/resources/document.pdf',
    },
    // {
    //   id: 'f13a44b8-d627-47db-8584-614eb016f6d6',
    //   fileName: "sample-image2.png",
    //   fileSize: 7340032, // 7 MB in bytes
    //   fileType: "audio/mpeg",
    //   storageKey: "media/resources/music-track.mp3",
    //   url: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Direct URL
    //   bucketName: "example-media-bucket",
    //   createdAt: "2024-10-28T09:30:00Z",
    //   updatedAt: "2024-10-28T11:00:00Z",
    //   downloadURL: "https://cdn.example.com/media/resources/music-track.mp3"
    // },
    // {
    //   id: '88350bb7-29de-4e99-bcf0-2f668bcfae92,
    //   fileName: "sample-image3.png",
    //   fileSize: 2097152, // 2 MB in bytes
    //   fileType: "application/pdf",
    //   storageKey: "media/resources/document.pdf",
    //   url: "https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Direct URL
    //   bucketName: "example-media-bucket",
    //   createdAt: "2024-10-27T07:15:00Z",
    //   updatedAt: "2024-10-27T08:45:00Z",
    //   downloadURL: "https://cdn.example.com/media/resources/document.pdf"
    // }
]
