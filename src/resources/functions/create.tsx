import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    CreateActionsProps,
    CreateBase,
    CreateView,
    FormDataConsumer,
    ListButton,
    LoadingIndicator,
    SaveButton,
    TextInput,
    Toolbar,
    TopToolbar,
    required,
    useGetResourceLabel,
    useTranslate,
} from 'react-admin';
import {
    isAlphaNumeric,
} from '../../common/helper';
import { FlatCard } from '../../components/FlatCard';
import { CreatePageTitle } from '../../components/PageTitle';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { FunctionIcon } from './icon';
import { getFunctionUiSpec } from './types';
import { MetadataInput } from '../../components/MetadataInput';
import { KindSelector } from '../../components/KindSelector';
import { StepperForm, useStepper } from '@dslab/ra-stepper';
import { AceEditorField } from '@dslab/ra-ace-editor';
import { toYaml } from '@dslab/ra-export-record-button';
import { SpecInput } from '../../components/SpecInput';

const CreateToolbar = (props: CreateActionsProps) => {
    return (
        <TopToolbar>
            <ListButton />
        </TopToolbar>
    );
};

export const FunctionCreate = () => {
    const { root } = useRootSelector();
    const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const getResourceLabel = useGetResourceLabel();
    const [kinds, setKinds] = useState<any[]>();
    const [schemas, setSchemas] = useState<any[]>();

    const transform = data => ({
        ...data,
        project: root || '',
    });

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.list('functions').then(res => {
                if (res) {
                    setSchemas(res);

                    const values = res.map(s => ({
                        id: s.kind,
                        name: s.kind,
                    }));

                    setKinds(values);
                }
            });
        }
    }, [schemaProvider, setKinds]);

    if (!kinds) {
        return <LoadingIndicator />;
    }

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase transform={transform} redirect="list">
                <>
                    <CreatePageTitle
                        icon={<FunctionIcon fontSize={'large'} />}
                    />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <StepperForm toolbar={<StepperToolbar />}>
                                <StepperForm.Step
                                    label={getResourceLabel('base', 1)}
                                >
                                    <TextInput
                                        source="name"
                                        validate={[
                                            required(),
                                            isAlphaNumeric(),
                                        ]}
                                    />
                                    <MetadataInput />
                                </StepperForm.Step>
                                <StepperForm.Step
                                    label={getResourceLabel('spec', 1)}
                                >
                                    <KindSelector kinds={kinds} />
                                    <SpecInput
                                        source="spec"
                                        getUiSchema={getFunctionUiSpec}
                                    />
                                </StepperForm.Step>
                                <StepperForm.Step
                                    label={translate('Recap')}
                                    optional
                                >
                                    <FormDataConsumer>
                                        {({ formData }) => {
                                            //read-only view
                                            const r = {
                                                spec: btoa(
                                                    toYaml(formData?.spec)
                                                ),
                                            };
                                            return (
                                                <AceEditorField
                                                    mode="yaml"
                                                    source="spec"
                                                    record={r}
                                                    parse={atob}
                                                />
                                            );
                                        }}
                                    </FormDataConsumer>
                                </StepperForm.Step>
                            </StepperForm>
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};

const StepperToolbar = () => {
    const { steps, currentStep } = useStepper();

    return (
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box>
                <StepperForm.PreviousButton
                    variant={'text'}
                    color="secondary"
                />
            </Box>
            <Box>
                <StepperForm.NextButton />
                {steps && currentStep === steps.length - 1 && <SaveButton />}
            </Box>
        </Toolbar>
    );
};
