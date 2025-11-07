import { AceEditorField } from '@dslab/ra-ace-editor';
import { Box, Stack } from '@mui/system';
import { Labeled, RecordContextProvider, TextField } from 'react-admin';

export const SourceCodeView = (props: { sourceCode: any }) => {
    const { sourceCode } = props;

    const values = {
        ...{ sourceCode },
        source: sourceCode.source || '-',
        lang: sourceCode.lang || 'unknown',
    };
    let lineCount = 1;
    if (sourceCode?.base64) {
        lineCount = atob(sourceCode.base64).split('\n').length;
    }

    return (
        <RecordContextProvider value={values}>
            <Stack direction={'row'} spacing={3} color={'gray'}>
                <Labeled>
                    <TextField source="lang" record={values} />
                </Labeled>

                <Labeled>
                    <TextField source="source" record={values} />
                </Labeled>
            </Stack>
            <Box sx={{ pt: 2 }}>
                <Box sx={{ pt: 2 }}>
                    <Labeled label="fields.code">
                        <AceEditorField
                            mode={sourceCode.lang}
                            source="sourceCode.base64"
                            theme="monokai"
                            parse={atob}
                            minLines={lineCount}
                            maxLines={Math.max(25, lineCount)}
                        />
                    </Labeled>
                </Box>
            </Box>
        </RecordContextProvider>
    );
};
