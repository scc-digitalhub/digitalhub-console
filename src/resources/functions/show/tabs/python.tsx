import { SourceCode } from './SourceCode';
const fields = ['python_version', 'source', 'requirements'];

export const PythonSourceCode = () => {
    return <SourceCode fields={fields} />;
};
