import { createContext, ReactElement, useContext, useState } from 'react';
import { FileProgress } from '@uppy/utils/lib/FileProgress';
import { Identifier } from 'react-admin';

export type Upload = {
    id: string;
    filename?: string;
    progress: FileProgress;
    resource: string;
    resourceId?: Identifier;
    remove: () => void;
};

interface UploadStatusContextValue {
    uploads: Upload[];
    updateUploads: (upload: Upload) => void;
    removeUploads: (toBeRemoved?: Upload) => void;
}

const UploadStatusContext = createContext<UploadStatusContextValue | undefined>(
    undefined
);

export const UploadStatusContextProvider = (
    props: UploadStatusContextProviderParams
) => {
    const { children } = props;

    const [uploads, setUploads] = useState<Upload[]>([]);

    const updateUploads = (upload: Upload) => {
        setUploads(prev => {
            return [upload, ...prev.filter(p => p.id != upload.id)];
        });
    };

    const removeUploads = (toBeRemoved?: Upload) => {
        if (toBeRemoved) {
            setUploads(prev => {
                return prev.filter(u => u.id !== toBeRemoved.id);
            });
        } else {
            setUploads([]);
        }
    };

    return (
        <UploadStatusContext.Provider
            value={{ uploads, updateUploads, removeUploads }}
        >
            {children}
        </UploadStatusContext.Provider>
    );
};

export type UploadStatusContextProviderParams = {
    children: ReactElement;
};

export const useUploadStatusContext = () => {
    const uploadStatusContext = useContext(UploadStatusContext);
    if (uploadStatusContext === undefined) {
        throw new Error(
            'useUploadStatusContext must be used inside an UploadStatusContext'
        );
    }
    return uploadStatusContext;
};
