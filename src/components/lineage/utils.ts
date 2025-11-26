// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import dagre from '@dagrejs/dagre';

import { RaRecord } from 'react-admin';
import { Node, Edge, Position } from '@xyflow/react';
import { keyParser } from '../../common/helper';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const NODE_WIDTH = 200;
export const NODE_HEIGHT = 150;

//lineage rel types
export type Relationship = {
    source?: string;
    dest: string;
    type: string;
};

export enum RelationshipDirection {
    'forward',
    'reverse',
}

export const getNodesAndEdges = (
    relationships: Relationship[],
    direction: RelationshipDirection,
    records: RaRecord[],
    labels: any,
    expandable: boolean
): { nodes: Node[]; edges: Edge[] } => {
    const keys: string[] = [];

    //extract record keys, if present
    //we parse records first to keep current as first node
    records?.forEach(record => {
        if (record.key && !keys.includes(record.key)) {
            keys.push(record.key);
        }
    });

    //extract node identifiers from relationships
    relationships.forEach(rel => {
        //dest is *always* defined
        if (rel.dest && !keys.includes(rel.dest)) {
            keys.push(rel.dest);
        }

        //source may be missing, we'll build the node disconnected
        if (rel.source && !keys.includes(rel.source)) {
            keys.push(rel.source);
        }
    });

    //build nodes
    const nodes: Node[] = keys.map(key => ({
        id: keyParser(key).id ?? key,
        type: 'cardNode',
        position: {
            x: 0,
            y: 0,
        },
        data: {
            key,
            expandable,
        },
    }));

    //build edges from relationships
    const edges: Edge[] = [];

    relationships.forEach((rel, index) => {
        //dest should always be present, source might be missing in metadata
        //if source is missing no edge can be defined
        //NOTE: these are *directional*
        if (rel.source) {
            const source =
                RelationshipDirection.forward == direction
                    ? keyParser(rel.source).id ?? rel.source
                    : keyParser(rel.dest).id ?? rel.dest;
            const target =
                RelationshipDirection.forward == direction
                    ? keyParser(rel.dest).id ?? rel.dest
                    : keyParser(rel.source).id ?? rel.source;

            edges.push({
                id: `${index}`,
                source,
                target,
                type: 'default',
                animated: true,
                label: labels[rel.type] || rel.type,
            });
        }
    });

    return { nodes, edges };
};

export const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    direction = 'LR'
): { nodes: Node[]; edges: Edge[] } => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction, ranksep: 100 });

    nodes.forEach(node => {
        dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    edges.forEach(edge => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node): Node => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const newNode = {
            ...node,
            targetPosition: isHorizontal ? Position.Left : Position.Top,
            sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            position: {
                x: nodeWithPosition.x - NODE_WIDTH / 2,
                y: nodeWithPosition.y - NODE_HEIGHT / 2,
            },
        };

        return newNode;
    });

    return { nodes: newNodes, edges };
};
