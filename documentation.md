# PyFish Documentation

PyFish is a multiloader, multiversion Minecraft mod that embeds GraalPy so Python code can run directly at runtime on Fabric and NeoForge.

Interactive documentation lives in:

- `documentation/documentation.html`

The HTML documentation is now the most complete reference. It keeps everything in one file, but behaves like multiple internal pages and includes dedicated per-function pseudo-pages for the API cards.

## Overview

- PyFish version: `1.2.0`
- Minecraft targets: `1.21.1` through `1.21.11`
- Java target: `21`
- Loaders: Fabric and NeoForge
- Runtime: bundled GraalPy
- Script layout: external `pyfish/` folder, packaged `.pyz` mods, and bundled jar resources

PyFish now covers four big areas:

- runtime Python scripting with the shared `mc` API
- shared and loader-specific event callbacks
- dynamic content registration directly from Python
- namespace-aware folders, packaged `.pyz` mods, and loader JAR projects

## Installation

PyFish is distributed as one installable jar per loader and version profile.

### Fabric

1. Install the Fabric Loader matching the target Minecraft version.
2. Install the Fabric API matching the same Minecraft version.
3. Copy the built PyFish jar into `mods/`.

Expected jar pattern:

- `build/profiles/<profile>/fabric/libs/pyfish-fabric-<minecraft>-1.2.0.jar`

### NeoForge

1. Install the NeoForge version matching the target Minecraft version.
2. Copy the built PyFish jar into `mods/`.

Expected jar pattern:

- `build/profiles/<profile>/neoforge/libs/pyfish-neoforge-<minecraft>-1.2.0.jar`

### Do not install development artifacts

Do not drop these into a normal instance:

- `dev`
- `dev-shadow`
- `sources`
- `javadoc`

## Deployment Modes

PyFish is optional by default on both client and server.

### Server-only

Best for:

- gameplay automation
- event-driven logic
- Python-controlled modpacks
- shared scripting without forcing players to install a client mod

### Client-only

Useful for:

- preparing a client that may connect to a stricter server later
- local desktop-oriented helper scripts
- testing the client handshake path

### Both sides

Use both sides when you want:

- normal server-side scripting
- optional client-side features
- the option to enforce the client mod through server config

## Server Policy: Require The Client Mod

Config path:

- `config/pyfish/server.properties`

Default values:

```properties
requireClientPyFish=false
clientHandshakeTimeoutTicks=60
missingClientMessage=This server requires PyFish on the client.
```

Meaning:

- `requireClientPyFish=false`
  Clients without PyFish are allowed.
- `requireClientPyFish=true`
  The server waits for a PyFish client hello and disconnects players who do not answer in time.
- `clientHandshakeTimeoutTicks`
  Timeout before the server decides the client mod is missing.
- `missingClientMessage`
  Kick message shown when the server requires PyFish on the client.

## External Scripts And Namespace Resolution

PyFish can load scripts directly from the root `pyfish/` folder of the Minecraft instance or server.

Expected layout:

```text
.minecraft/
|-- mods/
|-- config/
`-- pyfish/
    |-- mods/
    |   `-- packaged_mod-1.0.0.pyz
    |-- scripts/
    |   `-- global_fix.py
    `-- my_mod/
        |-- requirements.txt
        `-- scripts/
            |-- init.py
            `-- gameplay.py
```

Rules:

- `pyfish/scripts/*.py`
  Global scripts under the `pyfish` namespace.
- `pyfish/<mod_id>/scripts/*.py`
  Logical Python mods using `<mod_id>` as namespace.
- `pyfish/<mod_id>/requirements.txt`
  Pure-Python dependencies scoped to that logical Python mod.
- `pyfish/mods/*.pyz`
  Packaged Python-only mods with a validated manifest and standard zipapp entrypoint.
- scripts bundled inside a real mod jar
  Use that Java mod's namespace automatically.

This namespace resolution now also applies to runtime content registration:

- a global or modpack-style script normally resolves to `pyfish:<id>`
- a logical Python mod in `pyfish/example/scripts/` resolves to `example:<id>`
- a packaged mod resolves to the `id` declared in its root `pyfish.json`
- a real mod using PyFish resolves to its own Java mod id

## Creating PyFish Mods

PyFish supports two distribution formats.

