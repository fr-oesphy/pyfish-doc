# PyFish Documentation

PyFish embeds GraalPy in Minecraft so Python scripts and Python-powered mods can
run on Fabric and NeoForge.

[Open the interactive HTML documentation](index.html) for the loader and
version selectors, searchable events, and detailed per-function pages.

## Supported Environments

- PyFish version: `1.2.0`
- Minecraft: `1.21.1` through `1.21.11`
- Java: `21`
- Loaders: Fabric and NeoForge
- Python runtime: bundled GraalPy

PyFish can be used in three ways:

- quick scripts in `pyfish/scripts/`
- organized modpack logic in `pyfish/<namespace>/scripts/`
- distributable Python mods as `.pyz` files or normal loader JARs

The same shared API covers events, players, entities, world changes, commands,
messages, particles, sounds, dynamic items, blocks, recipes, tags, textures,
and creative tabs.

## Installation

Download the PyFish JAR matching both your Minecraft version and loader from
the [official Modrinth versions page](https://modrinth.com/mod/bdP4b2gP/versions).

### Fabric

1. Install Fabric Loader for the selected Minecraft version.
2. Install Fabric API for the same Minecraft version.
3. Put the matching `pyfish-fabric-...`.jar in the Minecraft `mods/` folder.
4. Start Minecraft with Java 21.

### NeoForge

1. Install NeoForge for the selected Minecraft version.
2. Put the matching `pyfish-neoforge-...`.jar in the Minecraft `mods/` folder.
3. Start Minecraft with Java 21.

Do not mix Fabric and NeoForge JARs or use a JAR made for another Minecraft
version.

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

Quick scripts and organized modpack scripts live in the `pyfish/` folder.
Packaged `.pyz` mods live in the normal Minecraft `mods/` folder beside the
PyFish JAR.

```text
.minecraft/
|-- mods/
|   |-- pyfish-neoforge-1.21.11-1.2.0.jar
|   `-- example_mod-1.0.0.pyz
|-- config/
`-- pyfish/
    |-- scripts/
    |   `-- global_fix.py
    `-- my_modpack/
        |-- requirements.txt
        |-- assets/
        |   `-- my_modpack/
        |       `-- textures/
        |           `-- item/
        |               `-- ruby.png
        |-- data/
        |   `-- my_modpack/
        |       `-- recipes/
        |           `-- ruby.json
        `-- scripts/
            |-- init.py
            `-- gameplay.py
```

Namespace rules:

- `pyfish/scripts/*.py` uses the `pyfish` namespace.
- `pyfish/<name>/scripts/*.py` uses `<name>` as its namespace, even when no
  installed loader mod has that id. This is useful for modpacks.
- A `.pyz` mod uses the validated `id` from its `pyfish.mod.json`.
- Scripts bundled in a normal Fabric or NeoForge mod JAR use that JAR's mod id.

For example, `items.register_item("ruby", {...})` inside
`pyfish/my_pack/scripts/` registers `my_pack:ruby`.

A logical folder or `.pyz` can include `requirements.txt`. PyFish installs
pure-Python dependencies into an isolated folder for that namespace and reuses
them until the requirements change.

Static Minecraft resources use the normal layout in every format:

- external logical folders: `pyfish/<namespace>/assets/<namespace>/...` and `pyfish/<namespace>/data/<namespace>/...`
- `.pyz` archives: `src/assets/<namespace>/...` and `src/data/<namespace>/...`
- loader JAR mods: `src/main/resources/assets/<namespace>/...` and `src/main/resources/data/<namespace>/...`

## Creating PyFish Mods

PyFish offers two distributable mod formats.

| Format | Best for | Files users install |
| --- | --- | --- |
| Python `.pyz` | A mod written entirely with the PyFish API | The same `.pyz` on Fabric and NeoForge |
| Loader JAR | A mod that must appear as a native loader mod | One Fabric JAR or one NeoForge JAR |

Both formats require the normal PyFish JAR.

### Recommended: Python-only `.pyz`

A `.pyz` is a ZIP-based Python application. You do not create it manually:
the provided builder collects the project and generates the final file.

[Download the .pyz mod template](pyfish_pyz_template.zip)

#### 1. Extract the template

After extraction:

```text
pyfish_pyz_template/
|-- build.py
`-- src/
    |-- pyfish.mod.json
    `-- __main__.py
```

Optional files can be added later:

```text
src/
|-- pyfish.mod.json
|-- __main__.py
|-- requirements.txt
|-- assets/
|   `-- example_mod/
|       `-- textures/
|           `-- item/
|               `-- python_token.png
|-- data/
|   `-- example_mod/
|       `-- recipes/
|           `-- python_token.json
`-- example_mod/
    |-- __init__.py
    |-- content.py
    `-- events.py
```

Only `pyfish.mod.json` and `__main__.py` are required.

#### 2. Describe the mod

Edit `src/pyfish.mod.json`:

```json
{
  "schema_version": 1,
  "id": "example_mod",
  "name": "Example Mod",
  "version": "1.0.0",
  "description": "My Python-powered Minecraft mod.",
  "authors": ["Your name"],
  "license": "MIT",
  "homepage": "",
  "dependencies": {
    "pyz": [
      {"id": "shared_core", "version": ">=1.2.0 <2.0.0"},
      {"id": "ui_pack", "version": "1.4.x || 1.5.x"}
    ],
    "jar": [
      {"id": "fabric-api", "version": "[0.115.0,)"},
      {"id": "another_mod", "version": "!=2.0.0"}
    ]
  }
}
```

Required fields:

- `schema_version`: currently `1`
- `id`: the content namespace
- `name`: displayed mod name
- `version`: your mod version
- `dependencies.pyz`: optional PyFish namespaces that must load before this archive executes
- `dependencies.jar`: optional Fabric or NeoForge mod ids that must already be installed

Dependency entry formats:

- `"shared_core"` means "dependency present, any version"
- `{"id": "shared_core", "version": ">=1.2.0 <2.0.0"}` adds a version constraint

Supported constraint styles:

- exact: `1.2.3`
- comparisons: `>=1.2.0`, `<=2.0.0`, `!=1.4.0`
- combined comparisons: `>=1.2.0 <2.0.0`
- bracket ranges: `[1.2.0,2.0.0)`, `[1.2.0,)`, `(,2.0.0]`
- wildcards: `1.21.x`, `1.2.*`
- alternatives: `1.2.x || 2.0.x`

The id accepts lowercase letters, numbers, underscores, dots, and dashes.
`minecraft` and `pyfish` are reserved.

#### 3. Write the entrypoint

Edit `src/__main__.py`:

```python
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
```

PyFish injects the four `PYFISH_MOD...` globals before the entrypoint runs.
Unqualified content ids inherit the manifest id, so `python_token` above
becomes `example_mod:python_token`.

An `__init__.py` is only needed inside an internal Python package. It is not
the mod manifest.

#### 4. Generate the `.pyz`

Open a terminal in the extracted template folder.

Windows:

```text
py -3 build.py
```

Any platform where Python uses the `python` command:

```text
python build.py
```

The builder creates:

```text
dist/<mod_id>-<version>.pyz
```

Building needs Python 3.10 or newer. It does not need Minecraft, Gradle, Fabric
development tools, or NeoForge development tools.

#### 5. Install and distribute

Move the generated archive beside PyFish:

```text
.minecraft/
`-- mods/
    |-- pyfish-fabric-1.21.1-1.2.0.jar
    `-- example_mod-1.0.0.pyz
```

The exact PyFish JAR name changes with the selected loader and Minecraft
version. The `.pyz` itself is loader-neutral.

Share the generated `.pyz`, not the source template. Users install PyFish and
place the archive in their normal `mods/` folder.

#### Dependencies and multiple files

Add a root `src/requirements.txt` for pure-Python packages. PyFish installs
them under `pyfish/libs/<mod_id>/` and caches them by requirements content.

Static resources can live next to the Python code. Use the same standard
resource-pack and data-pack layout that a normal Minecraft mod would use:

```text
src/
|-- assets/<namespace>/textures/...
|-- assets/<namespace>/models/...
|-- assets/<namespace>/lang/...
`-- data/<namespace>/...
```

For larger projects, create a package below `src/` and import it normally:

```python
from example_mod.content import register_content
from example_mod.events import register_events

register_content()
register_events()
```

The archive stays on Python's import path after startup, so callbacks can still
import internal modules later.

#### Installation side

- Server-only event logic can be installed only on the server.
- Client-only helpers can be installed only on the client.
- Mods registering items, blocks, tabs, textures, or other synchronized content
  should install PyFish and the `.pyz` on both the server and every client.
- A server can set `requireClientPyFish=true` in
  `config/pyfish/server.properties` when clients must have PyFish.

Only install `.pyz` files from sources you trust: they contain executable
Python with the same PyFish access as normal scripts.

### Native Fabric and NeoForge JAR mods

Use the JAR template when the project must appear in the loader's mod list or
when another mod needs to declare it as a dependency.

[Download the multi-loader JAR mod template](pyfish_mod_template.zip)

The template does not require Java source code. It packages loader metadata and
Python resources, then creates separate JARs.

1. Edit `gradle.properties`.
2. Choose a unique `mod_id`.
3. Rename `src/main/resources/pyfish/template_mod/` to
   `src/main/resources/pyfish/<mod_id>/`.
4. Write scripts inside that folder's `scripts/` directory.
5. Put static resources in `src/main/resources/assets/<mod_id>/...` and
   `src/main/resources/data/<namespace>/...` as needed.
6. Run:

```text
gradlew.bat build
```

On Linux or macOS use `./gradlew build`.

Outputs:

```text
build/libs/<mod_id>-fabric-<version>.jar
build/libs/<mod_id>-neoforge-<version>.jar
```

Install only the JAR matching the user's loader. Scripts bundled this way
automatically use the loader mod id as their content namespace.

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

For the exact current matrix, open the
[interactive loader comparison](index.html#loader-differences).

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

Good visible checks:

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

For the exact current event matrix, searchable by loader and version, open the
[interactive Event System](index.html#events). It includes a callback
class for every alias.

## IDE Support

[Download ide_support.zip](ide_support.zip) to add autocomplete, type hints, hover
documentation, and import resolution to a normal Python IDE.

The package is only for editing scripts. Minecraft still runs the real PyFish
API through GraalPy.

### Install on Windows

1. Extract `ide_support.zip`.
2. Open the extracted `ide_support` folder.
3. Double-click `install_editable.bat`.
4. Run `python verify_install.py`.
5. Select the same Python interpreter in the IDE.

The installer searches common Python installations, including the Microsoft
Store launcher. If a terminal cannot find `python`, try:

```text
py -3 -m pip install -e .
py -3 verify_install.py
```

### Install manually

From the extracted folder:

```text
python -m pip install -e .
python verify_install.py
```

### Select the interpreter

VS Code:

1. Press `Ctrl+Shift+P`.
2. Run `Python: Select Interpreter`.
3. Select the interpreter used during installation.

PyCharm:

1. Open `Settings -> Project -> Python Interpreter`.
2. Select the interpreter used during installation.
3. Reopen the script.

### Typed callbacks

Annotating callbacks is valid both in the IDE and at runtime:

```python
from pyfish import BlockBreakEvent, PlayerChatEvent, mc

def on_player_chat(event: PlayerChatEvent) -> None:
    player = event.getPlayer()
    if player is not None:
        mc.send_message(player, f"You said: {event.getMessageString()}")

def on_block_break(event: BlockBreakEvent) -> None:
    player = event.getPlayer()
    pos = event.getPos()
    if player is not None and pos is not None:
        mc.send_message(player, f"Broken at {pos.getX()} {pos.getY()} {pos.getZ()}")
```

The package includes typed player, entity, world, server, position, event,
content-registration, and bundled `java_*` module surfaces. It does not launch
Minecraft or simulate a live world.

## Native Libraries

The following Java-backed helper modules are bundled with PyFish:

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
