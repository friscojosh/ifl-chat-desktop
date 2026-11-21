/* eslint-disable header/header -- IFL file, not Mattermost copyright */
// IFL: new file. IFL Chat's identity, locked server and release names (IFL.md).

import buildConfig from 'common/config/buildConfig';
import defaultPreferences from 'common/config/defaultPreferences';
import upgradePreferences from 'common/config/upgradePreferences';
import {MATTERMOST_PROTOCOL} from 'common/constants';

import {IFL_POLICY_CONFIG, IFL_UPSTREAM_VERSION, iflArtifactName, iflReleaseTag} from './release';

jest.mock('electron', () => ({app: {getPath: jest.fn(() => '/valid/downloads/path')}}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../package.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const builder = require('../../electron-builder');

describe('IFL Chat desktop', () => {
    it('opens only chat.iflgm.com', () => {
        expect(buildConfig.enableServerManagement).toBe(false);
        expect(buildConfig.defaultServers).toEqual([{name: 'IFL Chat', url: 'https://chat.iflgm.com'}]); // order is set from the index (common/config)
        expect(IFL_POLICY_CONFIG).toBe(false);
    });

    it('does not start on login unless the user turns it on', () => {
        expect(defaultPreferences.autostart).toBe(false);
    });

    it('keeps an existing user\'s start-on-login choice', () => {
        // A saved current config keeps its value; older configs upgrade with
        // upstream's past defaults (pastDefaultPreferences), which we leave alone.
        const saved = {...defaultPreferences, autostart: true};
        expect(upgradePreferences(saved).autostart).toBe(true);
        const v3 = {version: 3, teams: [], lastActiveTeam: 0, autostart: true};
        expect(upgradePreferences(v3 as never).autostart).toBe(true);
    });

    it('links iflgm.com and never mattermost.com', () => {
        const links = [buildConfig.helpLink, buildConfig.academyLink, buildConfig.upgradeLink, buildConfig.updateNotificationURL,
            buildConfig.macAppStoreUpdateURL, buildConfig.windowsStoreUpdateURL ?? '', buildConfig.linuxUpdateURL, buildConfig.linuxGitHubReleaseURL];
        links.forEach((link) => expect(link).not.toMatch(/mattermost/i));
        expect(buildConfig.updateNotificationURL).toBe('https://iflgm.com/apps/desktop');
        expect(buildConfig.linuxGitHubReleaseURL).toBe('https://github.com/friscojosh/ifl-chat-desktop/releases/tag');
        expect(buildConfig.academyLink).toBe('');
        expect(buildConfig.allowedProtocols).toContain('iflchat');
        expect(buildConfig.allowedProtocols).not.toContain('mattermost');
    });

    it('registers iflchat://', () => {
        expect(MATTERMOST_PROTOCOL).toBe('iflchat');
        expect(builder.protocols).toEqual([{name: 'IFL Chat', schemes: ['iflchat']}]);
    });

    it('is its own app, never an upgrade of Mattermost', () => {
        expect(pkg.productName).toBe('IFL Chat');
        expect(pkg.name).toBe('ifl-chat');
        expect(pkg.desktopName).toBe('com.iflgm.chat.desktop');
        expect(pkg.version).toBe('6.4.1');
        expect(builder.appId).toBe('com.iflgm.chat.desktop');
        expect(builder.linux.appId).toBe('com.iflgm.chat.desktop');
        expect(builder.linux.executableName).toBe('ifl-chat');
        expect(builder.linux.target).toEqual(['deb', 'tar.gz', 'appimage']);
        expect(builder.msi.upgradeCode).toBe('{3C1F7B2E-5A4D-4E8B-9F61-2D7A0C9B4E15}');
        expect(JSON.stringify(builder.win.extraFiles)).not.toContain('gpo');
    });

    it('names artifacts and tags as the update feed expects', () => {
        expect(iflArtifactName('6.4.1', 'mac', 'dmg', 'arm64')).toBe('ifl-chat-6.4.1-mac-arm64.dmg');
        expect(iflArtifactName('6.4.1', 'win', 'msi', 'x64')).toBe('ifl-chat-6.4.1-win-x64.msi');
        expect(iflReleaseTag('6.4.1')).toBe('ifl-v6.4.1');
        expect(IFL_UPSTREAM_VERSION).toBe('6.4.0');
    });
});
