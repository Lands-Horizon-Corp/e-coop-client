import React from 'react'

import { FileTypeIcons } from '../../../components/ui/FileTypeIcons'
import { getFileType } from '../media.utils'

interface FileTypeIconProps {
    file: File
}

const FileTypeIcon: React.FC<FileTypeIconProps> = ({ file }) => {
    const fileType = getFileType(file)
    const IconComponent = FileTypeIcons[fileType] || FileTypeIcons.unknown // Default to unknown icon

    return <div className="file-type-icon">{IconComponent}</div>
}

export default FileTypeIcon
