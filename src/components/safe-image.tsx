import React, { useEffect, useState } from 'react'

type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    fallbackSrc?: string
}

const SafeImage: React.FC<SafeImageProps> = ({
    src,
    fallbackSrc,
    alt = '',
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState(src)

    useEffect(() => {
        setImgSrc(src)
    }, [src])

    return (
        <img
            {...props}
            src={imgSrc}
            alt={alt}
            onError={() => {
                if (imgSrc !== fallbackSrc) {
                    setImgSrc(fallbackSrc)
                }
            }}
        />
    )
}

export default SafeImage
