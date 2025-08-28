import { CreateInDialogButton } from '@dslab/ra-dialog-crud';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { RunCreateForm } from './create';
import { useRecordContext } from 'react-admin';
import { useGetManySchemas } from '../../controllers/schemaController';
import { filterProps } from '../../common/schemas';
import { taskParser } from '../../common/helper';

export const CloneButton = () => {
    const run = useRecordContext();
    const task = taskParser(run?.spec?.task);

    const runOf = run?.spec
        ? run.spec['function']
            ? 'function'
            : 'workflow'
        : '';
    const fn = run?.spec?.[runOf];
    const url = fn ? new URL(fn) : { protocol: null };
    const runtime = url.protocol
        ? url.protocol.substring(0, url.protocol.length - 1)
        : '';

    const { data: schemas } = useGetManySchemas([
        { resource: runOf + 's', runtime },
        { resource: 'tasks', runtime },
        { resource: 'runs', runtime },
    ]);

    if (run === undefined) return null;

    //filter run and task schema
    let runSchema = schemas ? schemas.find(s => s?.entity === 'RUN') : null;
    const taskSchema = schemas
        ? schemas.find(s => s?.entity === 'TASK' && s?.kind === task.kind)
        : null;

    if (runSchema && schemas) {
        //filter out embedded props from spec
        schemas
            .filter(s => s?.entity != 'RUN')
            .forEach(s => {
                runSchema.schema = filterProps(runSchema?.schema, s?.schema);
            });
    }

    const taskKey = `${task.kind}://${task.project}/${task.id}`;

    const prepare = (r: any) => {
        return {
            ...r,
            spec: {
                task: taskKey,
                local_execution: false,
                //copy the task spec  (using form)
                ...r.spec,
            },
        };
    };

    return (
        <CreateInDialogButton
            resource="runs"
            label="ra.action.clone"
            icon={<ContentCopyIcon />}
            record={{
                project: run?.project,
                kind: runSchema ? runSchema.kind : 'run',
                spec: run?.spec,
            }}
            fullWidth
            maxWidth={'lg'}
            transform={prepare}
            closeOnClickOutside={false}
        >
            {runSchema?.schema && taskSchema?.schema && (
                <RunCreateForm
                    runtime={runtime}
                    runSchema={runSchema.schema}
                    taskSchema={taskSchema.schema}
                />
            )}
        </CreateInDialogButton>
    );
};
