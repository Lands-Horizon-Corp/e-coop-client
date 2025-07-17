import React, { useEffect, useState } from 'react'

import { orgBannerList } from '@/assets/pre-organization-banner-background'

type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    fallbackSrc?: string
}

const SafeImage: React.FC<SafeImageProps> = ({
    src,
    fallbackSrc = orgBannerList[7],
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
