import { useState } from "react";
import { AwsS3, Uppy } from "uppy";

export const useUploadController = (props?: any): UploadControllerResult => {
    const { uppyProps, s3Props } = props;
    const uppyConfig = uppyProps ? uppyProps : { restrictions: { maxNumberOfFiles: 1 } };
    const s3Config = s3Props ? s3Props : {
        id: 'AwsS3',
        shouldUseMultipart: false,
    };
    const [uppy] = useState(() =>
        new Uppy(uppyConfig).use(AwsS3, s3Config)
    );
    return {
        uppy
    };
};

type UploadControllerResult = {
    uppy: Uppy;
};
