import { Dashboard } from '@uppy/react';

export const FileInput = (props: FileInputProps) => {
    const { uppy } = props;

    return (
        <Dashboard
            uppy={uppy}
            hideUploadButton
            proudlyDisplayPoweredByUppy={false}
        />
    );
};

type FileInputProps = {
    uppy: any;
};
