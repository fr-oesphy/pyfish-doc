# PyFish Validation Checklist

Use this checklist when you want to validate a gameplay-facing change before a
release or a pull request merge.

## Runtime startup

- PyFish loads without crashing on the selected loader.
- No unexpected stack trace appears during startup.
- The expected version profile is the one being tested.

## Script loading

- Global scripts still load from `pyfish/scripts/`.
- Namespaced scripts still load from `pyfish/<namespace>/scripts/`.
- Loader JAR scripts still load from `src/main/resources/pyfish/...`.
- `.pyz` mods still load from the Minecraft `mods/` folder.

## Dependencies

- `requirements.txt` still installs pure-Python dependencies correctly.
- `.pyz` manifest validation still rejects malformed metadata.
- `dependencies.pyz` ordering still works as expected.
- Version constraints behave correctly for exact matches, ranges, and wildcards.

## Resources and content

- Bundled `assets/` resources resolve correctly.
- Bundled `data/` resources resolve correctly.
- Dynamic items, blocks, recipes, tabs, and tags still register correctly.

## Loader parity

- Shared behavior matches on Fabric and NeoForge where parity is expected.
- Loader-specific behavior is documented when parity is not expected.

## Documentation

- `index.html` matches the current public workflow.
- `index.html` and `documentation.md` stay aligned.
- Template archives were regenerated if their source folders changed.