### Python-only `.pyz` mods

Use this format when the entire mod is written with the PyFish Python API.
The result is one loader-neutral file placed in `pyfish/mods/`. The same
archive can run with Fabric or NeoForge, although the script must only use APIs
and events supported by its target Minecraft versions.

The player or server owner still installs the normal PyFish jar on every side
where the Python code must run. A `.pyz` is managed by PyFish and is not a
standalone Fabric or NeoForge mod jar.

Archive layout:

~~~text
example_pyz_mod-1.0.0.pyz
|-- pyfish.json
|-- __main__.py
|-- requirements.txt
|-- example_pyz_mod/
    |-- __init__.py
    |-- content.py
    |-- events.py
~~~

Only `pyfish.json` and `__main__.py` are required.
`requirements.txt` and internal packages are optional.

The standard zipapp entrypoint is `__main__.py`. An `__init__.py`
only marks an internal Python package; it is not used as the mod manifest.
Keeping metadata in JSON lets PyFish validate identity before arbitrary code
executes.

Manifest example:

~~~json
{
  "schema_version": 1,
  "id": "example_pyz_mod",
  "name": "Example PyFish Mod",
  "version": "1.0.0",
  "description": "A Python-only Minecraft mod.",
  "authors": ["Your name"],
  "license": "MIT",
  "homepage": ""
}
~~~

Required fields:

- `schema_version`
- `id`
- `name`
- `version`

Optional fields:

- `description`
- `authors` as a string or array of strings
- `license`
- `homepage`

The id accepts 1-64 lowercase letters, numbers, underscores, dots, or dashes.
`minecraft` and `pyfish` are reserved.

Entrypoint example:

~~~python
from pyfish import PlayerEvent, PyFishModMetadata, items, log_print, mc

PYFISH_MOD: PyFishModMetadata
PYFISH_MOD_ID: str
PYFISH_MOD_NAME: str
PYFISH_MOD_VERSION: str

items.register_item("python_token", {
    "texture": "minecraft:item/diamond",
    "stacksTo": 64,
})

def on_player_join(event: PlayerEvent) -> None:
    player = event.getPlayer() or event.getEntity()
    if player is None:
        return
    mc.send_message(player, f"{PYFISH_MOD_NAME} is active")
    mc.give_item(player, f"{PYFISH_MOD_ID}:python_token", 1)

mc.on("on_player_join", on_player_join)
log_print(f"Loaded {PYFISH_MOD_NAME} {PYFISH_MOD_VERSION}")
~~~

PyFish injects the complete manifest as `PYFISH_MOD` and exposes the id,
name, and version as dedicated string globals. Unqualified content ids inherit
the manifest id, so `items.register_item("python_token", ...)` registers
`example_pyz_mod:python_token`.

Build with the included template:

~~~text
cd documentation/pyfish_pyz_template
python build.py
~~~

The result is written to
`documentation/pyfish_pyz_template/dist/<mod_id>-<version>.pyz`.
Install it as:

~~~text
.minecraft/
|-- pyfish/
    |-- mods/
        |-- example_pyz_mod-1.0.0.pyz
~~~

PyFish creates `pyfish/mods/` automatically. Archives directly inside
`pyfish/` are accepted too.

Dependencies and imports:

- Root `requirements.txt` dependencies are installed into
  `pyfish/libs/<mod_id>/` and cached by content hash.
- Pure-Python packages are the most portable with GraalPy.
- Keep larger mods inside a package named after the mod id, then use normal
  imports such as
  `from example_pyz_mod.content import register_content`.
- The archive stays on Python's import path so callbacks can perform later
  imports after startup.

Validation and trust:

- archives missing `pyfish.json` or `__main__.py` are rejected
- invalid ids, unsupported schemas, unsafe or duplicate ZIP paths are rejected
- archives are limited to 10,000 entries and 128 MiB uncompressed
- a namespace collision with a folder, bundled script, or another archive
  rejects the `.pyz` instead of silently replacing content
- `.pyz` files are executable code with normal PyFish host access, so only
  install archives from trusted sources

### Fabric or NeoForge JAR mods

Use `documentation/pyfish_mod_template/` when the project must appear as
a native loader mod, needs loader metadata, or may later include Java code.
Scripts bundled under `pyfish/<mod_id>/` inherit the real loader mod id.
Unlike a `.pyz`, the JAR must be built for the selected loader and
Minecraft version profile.

