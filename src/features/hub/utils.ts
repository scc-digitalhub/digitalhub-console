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
