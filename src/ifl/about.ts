/* eslint-disable header/header -- IFL file, not Mattermost copyright */
// IFL: new file. The About panel names IFL Chat and credits Mattermost Desktop.

import {app} from 'electron';

import {IFL_UPSTREAM_VERSION} from './release';

export function setIflAboutPanel() {
    app.setAboutPanelOptions({
        applicationName: 'IFL Chat',
        applicationVersion: app.getVersion(),
        copyright: '© International Fantasy League',
        credits: `Built on Mattermost Desktop ${IFL_UPSTREAM_VERSION}, open source software (Apache-2.0).`,
        website: 'https://iflgm.com',
    });
}
