# IFL Chat desktop

IFL Chat desktop is the International Fantasy League's desktop app for league chat: a fork of Mattermost Desktop (`ifl/main`, upstream base in `ifl/UPSTREAM`). It opens only `https://chat.iflgm.com`, signs in through iflgm.com in the system browser and returns through `iflchat://`, and carries IFL Chat's name and icons. Server: `friscojosh/ifl-chat`. Design: ifl-website `docs/superpowers/specs/2026-11-21-ifl-chat-apps-design.md`; plan: `docs/superpowers/plans/2026-11-21-ifl-chat-apps.md`.

New IFL code lives in `src/ifl/`, `ifl/` (assets, scripts) and `.github/workflows/ifl-*.yml`. Edits to upstream files are one-line hooks marked `// IFL:`, listed below; keep every one when merging upstream (`grep -rn '// IFL' src scripts electron-builder.ts`).

## Hooks into upstream files

| Location | Purpose |
| --- | --- |
| `electron-builder.ts:22` | IFL Chat's own app id |
| `electron-builder.ts:60` | iflchat:// (the server fork's desktop hand-off) |
| `electron-builder.ts:65` | deb synopsis "IFL Chat" |
| `electron-builder.ts:82` | no rpm or flatpak |
| `electron-builder.ts:83` | Linux app id `com.iflgm.chat.desktop` |
| `electron-builder.ts:84` | Linux executable `ifl-chat` |
| `electron-builder.ts:85` | deb maintainer (package.json author has no email) |
| `electron-builder.ts:133` | macOS Focus usage string names IFL Chat |
| `electron-builder.ts:187` | no GPO templates (Mattermost's enterprise policies) |
| `electron-builder.ts:199` | never upgrades or removes a stock Mattermost install |
| `scripts/afterpack.js:27` | Windows executable name (productName) |
| `scripts/afterpack.js:30` | macOS app bundle name (productName) |
| `src/assets/linux/create_desktop_file.sh:10` | IFL Chat's desktop entry |
| `src/common/config/buildConfig.ts:24` | IFL Chat opens only the league's server; links go to iflgm.com (IFL.md) |
| `src/common/config/index.ts:12` | imports `IFL_POLICY_CONFIG` |
| `src/common/config/index.ts:57` | no GPO/MDM policy (it could add servers) |
| `src/common/constants.ts:22` | IFL Chat's deep-link scheme |
| `src/main/app/initialize.test.js:167` | electron mock has no setAboutPanelOptions |
| `src/main/app/initialize.ts:68` | imports `setIflAboutPanel` |
| `src/main/app/initialize.ts:234` | About names IFL Chat |
| `src/main/app/initialize.ts:238` | dev builds' scheme |
| `src/main/app/initialize.ts:337` | IFL Chat's AppUserModelID |
| `src/main/app/utils.test.js:110` | iflchat scheme |
| `src/main/app/utils.ts:50` | dev builds' scheme |
| `src/main/notifications/dnd-windows.ts:23` | IFL Chat's AppUserModelID |
| `src/main/security/preAuthManager.test.js:289` | keyed by request origin and realm |
| `src/main/security/preAuthManager.test.js:305` | keyed by request origin and realm, not the view's server |
| `src/main/security/preAuthManager.test.js:315` | two origins in one view never share a login prompt or its credentials |
| `src/main/security/preAuthManager.test.js:337` | keyed by request origin and realm |
| `src/main/security/preAuthManager.ts:192` | key by the challenging origin and realm, never the view's server, so one origin's prompt and credentials are never reused for another |
| `src/main/updateNotifier.ts:32` | imports the release-name helpers |
| `src/main/updateNotifier.ts:225` | ifl-v tags |
| `src/main/updateNotifier.ts:238` | ifl-chat-<version> artifacts |
| `src/main/utils.ts:82` | also drop Electron's "IFL Chat/<version>"; the webapp needs exactly one Mattermost/<version> |
| `src/main/utils.ts:132` | macOS screen-capture reset uses our bundle id |

## JSON exceptions

`package.json` and `i18n/en.json` cannot carry comments. Changed keys are listed here; on a merge conflict keep ours.

- `package.json`: `name`, `productName`, `version`, `description`, `author`, `desktopName`, `homepage` (and `package-lock.json`'s top-level `name` and `version` to match).
- `i18n/en.json`: `main.app.app.handleAppCertificateError.certError.dialog.message`, `main.menus.app.help.academy`, `renderer.components.configureServer.url.info`, `renderer.components.configureServer.url.notMattermost`, `renderer.components.configureServer.url.urlNotMatched`, `renderer.components.configureServer.url.urlUpdated`, `renderer.components.developerModeIndicator.tooltip`, `renderer.components.newServerModal.permissions.notifications.mac`, `renderer.components.newServerModal.permissions.notifications.windows`, `renderer.components.newServerModal.serverURL.description`, `renderer.components.newServerModal.warning.notMattermost`, `renderer.components.newServerModal.warning.urlNotMatched`, `renderer.components.newServerModal.warning.urlUpdated`, `renderer.components.welcomeScreen.slides.welcome.subtitle`.

IFL's own files (`src/ifl/*.ts`) start with `/* eslint-disable header/header */`: upstream's lint rule requires the Mattermost copyright header, which IFL code does not carry.

## What the fork changes

- **Locked server.** `buildConfig.ts` has one default server (`https://chat.iflgm.com`) and server management off; GPO/MDM policy is not loaded (`IFL_POLICY_CONFIG`), since a policy can add servers or turn management back on.
- **Identity.** App id, AppUserModelID and Linux desktop name `com.iflgm.chat.desktop`; product name IFL Chat; executable `ifl-chat`; new MSI upgrade code, so it installs beside stock Mattermost and never removes it; no GPO templates; About credits Mattermost Desktop (`src/ifl/about.ts`). The user agent still ends in `Mattermost/<version>` (the webapp's desktop detection); Electron's `IFL Chat/<version>` token is dropped.
- **Sign-in.** Scheme `iflchat` (`iflchat-dev` in dev). The server fork hands the browser sign-in back on it.
- **Updates.** Feed `https://iflgm.com/apps/desktop` (`latest.txt` and per-version download redirects to this repo's releases, served by ifl-website's nginx); artifacts `ifl-chat-<version>-<os>-<arch>.<ext>` (deb `ifl-chat_<version>-1_<arch>.deb`; the x64 AppImage is `ifl-chat-<version>-linux-x86_64.AppImage`); release tags `ifl-v<version>` (`src/ifl/release.ts`).
- **Icons.** Generated by `ifl/scripts/gen-icons.sh` from `ifl/assets/` and committed. The renderer's Mattermost wordmark (`Images/Logo.tsx`) is unchanged: only the welcome and server-setup screens use it, and they never show with a locked server.
- **Security fix (basic auth).** Upstream keys the HTTP basic-auth login modal by the owning view's server URL, so a pending prompt (and the credentials typed into it) for one origin could be handed to a request from another origin in the same view. `preAuthManager.ts` keys it by the challenging request's origin and realm instead (proxy logins unchanged); the server id is still used only to scope where the modal shows. Covered by `preAuthManager.test.js` ("should key the login modal by request origin and realm"). Worth reporting upstream.
- **Upstream tests changed.** Expected values that name Mattermost's id, scheme or modal key are changed to ours with a `// IFL:` comment (`src/main/app/utils.test.js`, `src/main/app/initialize.test.js`, `src/main/security/preAuthManager.test.js`); the code under test is never changed to satisfy them.

## Build and release

- `ifl-ci.yml` (pushes and pull requests to `ifl/main`): lint, types, build config check, unit tests and an unsigned Linux build. No secrets. Upstream's i18n check (`npm run i18n-extract` then `git diff i18n/en.json`) is not run: IFL text lives only in `i18n/en.json` (see JSON exceptions).
- `ifl-release-desktop.yml`: see "Releases" below.
- `ifl-upstream.yml` (Mondays 10:00 UTC): trial-merges the newest stable upstream tag not yet merged, runs the checks, and opens or updates an `Upstream <tag>` issue. It never pushes.

## Releases

`ifl-release-desktop.yml` runs on a tag `ifl-v<version>` or by hand. Linux and Windows build without secrets; the macOS job (signing and notarisation) and the publish job run in the `release` environment, so the run waits for Josh's approval. Secrets (environment `release`, set by Josh): `MAC_CSC_LINK` (Developer ID Application .p12, base64), `MAC_CSC_KEY_PASSWORD`, `MAC_PROVISION_PROFILE` (Developer ID provisioning profile for `com.iflgm.chat.desktop`, base64; the communication-notifications entitlement needs it), `ASC_API_KEY_P8`, `ASC_API_KEY_ID`, `ASC_API_ISSUER_ID` (App Store Connect API key, for notarisation). The result is a draft release with every installer, `SHA256SUMS` and `latest.txt`; publishing it makes it the update feed's latest. Windows builds are unsigned (no `AZURE_*` secrets). Release steps: bump `package.json` `version`, commit, `git tag ifl-v<version> && git push origin ifl-v<version>`, approve the run, check the draft, publish.

## Upstream releases

1. `git fetch upstream --tags`, `git checkout ifl/main`, `git merge <tag>` (merge, never rebase); keep every `// IFL:` hook and the JSON exceptions.
2. `npm ci && npm run check-types && npm run test:unit`.
3. Set `ifl/UPSTREAM` to the tag and `package.json` `version` to the IFL version: `MAJOR.MINOR.(100 × upstreamPatch + iflRevision)` (v6.4.0 rev 1 → 6.4.1; v6.4.1 rev 3 → 6.4.103), because Windows MSI upgrades compare only three numbers. Update `IFL_UPSTREAM_VERSION` in `src/ifl/release.ts`.
4. Push; run the release (below).

## License

Mattermost Desktop is Apache-2.0 (`LICENSE.txt`, `NOTICE.txt`, kept unchanged). IFL changes are under the same licence.