## Getting Started

Minimal example:

```python
from pyfish import mc, log_print, ServerEvent, PlayerEvent

def on_server_started(event: ServerEvent):
    log_print("PyFish runtime ready")

def on_player_join(event: PlayerEvent):
    player = event.getPlayer() or event.getEntity()
    mc.send_message(player, "PyFish is active on this server.")

mc.on("on_server_started", on_server_started)
mc.on("on_player_join", on_player_join)
```

Suggested location:

- `pyfish/scripts/hello.py`

What this validates:

- Python startup
- event registration
- lifecycle callback execution
- callback wrapper access
- shared `mc` API calls

## Callback Objects

PyFish wraps loader-specific events into a shared Python-facing surface whenever possible.

Common callback helpers:

- `event.getPlayer()`
- `event.getEntity()`
- `event.getLevel()`
- `event.getServer()`
- `event.getPos()`
- `event.getMessage().getString()`
- `event.getTarget()`
- `event.getHand()`

Common wrappers:

- player wrappers expose `unwrapPlayer()`, `serverLevel()`, `getBlockX/Y/Z()`, `getX/Y/Z()`, `getName()`
- entity wrappers expose `unwrapEntity()`, `serverLevel()`, `getX/Y/Z()`, `getName()`
- position wrappers expose `unwrapBlockPos()`, `getX()`, `getY()`, `getZ()`

Python type annotations are safe to keep in real runtime scripts executed by GraalPy.

Example:

```python
from pyfish import mc, PlayerEvent, PlayerChatEvent

def on_player_join(event: PlayerEvent):
    player = event.getPlayer() or event.getEntity()
    if player is not None:
        mc.send_message(player, "Join event typed correctly")

def on_player_chat(event: PlayerChatEvent):
    player = event.getPlayer()
    if player is not None:
        mc.send_message(player, f"You said: {event.getMessageString()}")
```

Common callback classes:

- `ServerEvent`
  Used for `on_server_starting`, `on_server_started`, `on_server_stopping`, `on_server_stopped`, and `on_server_tick`
- `LevelEvent`
  Used for `on_level_load`, `on_level_save`, `on_level_unload`, and `on_level_tick`
- `PlayerEvent`
  Used for `on_player_join`, `on_player_leave`, `on_player_respawn`, and `on_player_tick`
- `PlayerCloneEvent`
  Used for `on_player_clone`
- `BlockBreakEvent`
  Used for `on_block_break`
- `PlayerChatEvent`
  Used for `on_player_chat`
- `PlayerInteractBlockEvent`
  Used for `on_player_interact_block`, and on Fabric also for the shared `on_block_place` callback path
- `PlayerInteractEntityEvent`
  Used for `on_player_interact_entity`
- `EntitySpawnEvent`
  Used for `on_entity_spawn`
- `EntityDimensionChangeEvent`
  Used on Fabric for `on_entity_dimension_change`
- `LivingDamageEvent`
  Used for the shared wrapped forms of `on_entity_hurt` and `on_entity_damage`
- `LivingDeathEvent`
  Used for `on_entity_death`

For specialized NeoForge-only aliases such as crafting, explosion, or command hooks, the HTML documentation names the forwarded native event class directly instead of pretending there is a shared PyFish wrapper.

These wrappers can be passed directly into helpers like:

- `mc.send_message(...)`
- `mc.set_block(...)`
- `mc.execute_command(...)`
- `mc.add_effect(...)`

## Loader Differences

PyFish tries to keep the Python-facing API stable across both loaders, but the event bridge is not perfectly symmetrical.

Shared across both loaders:

- same `pyfish/` external script layout
- same shared `mc` API names
- same optional-by-default client/server model
- same server config for requiring the client mod
- same integrated dynamic content API

Fabric now covers a much larger shared gameplay surface:

- server lifecycle
- world lifecycle
- player join and leave
- respawn and clone
- chat
- block break
- block and entity interaction
- entity spawn and dimension change
- living hurt, damage, and death observation

NeoForge still remains broader on specialized hooks:

- item craft and smelt hooks
- item pickup and toss hooks
- more specialized player hooks
- more specialized block hooks
- more specialized entity hooks
- command and explosion event coverage

