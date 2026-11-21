# IFL Chat desktop

IFL Chat desktop is the International Fantasy League's desktop app for league chat: a fork of Mattermost Desktop (`ifl/main`, upstream base in `ifl/UPSTREAM`). It opens only `https://chat.iflgm.com`, signs in through iflgm.com in the system browser and returns through `iflchat://`, and carries IFL Chat's name and icons. Server: `friscojosh/ifl-chat`. Design: ifl-website `docs/superpowers/specs/2026-11-21-ifl-chat-apps-design.md`; plan: `docs/superpowers/plans/2026-11-21-ifl-chat-apps.md`.

New IFL code lives in `src/ifl/`, `ifl/` (assets, scripts) and `.github/workflows/ifl-*.yml`. Edits to upstream files are one-line hooks marked `// IFL:`, listed below; keep every one when merging upstream (`grep -rn '// IFL' src scripts electron-builder.ts`).

## Hooks into upstream files

| Location | Purpose |
| --- | --- |

## JSON exceptions

`package.json` and `i18n/en.json` cannot carry comments. Changed keys are listed here; on a merge conflict keep ours.

## Build and release

- `ifl-ci.yml` (pushes and pull requests to `ifl/main`): lint, types, build config check, unit tests and an unsigned Linux build. No secrets. Upstream's i18n check (`npm run i18n-extract` then `git diff i18n/en.json`) is not run: IFL text lives only in `i18n/en.json` (see JSON exceptions).
- `ifl-release-desktop.yml`: see "Releases".
- `ifl-upstream.yml` (Mondays 10:00 UTC): trial-merges the newest stable upstream tag not yet merged, runs the checks, and opens or updates an `Upstream <tag>` issue. It never pushes.

## Upstream releases

1. `git fetch upstream --tags`, `git checkout ifl/main`, `git merge <tag>` (merge, never rebase); keep every `// IFL:` hook and the JSON exceptions.
2. `npm ci && npm run check-types && npm run test:unit`.
3. Set `ifl/UPSTREAM` to the tag and `package.json` `version` to the IFL version: `MAJOR.MINOR.(100 × upstreamPatch + iflRevision)` (v6.4.0 rev 1 → 6.4.1; v6.4.1 rev 3 → 6.4.103), because Windows MSI upgrades compare only three numbers. Update `IFL_UPSTREAM_VERSION` in `src/ifl/release.ts`.
4. Push; run the release (below).

## License

Mattermost Desktop is Apache-2.0 (`LICENSE.txt`, `NOTICE.txt`, kept unchanged). IFL changes are under the same licence.
