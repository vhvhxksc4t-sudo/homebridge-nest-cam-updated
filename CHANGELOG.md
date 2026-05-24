# Changelog

All notable changes to this fork will be documented here. This is a compatibility fork of [homebridge-nest-cam](https://github.com/Brandawg93/homebridge-nest-cam) by Brandawg93.

---

## [7.5.5] - 2026-05-22

### Changed (fork — compatibility update)
- Package renamed to `homebridge-nest-cam-updated` for npm publishing as a maintained fork.
- Minimum Node.js raised to 22; Homebridge peer dependency extended to include `^2.0.0`.
- TypeScript updated from 4.5 to 5.x; `target`/`lib` updated to ES2022.
- `skipLibCheck: true` added to tsconfig to handle newer type syntax in Homebridge 2's Matter.js transitive dependencies.
- Angular 13 removed from the build chain entirely — the credential-setup UI in the Homebridge web interface is no longer included. The plugin core (camera streaming, motion detection, doorbell) is unaffected. Configuration is done via `config.schema.json` as normal.
- `@homebridge/plugin-ui-utils` removed from runtime dependencies (no longer needed without the UI).
- `homebridge-ui/` source excluded from `tsc` compilation.

### Fixed
- `export default` changed to `export =` so the CommonJS module shape is correct for Homebridge's plugin loader.
- `addService()` call updated to satisfy Homebridge 2's stricter type signature.

---

For changes prior to 7.5.5, see the [original repository changelog](https://github.com/Brandawg93/homebridge-nest-cam/blob/master/CHANGELOG.md).
