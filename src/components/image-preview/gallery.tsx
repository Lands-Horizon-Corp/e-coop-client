import { Link } from '@tanstack/react-router'
import React from 'react'

// Define the type for each image object
export interface Image {
    id: string
    src: string
    title: string
    description: string
}

// Sample image data
export const images: Image[] = [
    {
        id: '1',
        src: 'https://via.placeholder.com/300x200?text=Image+1',
        title: 'Beautiful Landscape',
        description: 'A breathtaking view of mountains during sunset.',
    },
    {
        id: '2',
        src: 'https://via.placeholder.com/300x200?text=Image+2',
        title: 'City Skyline',
        description: 'An impressive skyline of the city at dusk.',
    },
    {
        id: '3',
        src: 'https://via.placeholder.com/300x200?text=Image+3',
        title: 'Forest Path',
        description: 'A serene pathway through a dense forest.',
    },
    // Add more images as needed
]

// Define props type for the Gallery component
interface GalleryProps {
    images: Image[]
}

// Gallery component with typed props
const Gallery: React.FC<GalleryProps> = ({ images }) => {
    return (
        <div>
            {images.map((image) => (
                <div key={image.id}>
                    <h3>{image.title}</h3>
                    <Link to={`/image/${image.id}`}>
                        <img src={image.src} alt={image.title} />
                    </Link>
                    <p>{image.description}</p>
                </div>
            ))}
        </div>
    )
}

// Export the component with default `images` prop
export default function GalleryContainer() {
    return <Gallery images={images} />
}
