/* eslint-disable header/header -- IFL file, not Mattermost copyright */
// IFL: new file. IFL Chat's release names (IFL.md): the update feed on
// iflgm.com, the /apps page and ifl-release-desktop.yml depend on them.

/** The Mattermost Desktop tag this build is based on (ifl/UPSTREAM). */
export const IFL_UPSTREAM_VERSION = '6.4.0';

/** Release tags: the fork also carries upstream's v<version> tags. */
export const IFL_RELEASE_TAG_PREFIX = 'ifl-v';

/** GPO/MDM policy is ignored: it could add servers or re-enable server management. */
export const IFL_POLICY_CONFIG = false as boolean;

export function iflArtifactName(version: string, platformName: string, fileExt: string, archName: string): string {
    return `ifl-chat-${version}-${platformName}-${archName}.${fileExt}`;
}

export function iflReleaseTag(version: string): string {
    return `${IFL_RELEASE_TAG_PREFIX}${version}`;
}