For the exact current matrix, use:

- `documentation/documentation.html`

## Dynamic Content API

PyFish exposes its content workflow directly from the base `pyfish` module.

Preferred imports:

```python
from pyfish import items, blocks, recipes, tags, textures, tabs
```

### What is integrated into base PyFish

- items
- foods
- tools, weapons, and multitools
- blocks
- recipes
- tags
- runtime textures
- creative tabs
- dynamic item and block callbacks

### Core helpers

- `items.register_item(item_id: str, properties: ItemProperties)`
- `items.register_food(item_id: str, nutrition: int, saturation: float, properties: ItemProperties)`
- `items.register_tool(item_id: str, tool_type: str, properties: ItemProperties)`
- `blocks.register_block(block_id: str, properties: BlockProperties)`
- `recipes.shaped(recipe_id: str, result_id: str, count: int, pattern: list[str], keys: dict[str, str])`
- `recipes.shapeless(recipe_id: str, result_id: str, count: int, ingredients: list[str])`
- `tags.add_item_tag(tag_id: str, *entries: str)`
- `tags.add_block_tag(tag_id: str, *entries: str)`
- `textures.register_texture(texture_id: str, data: bytes)`
- `textures.register_image(texture_id: str, image: object)`
- `tabs.create(tab_id: str, properties: TabProperties)`

### Supported property highlights

Items and foods commonly use:

- `texture`
- `model`
- `stacksTo`
- `fireResistant`
- `durability`
- `tab`
- `alwaysEdible`
- `events`

Tools commonly use:

- `damage`
- `attackSpeed`
- `durability`
- `speed`
- `damageBonus`
- `enchantmentValue`
- `repairItem`

Blocks commonly use:

- `texture`
- `destroyTime`
- `explosionResistance`
- `requiresCorrectToolForDrops`
- `tab`
- `events`

Tabs currently use:

- `displayName`
- `icon`

Use `displayName`, not `title`.

### Dynamic content callbacks

The content API still supports content-local Python callbacks through the `events` property.

Common item callbacks:

- `use`
- `use_on`
- `eat`

Common block callback:

- `use`

Example:

```python
from pyfish import items, mc

def on_wand_use(level, player, hand):
    mc.send_message(player, "Dynamic item callback OK")

items.register_item("signal_wand", {
    "texture": "signal_wand",
    "stacksTo": 1,
    "events": {
        "use": on_wand_use
    }
})
```

## World API

The world helpers are now documented separately from content registration.

Core helpers:

- `mc.get_block_id(world: WorldHandle, x: int, y: int, z: int)`
- `mc.set_block(world: WorldHandle, x: int, y: int, z: int, block_id: str)`
- `mc.break_block(world: WorldHandle, x: int, y: int, z: int)`
- `mc.get_time(world: WorldHandle)`
- `mc.set_time(world: WorldHandle, time: int)`

Typical pattern:

```python
from pyfish import PlayerEvent

def on_player_join(event: PlayerEvent):
    player = event.getPlayer() or event.getEntity()
    world = event.getLevel() or player.serverLevel()
    x = player.getBlockX() + 1
    y = player.getBlockY()
    z = player.getBlockZ()

    mc.set_block(world, x, y, z, "minecraft:gold_block")
    mc.send_message(player, f"Placed {mc.get_block_id(world, x, y, z)} at {x} {y} {z}")
```

## Players And Entities API

Core helpers:

- `mc.send_message(player: PlayerHandle, message: str)`
- `mc.broadcast_message(world: WorldHandle, message: str)`
- `mc.give_item(player: PlayerHandle, item_id: str, count: int)`
- `mc.get_players(world: WorldHandle)`
- `mc.teleport(player: PlayerHandle, x: float, y: float, z: float)`
- `mc.set_health(player: PlayerHandle, health: float)`
- `mc.set_food_level(player: PlayerHandle, food_level: int)`
- `mc.set_experience(player: PlayerHandle, level: int)`
- `mc.add_effect(player: PlayerHandle, effect_id: str, duration: int, amplifier: int = 0)`
- `mc.spawn_entity(world: WorldHandle, entity_type_id: str, x: float, y: float, z: float)`
- `mc.kill_entity(entity: EntityHandle)`
- `mc.get_entities_in_range(world: WorldHandle, x: float, y: float, z: float, range: float)`

