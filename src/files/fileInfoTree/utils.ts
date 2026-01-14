// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

export const MAX_TREE_DEPTH = 50;

//TODO merge with file browser utils
export const extractFileType = (data: any) => {
    const ext = data.name.indexOf('.') > 0 ? data.name.split('.').pop() : '';
    const ct = data.content_type || '';
    if (ct === 'text/html' || ['html', 'htm'].indexOf(ext) !== -1) {
        return 'html';
    }
    if (
        ct.startsWith('image/') ||
        ['png', 'jpg', 'jpeg', 'gif', 'bmp'].indexOf(ext) !== -1
    ) {
        return 'image';
    }
    if (ct === 'text/csv' || ['csv'].indexOf(ext) !== -1) {
        return 'csv';
    }
    if (ct === 'text/plain' || ['txt'].indexOf(ext) !== -1) {
        return 'text';
    }
    if (
        ct === 'text/json' ||
        ct === 'application/json' ||
        ['json'].indexOf(ext) !== -1
    ) {
        return 'json';
    }
    if (['yml', 'yaml'].indexOf(ext) !== -1) {
        return 'yaml';
    }
    return '';
};

/**
 * Recursively appends a child object to its parent object.
 * This function is used to construct a tree structure of files and directories.
 *
 * @param {Object} parent - The parent object to append the child to.
 * @param {Object} child - The child object to append to the parent.
 * @param {string} root - The root directory path.
 */
export const appendChild = (parent: any, child: any, root: string) => {
    // Extract the relative path of the child file or directory from the root path
    let path = child.path.substring(root.length);
    if (path.startsWith('/')) path = path.substring(1);

    // Split the relative path into an array of directory names
    let pathArray = path.split('/');

    if (pathArray.length > MAX_TREE_DEPTH) return;

    // Start with the parent object
    let currentParent = parent;

    // Keep track of the current parent path
    let pre = root;

    // Iterate through the array of directory names
    for (let i = 0; i < pathArray.length - 1; i++) {
        // Get the current directory name
        let d = pathArray[i];

        // Update the current parent path
        pre += '/' + d;

        // Find the child object with the current parent path in the current parent's children array
        let c = currentParent.children.find((c: any) => c.id === pre);

        // If the child object doesn't exist, create a new one and add it to the current parent's children array
        if (!c) {
            c = { id: pre, label: d, children: [], fileType: 'folder' };
            currentParent.children.push(c);
        }

        // Update the current parent object to the found or newly created child object
        currentParent = c;
    }

    // Add the child object as a child of the current parent object
    currentParent.children.push({
        id: child.path,
        label: child.name,
        data: child,
        fileType: extractFileType(child),
    });
};

/**
 * Converts a list of files into a tree structure
 * @param data - The list of files with their paths and names
 * @returns The root element of the tree structure
 */
export const convertFiles = (data: any[]): any[] => {
    if (!data || data.length === 0) return [];

    if (data.length === 1) {
        // If there is only one file, return it as the root element
        return [
            {
                id: data[0].path || '.',
                label: data[0].name,
                fileType: extractFileType(data[0]),
                data: data[0],
            },
        ];
    }

    // Find the common root of all the files
    let root = '';
    let pre = '';
    for (let i = 0; i < data[0].path.split('/').length; i++) {
        const elem = data[0].path.split('/')[i];
        pre += elem;
        let stop = false;
        for (let j = 0; j < data.length; j++) {
            if (!data[j].path.startsWith(pre)) {
                stop = true;
                break;
            }
        }
        pre += '/';
        if (stop) {
            break;
        }
        root = pre;
    }
    if (root.endsWith('/')) root = root.substring(0, root.length - 1);
    let rootFolder =
        root.indexOf('/') > 0
            ? root.substring(root.lastIndexOf('/') + 1)
            : root;

    // Create the root element and add all the files as its children
    let rootElem: any = { id: root, label: rootFolder, children: [] };
    for (let i = 0; i < data.length; i++) {
        appendChild(rootElem, data[i], root);
    }
    return [rootElem];
};
