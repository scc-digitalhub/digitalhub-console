export function prettyBytes(bytes, decimals = 2) {
    if (bytes == 0) {
        return '0 Bytes';
    }

    var k = 1024,
        dm = decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getMimeTypeFromExtension(extension = '') {
    if (extension[0] === '.') {
        extension = extension.substr(1);
    }

    if (extension.endsWith('/')) {
        return 'folder';
    }

    //TODO replace with proper db
    return (
        {
            aac: 'audio/aac',
            avi: 'video/x-msvideo',
            bin: 'application/octet-stream',
            bmp: 'image/bmp',
            bz: 'application/x-bzip',
            bz2: 'application/x-bzip2',
            css: 'text/css',
            csv: 'text/csv',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            gz: 'application/gzip',
            gif: 'image/gif',
            htm: 'text/html',
            html: 'text/html',
            ico: 'image/vnd.microsoft.icon',
            jar: 'application/java-archive',
            java: 'text/x-java',
            jpeg: 'image/jpeg',
            jpg: 'image/jpeg',
            js: 'text/javascript',
            json: 'application/json',
            jsonld: 'application/ld+json',
            mid: 'audio/midi audio/x-midi',
            midi: 'audio/midi audio/x-midi',
            mp3: 'audio/mpeg',
            mp4: 'video/mp4',
            mpeg: 'video/mpeg',
            odp: 'application/vnd.oasis.opendocument.presentation',
            ods: 'application/vnd.oasis.opendocument.spreadsheet',
            odt: 'application/vnd.oasis.opendocument.text',
            oga: 'audio/ogg',
            ogv: 'video/ogg',
            ogx: 'application/ogg',
            opus: 'audio/opus',
            png: 'image/png',
            pdf: 'application/pdf',
            ppt: 'application/vnd.ms-powerpoint',
            pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            py: 'text/x-python',
            rar: 'application/vnd.rar',
            rtf: 'application/rtf',
            sh: 'application/x-sh',
            svg: 'image/svg+xml',
            tar: 'application/x-tar',
            tif: 'image/tiff',
            tiff: 'image/tiff',
            ts: 'video/mp2t',
            txt: 'text/plain',
            wav: 'audio/wav',
            weba: 'audio/webm',
            webm: 'video/webm',
            webp: 'image/webp',
            xhtml: 'application/xhtml+xml',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            xml: 'application/xml',
            yaml: 'application/x-yaml',
            zip: 'application/zip',
            '7z': 'application/x-7z-compressed',
        }[extension] || 'application/octet-stream'
    );
}

export function getTypeFromMimeType(mimeType = '') {
    if ('folder' == mimeType) {
        return 'folder';
    }

    if (!mimeType || mimeType.indexOf('/') < 1) {
        return 'generic';
    }

    const g = mimeType.split('/');
    if ('image' == g[0]) {
        return 'image';
    }
    if ('video' == g[0]) {
        return 'video';
    }
    if ('audio' == g[0]) {
        return 'audio';
    }
    if ('text' == g[0]) {
        return 'text';
    }

    if ('application/xml' == mimeType || 'application/x-yaml' == mimeType) {
        return 'text';
    }

    if (
        g[1] &&
        (g[1].indexOf('opendocument') > 0 || g[1].indexOf('officedocument') > 0)
    ) {
        return 'document';
    }

    if ('application/pdf' == mimeType) {
        return 'document';
    }

    if (g[1] && g[1].indexOf('zip') > -1) {
        return 'archive';
    }
}
