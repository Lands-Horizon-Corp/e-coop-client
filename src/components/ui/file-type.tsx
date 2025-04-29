// FileTypeIcon.tsx
import React from 'react'
import { getFileType } from '@/helpers'
import { FileTypeIcons } from './FileTypeIcons'

interface FileTypeIconProps {
    file: File
}

const FileTypeIcon: React.FC<FileTypeIconProps> = ({ file }) => {
    const fileType = getFileType(file)
    const IconComponent = FileTypeIcons[fileType] || FileTypeIcons.unknown // Default to unknown icon

    return <div className="file-type-icon">{IconComponent}</div>
}

export default FileTypeIcon
