import { parseAllDocuments } from 'yaml';

export const toRepositoryAssetUrl = (
    repository?: string,
    assetName?: string
): string | null => {
    if (!repository || !assetName) return null;

    const ghTreeMatch = repository.match(
        /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)(?:\/(.+))?$/
    );

    if (ghTreeMatch) {
        const [, owner, repo, branch, path] = ghTreeMatch;
        const basePath = path ? `/${path}` : '';
        return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}${basePath}/${assetName}`;
    }

    return `${repository.replace(/\/$/, '')}/${assetName}`;
};

/**
 * Scarica e parsa un definition.yaml dalla repository del template.
 * Ritorna un array di documenti (multi-doc YAML separati da ---)
 * Il primo documento è sempre il padre, i successivi sono i figli (es. tasks per le function)
 */
export const loadDefinitionYaml = async (repositoryUrl: string): Promise<any[]> => {
    const url = toRepositoryAssetUrl(repositoryUrl, 'definition.yaml');
    if (!url) return [];

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch definition.yaml: ${res.statusText}`);

    const text = await res.text();

    return parseAllDocuments(text)
        .map(doc => doc.toJSON())
        .filter(Boolean);
};

/**
 * Scarica il YAML del progetto e ritorna i suoi item piatti,
 * già pronti per essere creati con createItemWithChildren.
 * Gli item dei progetti sono inline nello YAML, non hanno repository proprio.
 */
export const loadProjectItems = async (
    repositoryUrl: string,
    catalogKeyToResource: Record<string, string>
): Promise<{ item: any; resourceName: string }[]> => {
    const docs = await loadDefinitionYaml(repositoryUrl);
    if (!docs.length) return [];

    const projectDoc = docs[0];
    if (!projectDoc.spec) return [];

    return Object.entries(projectDoc.spec).flatMap(([catalogKey, items]) => {
        const resourceName = catalogKeyToResource[catalogKey] ?? catalogKey;
        return (items as any[]).map(item => ({ item, resourceName }));
    });
};

/**
 * Crea una singola risorsa scaricando il YAML se disponibile,
 * altrimenti usa i dati JSON del catalogo come fallback.
 * TODO: gestire i documenti figli dopo la creazione del padre
 */
export const createItemWithChildren = async (
    item: any,
    resourceName: string,
    root: string,
    dataProvider: any
): Promise<any> => {
    const docs = item.metadata?.repository
        ? await loadDefinitionYaml(item.metadata.repository).catch(() => [])
        : [];

    const sourceData = docs.length > 0 ? docs[0] : item;
    const payload = {
        ...sourceData,
        project: root,
        metadata: { ...(sourceData.metadata || {}), project: root },
    };

    return dataProvider.create(resourceName, {
        data: payload,
        meta: { root },
    });
};

/**
 * Determina se un documento YAML è un figlio (es. task) basandosi sul kind.
 * I task hanno kind con '+' (es. 'container+job')
 */
export const isChildDocument = (kind: string): boolean => {
    return typeof kind === 'string' && kind.includes('+');
};

/**
 * Ritorna il resource name React-Admin per un documento figlio.
 * Per ora solo tasks sono supportati.
 */
export const getChildResourceName = (kind: string): string => {
    if (kind.includes('+')) return 'tasks';
    return kind;
};

/**
 * Costruisce il riferimento al padre nel formato usato dall'API
 * es: container://myproject/my-function:abc123
 */
export const buildParentRef = (
    parentKind: string,
    project: string,
    parentName: string,
    parentId: string
): string => {
    return `${parentKind}://${project}/${parentName}:${parentId}`;
};