import { Box } from '@mui/material';
import { useRecordContext } from 'react-admin';
import { toYaml } from '@dslab/ra-export-record-button';
import { countLines } from '../../utils/helpers';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github';

export const YamlTab = (props: { record?: any }) => {
    const record = useRecordContext(props);

    const value = record ? toYaml(record) : '';
    const lineCount = countLines(value);

    const aceOptions = {
        readOnly: true,
        useWorker: false,
        showPrintMargin: false,
        minLines: lineCount[0],
        maxLines: lineCount[1],
    };
    return (
        <Box>
            <AceEditor
                value={value}
                mode={'yaml'}
                theme={'github'}
                wrapEnabled
                width={'100%'}
                setOptions={aceOptions}
            />
        </Box>
    );
};