Good smoke tests:

- give a generated item
- apply a short speed effect
- spawn a bee
- scan nearby entities
- remove one spawned test entity

## Utils And Event Registration

Core helpers:

- `mc.execute_command(server: ServerHandle, command: str)`
- `mc.create_explosion(world: WorldHandle, x: float, y: float, z: float, radius: float, fire: bool = False, mode: str = "block")`
- `mc.strike_lightning(world: WorldHandle, x: float, y: float, z: float)`
- `mc.play_sound(world: WorldHandle, x: float, y: float, z: float, sound_id: str, category: str = "master", volume: float = 1.0, pitch: float = 1.0)`
- `mc.spawn_particle(world: WorldHandle, particle_id: str, x: float, y: float, z: float, count: int = 1, dx: float = 0.0, dy: float = 0.0, dz: float = 0.0, speed: float = 0.0)`
- `mc.on(alias: str, callback: Callable[..., object])`

Example:

```python
from pyfish import mc, ServerEvent

def on_server_started(event: ServerEvent):
    server = event.getServer()
    mc.execute_command(server, "gamerule sendCommandFeedback false")

mc.on("on_server_started", on_server_started)
```

## Event System

Register callbacks with:

```python
mc.on("alias", callback)
```

The exact supported aliases, callback classes, and backend hooks depend on the selected loader.

You can annotate callbacks directly with the shared classes exported by `pyfish`, for example:

```python
from pyfish import PlayerChatEvent

def on_player_chat(event: PlayerChatEvent):
    ...
```

Names like `BlockEvent.EntityPlaceEvent` are nested NeoForge Java event classes. The HTML documentation shows those exact forwarded native class names for specialized NeoForge-only hooks.

For the exact current event matrix, searchable by loader and version, use the HTML documentation. It now includes a dedicated callback-class column for every alias, showing either the shared PyFish wrapper class or the forwarded native NeoForge event class for specialized hooks:

- `documentation/documentation.html`

## IDE Support

PyFish now ships an installable shim package so a normal Python interpreter can understand the PyFish modules in an IDE.

This folder is designed to be distributable on its own, including inside a zip.

Fastest end-user flow:

1. extract `ide_support`
2. open the extracted folder
3. run `install_editable.bat` on Windows or `python -m pip install -e .` in a terminal
4. run `python verify_install.py`
5. select that same Python interpreter in the IDE

What the current IDE support now adds on top of plain imports:

- typed `PlayerHandle`, `EntityHandle`, `WorldHandle`, `ServerHandle`, and `BlockPosHandle`
- typed callback wrappers such as `PlayerEvent`, `PlayerChatEvent`, `BlockBreakEvent`, `PlayerInteractBlockEvent`, `EntitySpawnEvent`, and `LivingDamageEvent`
- NeoForge-native event names such as `BlockEvent.EntityPlaceEvent`, `PlayerXpEvent.XpChange`, `ExplosionEvent.Detonate`, `PlayerEvent.ItemCraftedEvent`, and `LivingEvent.LivingJumpEvent`
- better suggestions for event methods like `getPlayer()`, `getEntity()`, `getLevel()`, `getPos()`, `getTarget()`, and `getMessageString()`
- richer content API hints for `items`, `blocks`, `recipes`, `tags`, `textures`, and `tabs`

Example:

```python
from pyfish import mc, PlayerChatEvent, BlockBreakEvent

def on_player_chat(event: PlayerChatEvent):
    player = event.getPlayer()
    message = event.getMessageString()
    if player is not None:
        mc.send_message(player, f"You said: {message}")

def on_block_break(event: BlockBreakEvent):
    player = event.getPlayer()
    pos = event.getPos()
    if player is not None and pos is not None:
        mc.send_message(player, f"Broken at {pos.getX()} {pos.getY()} {pos.getZ()}")
```

Repository-root install:

```bash
python -m pip install -e documentation/ide_support
```

Windows helper:

```bat
documentation\ide_support\install_editable.bat
```

Zip-friendly files included:

- `documentation/ide_support/START_HERE.txt`
- `documentation/ide_support/README.md`
- `documentation/ide_support/install_editable.bat`
- `documentation/ide_support/verify_install.py`

