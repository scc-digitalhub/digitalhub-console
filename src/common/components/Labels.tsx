import type { ReactElement } from 'react';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LanguageIcon from '@mui/icons-material/Language';
import FlagIcon from '@mui/icons-material/Flag';
import { SiHuggingface, SiMlflow } from 'react-icons/si';
import LayersIcon from '@mui/icons-material/Layers';
import { RiAiGenerateText } from 'react-icons/ri';
import { RiImageAiFill } from 'react-icons/ri';
import { FaImages } from 'react-icons/fa';
import { RiVideoOnAiFill } from 'react-icons/ri';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { SiPytorch } from "react-icons/si";

const knownLabels: Record<string, ReactElement> = {
    license: <AccountBalanceIcon color="secondary" />,
    base_model: <ModelTrainingIcon color="success" />,
    arxiv: <InsertDriveFileIcon color="action" />,
    region: <LanguageIcon color="primary" />,
    language: <FlagIcon color="warning" />,
    huggingface: <SiHuggingface color="#FFD21E" />,
    mlflow: <SiMlflow color="#0194E2" />,
    pytorch: <SiPytorch color="#EE4C2C" />,
    transformers: <SiHuggingface color="#FFD21E" />,
    safetensors: <LayersIcon color="secondary" />,
    'text-generation': <RiAiGenerateText color="#0194E2" />,
    'image-generation': <RiImageAiFill color="#0194E2" />,
    'text-to-image': <RiImageAiFill color="#0194E2" />,
    'image-to-image': <FaImages color="#0194E2" />,
    'image-text-to-text': <RiImageAiFill color="#0194E2" />,
    'image-to-text': <RiImageAiFill color="#0194E2" />,
    'video-generation': <RiVideoOnAiFill color="#0194E2" />,
    'text-to-video': <RiVideoOnAiFill color="#0194E2" />,
    agent: <SupportAgentIcon color="secondary" />,
};

const findKnownLabel = (value: string): ReactElement | undefined => {
    const normalizedValue = value.toLowerCase();
    return Object.entries(knownLabels).find(
        ([label]) => label.toLowerCase() === normalizedValue
    )?.[1];
};

export const getLabelIcon = (value: string): ReactElement | undefined => {
    const exactMatch = findKnownLabel(value);
    if (exactMatch) return exactMatch;

    const separatorIndex = value.indexOf(':');
    return separatorIndex === -1
        ? undefined
        : findKnownLabel(value.slice(0, separatorIndex).trim());
};
