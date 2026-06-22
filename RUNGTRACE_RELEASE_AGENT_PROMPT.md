# Prompt for the RungTrace release agent

Copy the prompt below into the AI agent that has access to the private RungTrace source repository and permission to publish releases to `bwebb1994/RungTrace-Downloads`.

---

You are preparing and publishing a customer-ready Windows release of RungTrace.

## Repositories

- The RungTrace application source repository is private. Never copy or expose its source code, project files, debug symbols, credentials, signing secrets, internal documentation, test fixtures, sample customer data, `.env` files, or build logs.
- The public distribution repository is `bwebb1994/RungTrace-Downloads`.
- Use the public repository only for GitHub Releases and a minimal customer-facing README. Do not commit application source or build output to its `main` branch.

## Versioning

1. Read the current application version and inspect the latest published tag in `bwebb1994/RungTrace-Downloads`.
2. Use semantic versioning: `MAJOR.MINOR.PATCH`.
3. Use the version explicitly requested by the user. If no version was supplied, stop and ask whether this is a major, minor, or patch release. Do not guess.
4. Update all version locations in the private application consistently before building.
5. Create a matching Git tag in the form `vMAJOR.MINOR.PATCH`.

## Build requirements

1. Start from a clean, reviewed release commit.
2. Restore dependencies, run the complete automated test suite, and stop if any required test fails.
3. Build the Windows x64 Release configuration. Do not publish a Debug build.
4. Produce a self-contained customer artifact that does not require access to the source repository.
5. Digitally sign the executable or installer with the configured Windows code-signing certificate when one is available. Never print or expose certificate passwords or private key material.
6. Verify the built application's displayed version matches the release tag.
7. Perform a clean-machine smoke test when the project provides one.

## Public release files

Attach only these customer-safe files to the GitHub Release:

- `RungTrace-vMAJOR.MINOR.PATCH-win-x64.exe` — the signed installer or self-contained executable.
- `RungTrace-vMAJOR.MINOR.PATCH-win-x64.exe.sha256` — a UTF-8 text file containing the SHA-256 checksum and filename.
- Optional customer documentation explicitly approved for public distribution, such as `RungTrace-Quick-Start.pdf`.

Do not attach:

- Source archives created from the private source repository.
- `.pdb` files or other debug symbols.
- Unpacked application directories unless the user explicitly requests a ZIP distribution.
- License keys, DevoLens credentials, API keys, signing files, configuration secrets, customer information, or internal notes.

GitHub may display automatically generated source-code links for the public downloads repository itself. That repository must contain no RungTrace application source.

## GitHub Release

1. Create a GitHub Release in `bwebb1994/RungTrace-Downloads` using the tag `vMAJOR.MINOR.PATCH`.
2. Use the title `RungTrace vMAJOR.MINOR.PATCH`.
3. Mark it as a prerelease only when the user identifies it as alpha, beta, release candidate, or preview.
4. Attach the approved files listed above.
5. Write concise customer-facing release notes with:
   - Highlights
   - Improvements
   - Bug fixes
   - Known issues
   - Minimum system requirements or upgrade notes when changed
6. Do not include internal issue discussions, security-sensitive implementation details, private repository links, or confidential names.
7. Before publishing, verify that the executable downloads successfully and that its SHA-256 hash matches the checksum file.
8. Publish the release only after every verification succeeds. Do not replace an existing version's binary; create a new patch release for any corrected build.

## Final report

Report:

- Published version and tag
- Release URL
- Installer filename and size
- SHA-256 value
- Test and smoke-test results
- Signing status
- Any known issues

If credentials, signing access, the requested version, or required build information are missing, stop before publishing and clearly state what is needed.

---