What the shim exposes:

- `pyfish`
- `java_asyncio`
- `java_logging`
- `java_multiprocessing`
- `java_pathlib`
- `java_pillow`
- `java_pyperclip`
- `java_requests`
- `java_sqlite3`
- `java_subprocess`
- `java_uuid`
- `java_websocket`

What it is for:

- autocomplete
- hover documentation
- linting
- editor import resolution

Recommended IDE setup:

- install the package into one Python interpreter
- configure VS Code or PyCharm to use that exact same interpreter
- confirm the setup with `python verify_install.py`

What it is not:

- not the actual Minecraft runtime
- not a full simulation of server registries or Minecraft world state

## Validation Pack

PyFish now ships a ready-to-copy validation pack inside the repository:

- `documentation/validation_pack/pyfish/qa/scripts/full_validation.py`
- `documentation/VALIDATION_CHECKLIST.md`

Install steps:

1. Copy `documentation/validation_pack/pyfish/` into the root of a Minecraft instance or server.
2. The final runtime path should become `pyfish/qa/scripts/full_validation.py`.
3. Start the game or server with PyFish installed.

The validation pack covers:

- shared `mc` runtime helpers
- integrated dynamic content registration
- shared event callbacks
- a wide chunk of the bundled `java_*` helper modules

Useful in-game commands include:

- `!pyfish help`
- `!pyfish status`
- `!pyfish libs`
- `!pyfish block`
- `!pyfish break`
- `!pyfish bee`
- `!pyfish scan`
- `!pyfish cleanup`
- `!pyfish particle`
- `!pyfish sound`
- `!pyfish command`
- `!pyfish day`
- `!pyfish night`
- `!pyfish hop`
- `!pyfish lightning`
- `!pyfish boom`

Optional environment-dependent commands:

- `!pyfish requests`
- `!pyfish subprocess`
- `!pyfish clipboard`

## Native Libraries

PyFish now documents only the helper modules still bundled in the base mod.

Current set:

- `java_requests`
  Official docs: https://requests.readthedocs.io/en/latest/
- `java_sqlite3`
  Official docs: https://docs.python.org/3/library/sqlite3.html
- `java_asyncio`
  Official docs: https://docs.python.org/3/library/asyncio.html
- `java_multiprocessing`
  Thread-backed compatibility layer
- `java_pathlib`
  Official docs: https://docs.python.org/3/library/pathlib.html
- `java_logging`
  Official docs: https://docs.python.org/3/library/logging.html
- `java_websocket`
  Official docs: https://websocket-client.readthedocs.io/
- `java_uuid`
  Official docs: https://docs.python.org/3/library/uuid.html
- `java_subprocess`
  Official docs: https://docs.python.org/3/library/subprocess.html
- `java_pyperclip`
  Official docs: https://pyperclip.readthedocs.io/en/latest/
- `java_pillow`
  Official docs: https://pillow.readthedocs.io/en/stable/

Notes:

- `java_multiprocessing` is thread-backed, not process-isolated.
- `java_requests` and `java_websocket` depend on network access.
- `java_subprocess` depends on local OS permissions and available tools.
- `java_pyperclip` is mainly meaningful on desktop clients.

## Build Outputs

PyFish is built per loader and per validated version profile.

Useful profile ids:

- `mc1211`
- `mc1212`
- `mc1213`
- `mc1214`
- `mc1215`
- `mc1216`
- `mc1217`
- `mc1218`
- `mc1219`
- `mc12110`
- `mc12111`

Typical outputs:

- `build/profiles/<profile>/fabric/libs/pyfish-fabric-<minecraft>-1.2.0.jar`
- `build/profiles/<profile>/neoforge/libs/pyfish-neoforge-<minecraft>-1.2.0.jar`

## Mod Template

The repository also ships a PyFish-powered mod template:

- `documentation/pyfish_mod_template/`

Use it when you want:

- a real Java mod that embeds PyFish scripts
- content registered under that mod's namespace instead of under `pyfish`
- a starting point for shipping PyFish as part of a proper mod rather than only as a modpack script environment

## Final Note

For the most detailed, up-to-date, and loader-aware reference, open:

- `documentation/documentation.html`

That is where the per-function pseudo-pages, loader switch, version switch, and event matrix now live.
