import { useTranslate } from 'react-admin';
import { Node, Edge, OnConnectStart } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { keyParser } from '../../common/helper';
import { set } from 'lodash';
import { Flow } from './Flow';

export const RecordLineage = (props: {
    relationships: any[];
    record: any;
    onConnectStart?: OnConnectStart;
}) => {
    const { relationships, record, onConnectStart } = props;
    const translate = useTranslate();

    const labels = {};
    relationships?.forEach(value =>
        set(
            labels,
            value.type,
            translate(`pages.lineage.relationships.${value.type}`)
        )
    );
    const { nodes, edges } = getNodesAndEdges(relationships, record, labels);

    return <Flow nodes={nodes} edges={edges} onConnectStart={onConnectStart} />;
};

const getNodesAndEdges = (
    relationships: any[],
    record: any,
    labels: any
): { nodes: Node[]; edges: Edge[] } => {
    const nodes = [
        {
            id: record.id,
            type: 'cardNode',
            position: {
                x: 0,
                y: 0,
            },
            data: { key: record.key, current: true },
        },
        ...relationships.map((relationship: any): Node => {
            const destParsed = keyParser(relationship.dest);
            //the node that is being expanded, defaults to the current node
            const relatedNode = relationship.expands || record.id;
            //the node to create
            const nodeKey =
                destParsed.id == relatedNode || destParsed.name == relatedNode
                    ? relationship.source
                    : relationship.dest;
            const keyParsed = keyParser(nodeKey);
            return {
                id: keyParsed.id || keyParsed.name || '',
                type: 'cardNode',
                position: {
                    x: 0,
                    y: 0,
                },
                data: {
                    key: nodeKey,
                },
            };
        }),
    ];

    const edges = relationships.map(
        (relationship: any, index: number): Edge => {
            //dest should always be present, source might be missing in metadata
            const destParsed = keyParser(relationship.dest);
            const sourceParsed = keyParser(relationship.source || record.key);
            return {
                id: index.toString(),
                source: destParsed.id || destParsed.name || '',
                target: sourceParsed.id || sourceParsed.name || '',
                type: 'default',
                animated: true,
                label: labels[relationship.type] || relationship.type,
            };
        }
    );
    return { nodes, edges };
};
