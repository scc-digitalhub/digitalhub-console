// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

// SPDX-License-Identifier: Apache-2.0

import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import { twMerge } from 'tailwind-merge';

export const StyledAttachIcon = ({ hasFile }: { hasFile: boolean }) => (
    <AttachFileIcon
        className={twMerge(
            'cursor-pointer transition-all',
            hasFile
                ? 'text-green-500 scale-110'
                : 'text-gray-400 hover:text-gray-600'
        )}
    />
);

export const FilePreviewBanner = ({
    file,
    onRemove,
}: {
    file: File;
    onRemove: () => void;
}) => (
    <div className="px-6 pb-2 w-full animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center gap-3 p-2 bg-gray-100 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-center w-8 h-8 bg-white rounded dark:bg-gray-700 text-blue-500">
                <AttachFileIcon fontSize="small" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate dark:text-gray-200">
                    {file.name}
                </p>
            </div>
            <button
                onClick={onRemove}
                className="text-gray-400 hover:text-red-500 transition-colors"
            >
                <CloseIcon fontSize="small" />
            </button>
        </div>
    </div>
);
