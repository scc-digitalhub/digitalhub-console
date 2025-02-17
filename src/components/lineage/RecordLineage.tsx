import {
    RaRecord,
    useDataProvider,
    useNotify,
    useTranslate,
} from 'react-admin';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { set } from 'lodash';
import { Flow } from './Flow';
import { getNodesAndEdges, Relationship, RelationshipDirection } from './utils';
import { useCallback, useEffect, useState } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { keyParser } from '../../common/helper';

export const RecordLineage = (props: {
    relationships: Relationship[];
    record: RaRecord;
    expandable?: boolean;
    addRecordNode?: boolean;
    viewportHeight?: string;
    viewportWidth?: string;
}) => {
    const {
        relationships: relFromProps = [],
        record,
        expandable = true,
        addRecordNode = true,
        viewportHeight,
        viewportWidth,
    } = props;
    const [relationships, setRelationships] = useState<Relationship[]>(
        relFromProps || []
    );

    useEffect(() => {
        //update relationships if new ones are passed from parent
        setRelationships(relFromProps);
    }, [relFromProps]);

    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const { root } = useRootSelector();
    const notify = useNotify();

    //derive translations for rels
    const labels = {};
    relationships?.forEach(value =>
        set(
            labels,
            value.type,
            translate(`pages.lineage.relationships.${value.type}`)
        )
    );

    //use reverse representation, we store rel on child side
    const direction = RelationshipDirection.reverse;

    // Callback fired when handles are clicked
    // NOTE: handleType marks side of relation but we need to evaluate direction as well
    const onConnectStart = useCallback(
        (event, { nodeId, handleId, handleType }) => {
            //we use reverse direction!
            const as = handleType === 'dest' ? 'dest' : 'source';
            const key = atob(handleId.split(':')[0]);
            const { resource, id } = keyParser(key);

            if (resource && id) {
                dataProvider
                    ?.getLineage(resource, {
                        id,
                        meta: { root },
                    })
                    .then(data => {
                        if (data?.lineage) {
                            //extract requested side from list of rels
                            const rels = data.lineage
                                .filter(r => r[as] == key)
                                .map(exp => ({ ...exp, expands: nodeId }));
                            if (rels.length == 0) {
                                notify('messages.lineage.noExpansion', {
                                    type: 'info',
                                });
                            } else {
                                let adds = 0;
                                //store if missing
                                setRelationships(value => {
                                    //add only missing
                                    const toAdd = rels.filter(
                                        r =>
                                            !value.some(
                                                x =>
                                                    r.source == x.source &&
                                                    r.dest == x.dest &&
                                                    r.type &&
                                                    x.type
                                            )
                                    );
                                    adds = toAdd.length;

                                    if (toAdd) {
                                        return [...value, ...toAdd];
                                    } else {
                                        //return *the same* array to avoid flipping for no changes
                                        return value;
                                    }
                                });

                                if (adds == 0) {
                                    //no new relationships discovered
                                    notify('messages.lineage.noExpansion', {
                                        type: 'info',
                                    });
                                }
                            }
                        }
                    })
                    .catch(error => {
                        const e =
                            typeof error === 'string'
                                ? error
                                : error.message || 'error';
                        notify(e);
                    });
            }
        },
        [dataProvider, notify, root, setRelationships]
    );

    const { nodes, edges } = getNodesAndEdges(
        relationships,
        direction,
        addRecordNode ? [record] : [],
        labels,
        expandable
    );

    return (
        <ReactFlowProvider>
            <Flow
                nodes={nodes}
                edges={edges}
                direction={direction}
                onConnectStart={onConnectStart}
                height={viewportHeight}
                width={viewportWidth}
            />
        </ReactFlowProvider>
    );
};
