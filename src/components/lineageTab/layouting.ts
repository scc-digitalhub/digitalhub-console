import dagre from 'dagre';
import { Node, Edge, Position } from '@xyflow/react';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
export const NODE_WIDTH = 172;
const NODE_HEIGHT = 90;

export const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    direction = 'LR'
): { nodes: Node[]; edges: Edge[] } => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

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