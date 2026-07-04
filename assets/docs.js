const PYFISH_DOC_MOD_VERSION = "1.2.0";
const PYFISH_DOC_FABRIC_LOADER_VERSION = "0.16.9";
const PYFISH_DOC_DEFAULT_PROFILE_ID = "mc1211";

const PYFISH_DOC_LOADERS = {
    fabric: {
        name: "Fabric",
        short: "Shared bridge",
        bridgeSummary: "Shared bridge: lifecycle, player, world, chat, entity lifecycle, and living damage callbacks.",
        eventSummary: "Fabric now covers the shared gameplay surface much better, but NeoForge still remains broader on specialized item, block, and entity hooks."
    },
    neoforge: {
        name: "NeoForge",
        short: "Widest bridge",
        bridgeSummary: "Widest current bridge: broader entity, item, block, and lifecycle coverage.",
        eventSummary: "NeoForge currently exposes the broadest documented event surface."
    }
};

const PYFISH_DOC_VERSION_PROFILES = [
    { id: "mc1211", minecraftVersion: "1.21.1", fabricApiVersion: "0.116.12+1.21.1", neoforgeVersion: "21.1.215" },
    { id: "mc1212", minecraftVersion: "1.21.2", fabricApiVersion: "0.106.1+1.21.2", neoforgeVersion: "21.2.1-beta" },
    { id: "mc1213", minecraftVersion: "1.21.3", fabricApiVersion: "0.114.1+1.21.3", neoforgeVersion: "21.3.96" },
    { id: "mc1214", minecraftVersion: "1.21.4", fabricApiVersion: "0.118.5+1.21.4", neoforgeVersion: "21.4.157" },
    { id: "mc1215", minecraftVersion: "1.21.5", fabricApiVersion: "0.119.5+1.21.5", neoforgeVersion: "21.5.97" },
    { id: "mc1216", minecraftVersion: "1.21.6", fabricApiVersion: "0.128.2+1.21.6", neoforgeVersion: "21.6.20-beta" },
    { id: "mc1217", minecraftVersion: "1.21.7", fabricApiVersion: "0.129.0+1.21.7", neoforgeVersion: "21.7.25-beta" },
    { id: "mc1218", minecraftVersion: "1.21.8", fabricApiVersion: "0.136.0+1.21.8", neoforgeVersion: "21.8.53" },
    { id: "mc1219", minecraftVersion: "1.21.9", fabricApiVersion: "0.133.12+1.21.9", neoforgeVersion: "21.9.16-beta" },
    { id: "mc12110", minecraftVersion: "1.21.10", fabricApiVersion: "0.138.4+1.21.10", neoforgeVersion: "21.10.64" },
    { id: "mc12111", minecraftVersion: "1.21.11", fabricApiVersion: "0.140.2+1.21.11", neoforgeVersion: "21.11.42" }
];

const PYFISH_DOC_VERSION_PROFILE_MAP = Object.fromEntries(
    PYFISH_DOC_VERSION_PROFILES.map((profile) => [profile.id, profile])
);

const PYFISH_DOC_EVENTS = [
    { alias: "on_block_break", group: "block", side: "Server", access: "getPlayer(), getEntity(), getLevel(), getPos()", details: "Fires after a player breaks a block.", fabric: "PlayerBlockBreakEvents.AFTER", neoforge: "BlockEvent.BreakEvent" },
    {
        alias: "on_block_place",
        group: "block",
        side: "Server",
        access: "getPlayer(), getEntity(), getLevel(), getPos(), getHand()",
        neoforgeAccess: "Native NeoForge BlockEvent.EntityPlaceEvent methods",
        details: "Tracks block placement by an entity or player.",
        fabric: "UseBlockCallback.EVENT (block item placement path)",
        neoforge: "BlockEvent.EntityPlaceEvent"
    },
    { alias: "on_crop_grow", group: "block", side: "Server", access: "NeoForge event object", details: "Useful for agriculture rules or scripted farming.", fabric: null, neoforge: "BlockEvent.CropGrowEvent.Post" },
    { alias: "on_block_neighbor_change", group: "block", side: "Server", access: "NeoForge event object", details: "Reports neighbor updates around a block.", fabric: null, neoforge: "BlockEvent.NeighborNotifyEvent" },
    { alias: "on_note_block_play", group: "block", side: "Server", access: "NeoForge event object", details: "Triggers when a note block plays.", fabric: null, neoforge: "NoteBlockEvent.Play" },
    { alias: "on_player_join", group: "player", side: "Server", access: "getPlayer(), getEntity(), getLevel(), getServer()", details: "Fires when a player joins the server.", fabric: "ServerPlayConnectionEvents.JOIN", neoforge: "PlayerEvent.PlayerLoggedInEvent" },
    { alias: "on_player_leave", group: "player", side: "Server", access: "getPlayer(), getEntity(), getLevel(), getServer()", details: "Fires when a player disconnects.", fabric: "ServerPlayConnectionEvents.DISCONNECT", neoforge: "PlayerEvent.PlayerLoggedOutEvent" },
    { alias: "on_player_chat", group: "player", side: "Server", access: "getPlayer(), getEntity(), getLevel(), getMessage().getString()", details: "Exposes chat content to Python callbacks through a chat component wrapper.", fabric: "ServerMessageEvents.CHAT_MESSAGE", neoforge: "ServerChatEvent" },
    { alias: "on_player_respawn", group: "player", side: "Server", access: "getPlayer(), getEntity(), getLevel(), getServer()", details: "Fires after respawn logic completes.", fabric: "ServerPlayerEvents.AFTER_RESPAWN", neoforge: "PlayerRespawnEvent" },
    {
        alias: "on_player_clone",
        group: "player",
        side: "Server",
        access: "getOldPlayer(), getPlayer(), getEntity(), getLevel(), isAlive()",
        details: "Clone-related lifecycle event during player recreation.",
        fabric: "ServerPlayerEvents.COPY_FROM",
        neoforge: "PlayerEvent.Clone"
    },
    { alias: "on_player_tick", group: "player", side: "Server", access: "getPlayer(), getEntity(), getLevel()", details: "Useful for periodic per-player systems.", fabric: "ServerTickEvents.END_SERVER_TICK", neoforge: "PlayerTickEvent.Post" },
    { alias: "on_player_interact_entity", group: "interaction", side: "Server", access: "getPlayer(), getEntity(), getLevel(), getTarget(), getHand()", details: "Runs when a player uses an entity.", fabric: "UseEntityCallback.EVENT", neoforge: "PlayerInteractEvent.EntityInteract" },
    { alias: "on_player_interact_block", group: "interaction", side: "Server", access: "getPlayer(), getEntity(), getLevel(), getPos(), getHand()", details: "Runs when a player interacts with a block.", fabric: "UseBlockCallback.EVENT", neoforge: "PlayerInteractEvent.RightClickBlock" },
    { alias: "on_player_xp_change", group: "player", side: "Server", access: "NeoForge event object", details: "Fires on XP changes.", fabric: null, neoforge: "PlayerXpEvent.XpChange" },
    { alias: "on_player_sleep", group: "player", side: "Server", access: "NeoForge event object", details: "Triggers when the player starts sleeping.", fabric: null, neoforge: "PlayerSleepInBedEvent" },
    { alias: "on_player_wake_up", group: "player", side: "Server", access: "NeoForge event object", details: "Triggers when the player wakes up.", fabric: null, neoforge: "PlayerWakeUpEvent" },
    { alias: "on_item_crafted", group: "item", side: "Server", access: "NeoForge event object", details: "Reports crafted items.", fabric: null, neoforge: "PlayerEvent.ItemCraftedEvent" },
    { alias: "on_item_smelted", group: "item", side: "Server", access: "NeoForge event object", details: "Reports smelted items.", fabric: null, neoforge: "PlayerEvent.ItemSmeltedEvent" },
    {
        alias: "on_entity_death",
        group: "entity",
        side: "Server",
        access: "getEntity(), getPlayer(), getLevel(), getDamageSourceName()",
        details: "Entity death callback.",
        fabricDetails: "Fabric observes living-entity deaths through the shared wrapper.",
        neoforgeDetails: "NeoForge also routes this alias into the shared PyFish death wrapper.",
        fabric: "ServerLivingEntityEvents.AFTER_DEATH",
        neoforge: "LivingDeathEvent"
    },
    {
        alias: "on_entity_hurt",
        group: "entity",
        side: "Server",
        access: "getEntity(), getPlayer(), getLevel(), getAmount(), getDamageSourceName()",
        details: "Pre-damage living hurt callback.",
        fabricDetails: "Fabric observes incoming living damage before mitigation through the shared wrapper. The callback is observe-only and does not cancel damage.",
        neoforgeDetails: "NeoForge also routes this alias into the shared PyFish living-damage wrapper.",
        fabric: "ServerLivingEntityEvents.ALLOW_DAMAGE",
        neoforge: "LivingHurtEvent"
    },
    {
        alias: "on_entity_damage",
        group: "entity",
        side: "Server",
        access: "getEntity(), getPlayer(), getLevel(), getAmount(), getDamageTaken(), isBlocked(), getDamageSourceName()",
        details: "Damage-applied living callback.",
        fabricDetails: "Fabric fires this after living damage has been applied or blocked.",
        neoforgeDetails: "NeoForge also routes this alias into the shared PyFish living-damage wrapper.",
        fabric: "ServerLivingEntityEvents.AFTER_DAMAGE",
        neoforge: "LivingDamageEvent"
    },
    {
        alias: "on_entity_spawn",
        group: "entity",
        side: "Server",
        access: "getEntity(), getPlayer(), getLevel()",
        details: "Entity enters the level.",
        neoforgeDetails: "NeoForge also routes this alias into the shared PyFish entity-spawn wrapper.",
        fabric: "ServerEntityEvents.ENTITY_LOAD",
        neoforge: "EntityJoinLevelEvent"
    },
    {
        alias: "on_entity_dimension_change",
        group: "entity",
        side: "Server",
        access: "Loader-specific callback object",
        fabricAccess: "getEntity(), getPlayer(), getLevel(), getOriginLevel()",
        neoforgeAccess: "NeoForge EntityTravelToDimensionEvent object",
        details: "Entity attempts or completes a dimension change.",
        fabricDetails: "Fabric fires this after an entity or player has been moved into the destination world.",
        fabric: "ServerEntityWorldChangeEvents.AFTER_ENTITY_CHANGE_WORLD / AFTER_PLAYER_CHANGE_WORLD",
        neoforge: "EntityTravelToDimensionEvent"
    },
    { alias: "on_living_jump", group: "entity", side: "Server", access: "NeoForge event object", details: "Jump callback for living entities.", fabric: null, neoforge: "LivingEvent.LivingJumpEvent" },
    { alias: "on_living_fall", group: "entity", side: "Server", access: "NeoForge event object", details: "Fall callback for living entities.", fabric: null, neoforge: "LivingFallEvent" },
    { alias: "on_living_heal", group: "entity", side: "Server", access: "NeoForge event object", details: "Heal callback for living entities.", fabric: null, neoforge: "LivingHealEvent" },
    { alias: "on_animal_tame", group: "entity", side: "Server", access: "NeoForge event object", details: "Animal taming callback.", fabric: null, neoforge: "AnimalTameEvent" },
    { alias: "on_item_dropped", group: "item", side: "Server", access: "NeoForge event object", details: "Item toss callback.", fabric: null, neoforge: "ItemTossEvent" },
    { alias: "on_item_pickup", group: "item", side: "Server", access: "NeoForge event object", details: "Item pickup callback.", fabric: null, neoforge: "ItemEntityPickupEvent" },
    { alias: "on_explosion", group: "world", side: "Server", access: "NeoForge event object", details: "Explosion detonation callback.", fabric: null, neoforge: "ExplosionEvent.Detonate" },
    { alias: "on_command_executed", group: "server", side: "Server", access: "NeoForge event object", details: "Command pipeline callback.", fabric: null, neoforge: "CommandEvent" },
    { alias: "on_level_load", group: "world", side: "Server", access: "getLevel()", details: "Runs when a world loads.", fabric: "ServerWorldEvents.LOAD", neoforge: "LevelEvent.Load" },
    { alias: "on_level_save", group: "world", side: "Server", access: "getLevel()", details: "Runs before or during a world save depending on the backend.", fabric: "ServerLifecycleEvents.BEFORE_SAVE", neoforge: "LevelEvent.Save" },
    { alias: "on_level_unload", group: "world", side: "Server", access: "getLevel()", details: "Runs when a world unloads.", fabric: "ServerWorldEvents.UNLOAD", neoforge: "LevelEvent.Unload" },
    { alias: "on_server_starting", group: "server", side: "Server", access: "getServer()", details: "Server is starting.", fabric: "ServerLifecycleEvents.SERVER_STARTING", neoforge: "ServerStartingEvent" },
    { alias: "on_server_started", group: "server", side: "Server", access: "getServer()", details: "Server is fully started.", fabric: "ServerLifecycleEvents.SERVER_STARTED", neoforge: "ServerStartedEvent" },
    { alias: "on_server_stopping", group: "server", side: "Server", access: "getServer()", details: "Server is stopping.", fabric: "ServerLifecycleEvents.SERVER_STOPPING", neoforge: "ServerStoppingEvent" },
    { alias: "on_server_stopped", group: "server", side: "Server", access: "getServer()", details: "Server has stopped.", fabric: "ServerLifecycleEvents.SERVER_STOPPED", neoforge: "ServerStoppedEvent" },
    { alias: "on_server_tick", group: "server", side: "Server", access: "getServer()", details: "End of server tick callback.", fabric: "ServerTickEvents.END_SERVER_TICK", neoforge: "ServerTickEvent.Post" },
    { alias: "on_level_tick", group: "world", side: "Server", access: "getLevel()", details: "End of level tick callback.", fabric: "ServerTickEvents.END_WORLD_TICK", neoforge: "LevelTickEvent.Post" }
];

const PYFISH_DOC_EVENT_CALLBACK_CLASSES = {
    on_block_break: { fabric: "BlockBreakEvent", neoforge: "BlockBreakEvent" },
    on_block_place: { fabric: "PlayerInteractBlockEvent", neoforge: "BlockEvent.EntityPlaceEvent" },
    on_crop_grow: { fabric: null, neoforge: "BlockEvent.CropGrowEvent.Post" },
    on_block_neighbor_change: { fabric: null, neoforge: "BlockEvent.NeighborNotifyEvent" },
    on_note_block_play: { fabric: null, neoforge: "NoteBlockEvent.Play" },
    on_player_join: { fabric: "PlayerEvent", neoforge: "PlayerEvent" },
    on_player_leave: { fabric: "PlayerEvent", neoforge: "PlayerEvent" },
    on_player_chat: { fabric: "PlayerChatEvent", neoforge: "PlayerChatEvent" },
    on_player_respawn: { fabric: "PlayerEvent", neoforge: "PlayerEvent" },
    on_player_clone: { fabric: "PlayerCloneEvent", neoforge: "PlayerCloneEvent" },
    on_player_tick: { fabric: "PlayerEvent", neoforge: "PlayerEvent" },
    on_player_interact_entity: { fabric: "PlayerInteractEntityEvent", neoforge: "PlayerInteractEntityEvent" },
    on_player_interact_block: { fabric: "PlayerInteractBlockEvent", neoforge: "PlayerInteractBlockEvent" },
    on_player_xp_change: { fabric: null, neoforge: "PlayerXpEvent.XpChange" },
    on_player_sleep: { fabric: null, neoforge: "PlayerSleepInBedEvent" },
    on_player_wake_up: { fabric: null, neoforge: "PlayerWakeUpEvent" },
    on_item_crafted: { fabric: null, neoforge: "PlayerEvent.ItemCraftedEvent" },
    on_item_smelted: { fabric: null, neoforge: "PlayerEvent.ItemSmeltedEvent" },
    on_entity_death: { fabric: "LivingDeathEvent", neoforge: "LivingDeathEvent" },
    on_entity_hurt: { fabric: "LivingDamageEvent", neoforge: "LivingDamageEvent" },
    on_entity_damage: { fabric: "LivingDamageEvent", neoforge: "LivingDamageEvent" },
    on_entity_spawn: { fabric: "EntitySpawnEvent", neoforge: "EntitySpawnEvent" },
    on_entity_dimension_change: { fabric: "EntityDimensionChangeEvent", neoforge: "EntityTravelToDimensionEvent" },
    on_living_jump: { fabric: null, neoforge: "LivingEvent.LivingJumpEvent" },
    on_living_fall: { fabric: null, neoforge: "LivingFallEvent" },
    on_living_heal: { fabric: null, neoforge: "LivingHealEvent" },
    on_animal_tame: { fabric: null, neoforge: "AnimalTameEvent" },
    on_item_dropped: { fabric: null, neoforge: "ItemTossEvent" },
    on_item_pickup: { fabric: null, neoforge: "ItemEntityPickupEvent" },
    on_explosion: { fabric: null, neoforge: "ExplosionEvent.Detonate" },
    on_command_executed: { fabric: null, neoforge: "CommandEvent" },
    on_level_load: { fabric: "LevelEvent", neoforge: "LevelEvent" },
    on_level_save: { fabric: "LevelEvent", neoforge: "LevelEvent" },
    on_level_unload: { fabric: "LevelEvent", neoforge: "LevelEvent" },
    on_server_starting: { fabric: "ServerEvent", neoforge: "ServerEvent" },
    on_server_started: { fabric: "ServerEvent", neoforge: "ServerEvent" },
    on_server_stopping: { fabric: "ServerEvent", neoforge: "ServerEvent" },
    on_server_stopped: { fabric: "ServerEvent", neoforge: "ServerEvent" },
    on_server_tick: { fabric: "ServerEvent", neoforge: "ServerEvent" },
    on_level_tick: { fabric: "LevelEvent", neoforge: "LevelEvent" }
};

const PYFISH_DOC_VIEWS = {
    overview: "Welcome",
    installation: "Installation",
    scripts: "External Scripts",
    "getting-started": "Getting Started",
    "callback-objects": "Callback Objects",
    "loader-differences": "Loader Differences",
    "api-content": "Dynamic Content API",
    "api-world": "World API",
    "api-players": "Players and Entities API",
    "api-utils": "Utils and Environment API",
    "api-detail": "API Detail",
    events: "Event System",
    "ide-support": "IDE Support",
    libraries: "Native Libraries",
    template: "Mod Template"
};

const PYFISH_DOC_VIEW_ALIASES = {
    "api-blocks": "api-content"
};

const PYFISH_DOC_DETAIL_PAGES = {
    "content-register-item": {
        title: "items.register_item(id, properties)",
        signature: "items.register_item(item_id: str, properties: ItemProperties) -> None",
        kind: "Dynamic content helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-content",
        parentLabel: "Dynamic Content API",
        useCase: "Simple runtime item registration",
        useNote: "Use this for normal items with custom texture, tab, durability, and callbacks.",
        summary: "Registers a basic item in the active Python namespace and makes it available like any other item id.",
        description: [
            "If the id has no explicit namespace, PyFish resolves it from the script context. Global scripts use the <span class=\"inline-code\">pyfish</span> namespace, logical Python mods use their folder name, and bundled real mods use their Java mod id.",
            "This helper is part of the base <span class=\"inline-code\">pyfish</span> module on every maintained version profile."
        ],
        parameters: [
            ["item_id", "Item id to register. Use a bare id to rely on PyFish namespace resolution, or use a fully-qualified id when you want to be explicit."],
            ["properties", "Dictionary of item properties such as <span class=\"inline-code\">texture</span>, <span class=\"inline-code\">stacksTo</span>, <span class=\"inline-code\">durability</span>, <span class=\"inline-code\">fireResistant</span>, <span class=\"inline-code\">tab</span>, and <span class=\"inline-code\">events</span>."]
        ],
        returns: "No return value. The item becomes available through its registry id after registration completes.",
        example: `from pyfish import items\n\nitems.register_item("signal_wand", {\n    "texture": "signal_wand",\n    "stacksTo": 1,\n    "durability": 64,\n    "tab": "utility",\n})`,
        notes: [
            "If you only need a consumable item, prefer <span class=\"inline-code\">items.register_food(...)</span> so the food values are documented explicitly.",
            "Dynamic item callbacks still live under the <span class=\"inline-code\">events</span> property, not under the global <span class=\"inline-code\">mc.on(...)</span> alias list."
        ],
        related: ["content-register-food", "content-register-tool", "content-callbacks"]
    },
    "content-register-food": {
        title: "items.register_food(id, nutrition, saturation, properties)",
        signature: "items.register_food(item_id: str, nutrition: int, saturation: float, properties: ItemProperties) -> None",
        kind: "Dynamic content helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-content",
        parentLabel: "Dynamic Content API",
        useCase: "Food items with normal hunger behavior",
        useNote: "Use this when an item should be edible and optionally always edible.",
        summary: "Registers a food item and attaches the hunger and saturation values directly at registration time.",
        description: [
            "Food registration behaves like normal item registration, but the nutrition and saturation values are first-class arguments instead of hidden inside a larger property map.",
            "The optional <span class=\"inline-code\">properties</span> dictionary still handles texture, creative tab placement, dynamic callbacks, and flags such as <span class=\"inline-code\">alwaysEdible</span>."
        ],
        parameters: [
            ["item_id", "Food item id, with the same namespace rules as the rest of the content API."],
            ["nutrition", "How many hunger points the food restores."],
            ["saturation", "Saturation modifier passed to the generated food properties."],
            ["properties", "Additional item properties such as texture, tab, or food callbacks like <span class=\"inline-code\">eat</span>."]
        ],
        returns: "No return value.",
        example: `from pyfish import items\n\nitems.register_food("ruby_snack", 5, 0.8, {\n    "texture": "ruby_snack",\n    "alwaysEdible": True,\n    "tab": "ruby_tab",\n})`,
        notes: [
            "Food callbacks still belong in the <span class=\"inline-code\">events</span> object when you want an <span class=\"inline-code\">eat</span> hook.",
            "Use a bare id when you want the content to stay inside the current script namespace automatically."
        ],
        related: ["content-register-item", "content-callbacks"]
    },
    "content-register-tool": {
        title: "items.register_tool(id, type, properties)",
        signature: "items.register_tool(item_id: str, tool_type: str, properties: ItemProperties) -> None",
        kind: "Dynamic content helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-content",
        parentLabel: "Dynamic Content API",
        useCase: "Tools, weapons, and multitools",
        useNote: "Use this for swords, pickaxes, shovels, axes, hoes, and multitools.",
        summary: "Registers a generated tool item and the tier data it needs from a single Python definition.",
        description: [
            "PyFish supports common tool categories and maps them into the current Minecraft version profile so you do not have to write separate Java registration code for every loader.",
            "The property map controls both the item surface and the generated tier values, including durability, mining speed, damage bonus, repair item, and enchantment value."
        ],
        parameters: [
            ["item_id", "Tool id to register."],
            ["tool_type", "One of <span class=\"inline-code\">sword</span>, <span class=\"inline-code\">pickaxe</span>, <span class=\"inline-code\">shovel</span>, <span class=\"inline-code\">axe</span>, <span class=\"inline-code\">hoe</span>, or <span class=\"inline-code\">multitool</span>."],
            ["properties", "Tier and item configuration, commonly including <span class=\"inline-code\">durability</span>, <span class=\"inline-code\">damage</span>, <span class=\"inline-code\">attackSpeed</span>, <span class=\"inline-code\">speed</span>, <span class=\"inline-code\">repairItem</span>, and <span class=\"inline-code\">texture</span>."]
        ],
        returns: "No return value.",
        example: `from pyfish import items\n\nitems.register_tool("ruby_multitool", "multitool", {\n    "texture": "ruby_multitool",\n    "durability": 640,\n    "damage": 5,\n    "attackSpeed": -2.2,\n    "speed": 8.5,\n    "damageBonus": 3.0,\n    "repairItem": "minecraft:iron_ingot",\n})`,
        notes: [
            "PyFish also assigns the relevant vanilla tool tags automatically for supported tool classes.",
            "When you only need a cosmetic or utility item, <span class=\"inline-code\">items.register_item(...)</span> is simpler."
        ],
        related: ["content-register-item", "content-register-block"]
    },
    "content-register-block": {
        title: "blocks.register_block(id, properties)",
        signature: "blocks.register_block(block_id: str, properties: BlockProperties) -> None",
        kind: "Dynamic content helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-content",
        parentLabel: "Dynamic Content API",
        useCase: "Generated blocks with matching item models",
        useNote: "Use this for simple generated blocks before reaching for custom Java-side behavior.",
        summary: "Registers a block, its matching block item, and the generated resource scaffolding needed to make it usable in game.",
        description: [
            "The block helper is designed for runtime content packs and PyFish-powered mods that need new blocks without maintaining a parallel Java registry layer for each loader.",
            "Texture definitions can be simple or directional. A single texture id works for cube-all style blocks, while maps allow top/bottom/side or the full directional faces."
        ],
        parameters: [
            ["block_id", "Block id to register."],
            ["properties", "Dictionary with block data such as <span class=\"inline-code\">texture</span>, <span class=\"inline-code\">destroyTime</span>, <span class=\"inline-code\">explosionResistance</span>, <span class=\"inline-code\">requiresCorrectToolForDrops</span>, <span class=\"inline-code\">tab</span>, and <span class=\"inline-code\">events</span>."]
        ],
        returns: "No return value.",
        example: `from pyfish import blocks\n\nblocks.register_block("ruby_block", {\n    "texture": {\n        "top": "ruby_block_top",\n        "bottom": "ruby_block_bottom",\n        "side": "ruby_block_side"\n    },\n    "destroyTime": 3.0,\n    "explosionResistance": 6.0,\n    "requiresCorrectToolForDrops": True,\n    "tab": "ruby_tab",\n})`,
        notes: [
            "Registering a block also registers the matching block item automatically.",
            "If you want an interaction callback on the block itself, add a <span class=\"inline-code\">use</span> function inside the <span class=\"inline-code\">events</span> object."
        ],
        related: ["content-callbacks", "mc-set-block", "mc-get-block-id"]
    },
    "content-recipes": {
        title: "recipes.shaped(...) / recipes.shapeless(...)",
        signature: "recipes.shaped(recipe_id: str, result_id: str, count: int, pattern: list[str], keys: dict[str, str]) -> None / recipes.shapeless(recipe_id: str, result_id: str, count: int, ingredients: list[str]) -> None",
        kind: "Dynamic content helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-content",
        parentLabel: "Dynamic Content API",
        useCase: "Generated crafting recipes",
        useNote: "Use these when Python-registered content also needs recipes without a separate data pack step.",
        summary: "Creates crafting recipes at runtime and keeps namespace handling aligned with the rest of the content API.",
        description: [
            "The shaped helper is best for explicit patterns, while the shapeless helper works for unordered ingredient lists.",
            "The recipe APIs live next to the rest of the content helpers specifically so a PyFish-defined item or block can be registered and recipe-backed from the same Python script."
        ],
        parameters: [
            ["recipe_id", "Id of the recipe to generate."],
            ["result_id", "Result item id."],
            ["count", "Result stack count."],
            ["pattern / ingredients / keys", "Structure for the shaped or shapeless recipe, depending on the helper you use."]
        ],
        returns: "No return value.",
        example: `from pyfish import recipes\n\nrecipes.shaped(\n    "ruby_block_recipe",\n    "ruby_tools:ruby_block",\n    1,\n    [\n        "II",\n        "II"\n    ],\n    {\n        "I": "ruby_tools:ruby_ingot"\n    }\n)\n\nrecipes.shapeless("ruby_snack_recipe", "ruby_tools:ruby_snack", 1, [\n    "minecraft:apple",\n    "ruby_tools:ruby_ingot"\n])`,
        notes: [
            "Tag ingredients can use the standard <span class=\"inline-code\">#namespace:path</span> syntax.",
            "The content helpers are available directly from the main <span class=\"inline-code\">pyfish</span> import."
        ],
        related: ["content-register-item", "content-register-block", "content-tags"]
    },
    "content-tags": {
        title: "tags.add_item_tag(...) / tags.add_block_tag(...)",
        signature: "tags.add_item_tag(tag_id: str, *entries: str) -> None / tags.add_block_tag(tag_id: str, *entries: str) -> None",
        kind: "Dynamic content helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-content",
        parentLabel: "Dynamic Content API",
        useCase: "Grouping generated content through tags",
        useNote: "Use this to make Python-defined content participate in recipes, lookups, and logical grouping.",
        summary: "Adds runtime-generated entries to item or block tags and keeps the tag surface next to the rest of the PyFish content workflow.",
        description: [
            "Tags are especially useful when several Python-generated entries should behave as one family.",
            "The compatibility layer also exposes <span class=\"inline-code\">tags.get_items_by_tag(...)</span> and <span class=\"inline-code\">tags.unify(...)</span>, but unification is currently a logged intent rather than a full automatic registry rewrite."
        ],
        parameters: [
            ["tag_id", "Tag to modify, usually as <span class=\"inline-code\">namespace:path</span>."],
            ["entries", "One or more registry ids or tag references to include in that tag."]
        ],
        returns: "No return value.",
        example: `from pyfish import tags\n\ntags.add_item_tag("ruby_tools:ruby_items", "ruby_tools:ruby_ingot", "ruby_tools:ruby_snack", "ruby_tools:ruby_blade")\ntags.add_block_tag("ruby_tools:ruby_blocks", "ruby_tools:ruby_block")`,
        notes: [
            "Use tags when a recipe or future lookup should target a family instead of a single item id.",
            "The example project already exercises this surface through the <span class=\"inline-code\">ruby_tools:*</span> tags."
        ],
        related: ["content-recipes", "content-register-item", "content-register-block"]
    },
    "content-textures": {
        title: "textures.register_texture(...) / textures.register_image(...)",
        signature: "textures.register_texture(texture_id: str, data: bytes) -> None / textures.register_image(texture_id: str, image: object) -> None",
        kind: "Dynamic content helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-content",
        parentLabel: "Dynamic Content API",
        useCase: "Generated or loaded texture data",
        useNote: "Use this when the texture content is produced at runtime instead of being shipped as a normal PNG asset.",
        summary: "Registers texture data from Python so dynamic items and blocks can point at textures that are generated or transformed while the runtime is starting.",
        description: [
            "The byte-based path is the simplest when you already have encoded image bytes. The image-based path is useful when a Java-side image object is easier to produce or manipulate.",
            "The runtime also exposes <span class=\"inline-code\">textures.get_texture_bytes(...)</span> and <span class=\"inline-code\">textures.load_texture(...)</span> for more advanced flows."
        ],
        parameters: [
            ["texture_id", "Texture id to register."],
            ["bytes / image", "Either encoded byte content or a Java image object, depending on the helper you choose."]
        ],
        returns: "No return value.",
        example: `from pyfish import textures\n\nwith open("generated_logo.png", "rb") as handle:\n    textures.register_texture("ruby_block_side", handle.read())`,
        notes: [
            "Texture registration is most useful when the content API is also generating items or blocks that refer to those texture ids.",
            "If the texture is already a normal static asset in a jar or resource pack, use the normal resource path instead of runtime registration."
        ],
        related: ["content-register-item", "content-register-block"]
    },
    "content-tabs": {
        title: "tabs.create(id, properties)",
        signature: "tabs.create(tab_id: str, properties: TabProperties) -> None",
        kind: "Dynamic content helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-content",
        parentLabel: "Dynamic Content API",
        useCase: "Creative inventory organization",
        useNote: "Use this when a Python-defined content family should live in its own creative tab.",
        summary: "Creates a creative tab and lets generated content reference it by id through their own property maps.",
        description: [
            "The current public surface uses <span class=\"inline-code\">displayName</span> and <span class=\"inline-code\">icon</span> in the property map.",
            "Because namespace resolution applies here too, a tab id can stay short when it lives entirely inside the current Python mod."
        ],
        parameters: [
            ["tab_id", "Creative tab id to create."],
            ["properties", "Usually includes <span class=\"inline-code\">displayName</span> and <span class=\"inline-code\">icon</span>."]
        ],
        returns: "No return value.",
        example: `from pyfish import tabs\n\ntabs.create("ruby_tab", {\n    "displayName": "Ruby Tools",\n    "icon": "ruby_tools:ruby_ingot"\n})`,
        notes: [
            "Use <span class=\"inline-code\">displayName</span>, not <span class=\"inline-code\">title</span>.",
            "Generated items and blocks can then point to that tab through their own <span class=\"inline-code\">tab</span> property."
        ],
        related: ["content-register-item", "content-register-block"]
    },
    "content-callbacks": {
        title: "Dynamic content callbacks",
        signature: "events: EventCallbacks",
        kind: "Dynamic content helper",
        availability: "Shared callback layer",
        parentView: "api-content",
        parentLabel: "Dynamic Content API",
        useCase: "Callbacks attached directly to generated items or blocks",
        useNote: "Use this when behavior belongs to one generated content entry instead of to a global event alias.",
        summary: "Dynamic items and blocks can carry their own Python callbacks through the <span class=\"inline-code\">events</span> property.",
        description: [
            "This is separate from <span class=\"inline-code\">mc.on(...)</span>. The callback belongs directly to the generated content entry, which keeps content-local logic easy to read.",
            "Item callbacks commonly use <span class=\"inline-code\">use</span>, <span class=\"inline-code\">use_on</span>, and <span class=\"inline-code\">eat</span>. Blocks expose a <span class=\"inline-code\">use</span> hook."
        ],
        parameters: [
            ["events", "Property map nested inside the generated item or block definition."],
            ["callback", "Python function that receives the content interaction objects for that specific callback type."]
        ],
        returns: "No return value. The callbacks are invoked later when the content is used in game.",
        example: `from pyfish import items, mc\n\ndef on_wand_use(level, player, hand):\n    mc.send_message(player, "Dynamic item callback OK")\n\nitems.register_item("signal_wand", {\n    "texture": "signal_wand",\n    "stacksTo": 1,\n    "events": {\n        "use": on_wand_use\n    }\n})`,
        notes: [
            "These callbacks receive the raw interaction objects for the specific content event, not the shared global event wrappers.",
            "Use this model when the logic clearly belongs to one generated content entry."
        ],
        related: ["content-register-item", "content-register-food", "content-register-block"]
    },
    "mc-get-block-id": {
        title: "mc.get_block_id(world, x, y, z)",
        signature: "mc.get_block_id(world: WorldHandle, x: int, y: int, z: int) -> str",
        kind: "World helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-world",
        parentLabel: "World API",
        useCase: "Fast world-state reads",
        useNote: "Use this for quick visible checks, verification messages, or logic that depends on the current block id.",
        summary: "Returns the registry id of the block currently present at the target coordinates.",
        description: [
            "The helper accepts the same world wrapper or raw Java world that other PyFish world calls accept.",
            "It is especially useful immediately after <span class=\"inline-code\">mc.set_block(...)</span> when you want to confirm that the runtime bridge resolved the id the way you expected."
        ],
        parameters: [
            ["world", "Server world or callback world wrapper."],
            ["x, y, z", "Block coordinates to inspect."]
        ],
        returns: "A block registry id string such as <span class=\"inline-code\">minecraft:stone</span> or <span class=\"inline-code\">ruby_tools:ruby_block</span>.",
        example: `def on_block_break(event):\n    world = event.getLevel()\n    pos = event.getPos()\n    block_id = mc.get_block_id(world, pos.getX(), pos.getY(), pos.getZ())\n    print(f"Block at break position is now {block_id}")`,
        notes: [
            "Use integer block coordinates, not floating-point entity positions.",
            "This helper reads the world state after the event code around it has already changed it."
        ],
        related: ["mc-set-block", "mc-break-block"]
    },
    "mc-set-block": {
        title: "mc.set_block(world, x, y, z, block_id)",
        signature: "mc.set_block(world: WorldHandle, x: int, y: int, z: int, block_id: str) -> None",
        kind: "World helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-world",
        parentLabel: "World API",
        useCase: "Placing or replacing blocks from Python",
        useNote: "Use this for fast structure changes, verification logic, or event-driven reactions.",
        summary: "Places or replaces one block at the target coordinates through the shared runtime bridge.",
        description: [
            "The helper accepts either a raw <span class=\"inline-code\">ServerLevel</span> or the wrapper returned by PyFish callbacks. That keeps the Python surface the same on both loaders.",
            "Modern holder-based registry changes on newer Minecraft profiles are already handled on the Java side, so this remains a normal string-based API from Python."
        ],
        parameters: [
            ["world", "Server world or callback world wrapper."],
            ["x, y, z", "Target block coordinates."],
            ["block_id", "Fully-qualified block id to place, such as <span class=\"inline-code\">minecraft:gold_block</span> or <span class=\"inline-code\">ruby_tools:ruby_block</span>."]
        ],
        returns: "No return value.",
        example: `def on_player_join(event):\n    player = event.getPlayer() or event.getEntity()\n    world = event.getLevel() or player.serverLevel()\n    x = player.getBlockX() + 1\n    y = player.getBlockY()\n    z = player.getBlockZ()\n\n    mc.set_block(world, x, y, z, "minecraft:gold_block")\n    mc.send_message(player, f"Placed {mc.get_block_id(world, x, y, z)} at {x} {y} {z}")`,
        notes: [
            "When you are placing a generated block from the current Python namespace, use the resolved id explicitly if you want the script to be crystal clear.",
            "For destructive cleanup, pair this with <span class=\"inline-code\">mc.break_block(...)</span> instead of overwriting blindly when you want vanilla drops."
        ],
        related: ["mc-get-block-id", "mc-break-block", "content-register-block"]
    },
    "mc-break-block": {
        title: "mc.break_block(world, x, y, z)",
        signature: "mc.break_block(world: WorldHandle, x: int, y: int, z: int) -> None",
        kind: "World helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-world",
        parentLabel: "World API",
        useCase: "Removing blocks with vanilla behavior",
        useNote: "Use this when you want normal block-break logic instead of simply replacing the block id.",
        summary: "Breaks the targeted block and lets the normal world logic handle the result.",
        description: [
            "This is the safer choice when the script intends to behave like a real break action instead of a silent replacement.",
            "It is useful for cleanup commands in verification scripts or event-driven systems that should still feel like Minecraft."
        ],
        parameters: [
            ["world", "Server world or callback world wrapper."],
            ["x, y, z", "Target block coordinates."]
        ],
        returns: "No return value.",
        example: `def remove_anchor(world, x, y, z):\n    if mc.get_block_id(world, x, y, z) != "minecraft:air":\n        mc.break_block(world, x, y, z)`,
        notes: [
            "If you need a guaranteed final block state regardless of drops or special logic, use <span class=\"inline-code\">mc.set_block(...)</span> instead.",
            "Use integer block coordinates here as well."
        ],
        related: ["mc-set-block", "mc-get-block-id"]
    },
    "mc-get-time": {
        title: "mc.get_time(world)",
        signature: "mc.get_time(world: WorldHandle) -> int",
        kind: "World helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-world",
        parentLabel: "World API",
        useCase: "Reading world time",
        useNote: "Use this when time-dependent scripts need to inspect the current day-night state.",
        summary: "Returns the current world time as a tick value.",
        description: [
            "The returned number follows normal Minecraft time semantics, so values around <span class=\"inline-code\">0</span> represent day start and values around <span class=\"inline-code\">13000</span> represent night start.",
            "This helper is a read-side companion to <span class=\"inline-code\">mc.set_time(...)</span>."
        ],
        parameters: [
            ["world", "Server world or callback world wrapper."]
        ],
        returns: "The current world time as an integer tick value.",
        example: `def on_server_started(event):\n    world = event.getLevel()\n    if world is not None:\n        print(f"Current time: {mc.get_time(world)}")`,
        notes: [
            "Not every callback exposes a world directly. In those cases, grab it from the player wrapper with <span class=\"inline-code\">player.serverLevel()</span>.",
            "Use this before changing time if you want a before/after log."
        ],
        related: ["mc-set-time"]
    },
    "mc-set-time": {
        title: "mc.set_time(world, time)",
        signature: "mc.set_time(world: WorldHandle, time: int) -> None",
        kind: "World helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-world",
        parentLabel: "World API",
        useCase: "Changing the day-night cycle",
        useNote: "Use this for scripted scenarios, admin helpers, or quick verification commands.",
        summary: "Sets the world time to the provided tick value.",
        description: [
            "This is a direct world helper, so it changes the target world's time immediately.",
            "Common values are <span class=\"inline-code\">0</span> for day start and <span class=\"inline-code\">13000</span> for night start."
        ],
        parameters: [
            ["world", "Server world or callback world wrapper."],
            ["time", "Tick value to apply."]
        ],
        returns: "No return value.",
        example: `def set_night(world):\n    mc.set_time(world, 13000)\n    print(f"Time is now {mc.get_time(world)}")`,
        notes: [
            "Use <span class=\"inline-code\">mc.execute_command(server, \"time set day\")</span> if you deliberately want the command pipeline instead.",
            "Time helpers are world-specific, so pass the correct level when a server has multiple loaded worlds."
        ],
        related: ["mc-get-time", "mc-execute-command"]
    },
    "mc-send-message": {
        title: "mc.send_message(player, message)",
        signature: "mc.send_message(player: PlayerHandle, message: str) -> None",
        kind: "Player helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-players",
        parentLabel: "Players and Entities API",
        useCase: "Direct player feedback",
        useNote: "Use this for targeted verification, event messages, and private scripted responses.",
        summary: "Sends a system message to one player.",
        description: [
            "Player wrappers returned by callbacks can be passed directly into this helper.",
            "This is usually the fastest way to confirm that a callback fired and that the shared wrapper surface is healthy."
        ],
        parameters: [
            ["player", "Player wrapper or raw server player."],
            ["message", "Text to send."]
        ],
        returns: "No return value.",
        example: `def on_player_join(event):\n    player = event.getPlayer() or event.getEntity()\n    mc.send_message(player, "PyFish runtime OK")`,
        notes: [
            "Use <span class=\"inline-code\">mc.broadcast_message(...)</span> when the whole world should see the message.",
            "Messages are great quick visible checks because they require very little game state."
        ],
        related: ["mc-broadcast-message", "mc-on"]
    },
    "mc-broadcast-message": {
        title: "mc.broadcast_message(world, message)",
        signature: "mc.broadcast_message(world: WorldHandle, message: str) -> None",
        kind: "Player helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-players",
        parentLabel: "Players and Entities API",
        useCase: "World-wide feedback",
        useNote: "Use this for announcements visible to everyone in the target world.",
        summary: "Broadcasts a message to players in the supplied world.",
        description: [
            "This helper stays world-scoped, which keeps it safe on servers with multiple loaded dimensions.",
            "It is commonly used in join callbacks or scripted world events."
        ],
        parameters: [
            ["world", "Server world or callback world wrapper."],
            ["message", "Text to broadcast."]
        ],
        returns: "No return value.",
        example: `def on_player_join(event):\n    world = event.getLevel()\n    player = event.getPlayer() or event.getEntity()\n    mc.broadcast_message(world, f"{player.getName()} joined, API is responding.")`,
        notes: [
            "If you only want one player to see the message, use <span class=\"inline-code\">mc.send_message(...)</span> instead.",
            "Use concise messages when this can fire often."
        ],
        related: ["mc-send-message", "mc-get-players"]
    },
    "mc-give-item": {
        title: "mc.give_item(player, item_id, count)",
        signature: "mc.give_item(player: PlayerHandle, item_id: str, count: int) -> None",
        kind: "Player helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-players",
        parentLabel: "Players and Entities API",
        useCase: "Giving vanilla or dynamic content",
        useNote: "Use this in join tests, rewards, admin helpers, or scripted progress milestones.",
        summary: "Creates an item stack by id and gives it to the target player.",
        description: [
            "This helper accepts both vanilla ids and PyFish-generated ids. It is one of the easiest ways to confirm that dynamic content registration really succeeded.",
            "Recent holder-based item registry changes are already handled on the Java side, so the Python surface remains a plain string id."
        ],
        parameters: [
            ["player", "Player wrapper or raw server player."],
            ["item_id", "Item id to give."],
            ["count", "Stack size to give."]
        ],
        returns: "No return value.",
        example: `def on_player_join(event):\n    player = event.getPlayer() or event.getEntity()\n    mc.give_item(player, "ruby_tools:ruby_ingot", 8)\n    mc.give_item(player, "minecraft:torch", 16)`,
        notes: [
            "This is an excellent first verification step after registering new content.",
            "If the item id is wrong, the Java bridge logs the registry problem clearly."
        ],
        related: ["content-register-item", "mc-send-message"]
    },
    "mc-get-players": {
        title: "mc.get_players(world)",
        signature: "mc.get_players(world: WorldHandle) -> list[PlayerHandle]",
        kind: "Player helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-players",
        parentLabel: "Players and Entities API",
        useCase: "Iterating over players in a level",
        useNote: "Use this when one script action should affect everyone in the same world.",
        summary: "Returns the players currently present in the supplied world.",
        description: [
            "This helper is world-scoped, which avoids accidentally affecting players in a different dimension.",
            "The returned entries can be passed back into other player helpers directly."
        ],
        parameters: [
            ["world", "Server world or callback world wrapper."]
        ],
        returns: "A list of player objects or player wrappers for that world.",
        example: `def announce(world, message):\n    for player in mc.get_players(world):\n        mc.send_message(player, message)`,
        notes: [
            "Use the world from the current callback when possible so the scope stays obvious.",
            "Returned players can be teleported, buffed, or messaged with the other shared helpers."
        ],
        related: ["mc-send-message", "mc-broadcast-message", "mc-teleport"]
    },
    "mc-teleport": {
        title: "mc.teleport(player, x, y, z)",
        signature: "mc.teleport(player: PlayerHandle, x: float, y: float, z: float) -> None",
        kind: "Player helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-players",
        parentLabel: "Players and Entities API",
        useCase: "Moving a player instantly",
        useNote: "Use this for scripted travel, admin helpers, or tiny verification hops.",
        summary: "Teleports the target player to the given coordinates.",
        description: [
            "The helper expects a player target and raw coordinates. It does not need a separate world argument because the player identity already supplies the context for a normal same-world teleport.",
            "The example project intentionally uses a very small hop command because that is an easy visible quick visible check."
        ],
        parameters: [
            ["player", "Player wrapper or raw server player."],
            ["x, y, z", "Target coordinates."]
        ],
        returns: "No return value.",
        example: `def hop_player(player):\n    mc.teleport(player, player.getX(), player.getY() + 3, player.getZ())`,
        notes: [
            "Use small movements for verification so players do not lose their bearings.",
            "If you need dimension-changing travel, use a dedicated event or loader-specific logic instead."
        ],
        related: ["mc-send-message", "mc-get-players"]
    },
    "mc-set-health": {
        title: "mc.set_health(player, health)",
        signature: "mc.set_health(player: PlayerHandle, health: float) -> None",
        kind: "Player helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-players",
        parentLabel: "Players and Entities API",
        useCase: "Adjusting current health",
        useNote: "Use this for controlled tests, scripted penalties, or scripted recovery.",
        summary: "Sets the player's current health value.",
        description: [
            "This helper is intentionally direct. It is useful when a script wants an immediate state change instead of waiting for normal gameplay causes.",
            "Because it acts on current health, it is often paired with a chat message so the player understands why their state changed."
        ],
        parameters: [
            ["player", "Player wrapper or raw server player."],
            ["health", "Health value to apply."]
        ],
        returns: "No return value.",
        example: `def soften_landing(player):\n    mc.set_health(player, 20.0)\n    mc.send_message(player, "Health restored.")`,
        notes: [
            "Keep scripted health changes explicit and easy to explain to players.",
            "For temporary buffs, <span class=\"inline-code\">mc.add_effect(...)</span> is often a better user experience."
        ],
        related: ["mc-add-effect", "mc-set-food-level"]
    },
    "mc-set-food-level": {
        title: "mc.set_food_level(player, food_level)",
        signature: "mc.set_food_level(player: PlayerHandle, food_level: int) -> None",
        kind: "Player helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-players",
        parentLabel: "Players and Entities API",
        useCase: "Adjusting hunger directly",
        useNote: "Use this for challenge modes, scripted recovery, or scripted checks.",
        summary: "Sets the player's hunger level directly.",
        description: [
            "The helper is useful for verification because the hunger bar is visible immediately.",
            "Unlike food registration, this affects the player state directly rather than creating an edible item."
        ],
        parameters: [
            ["player", "Player wrapper or raw server player."],
            ["food_level", "Hunger value from 0 to 20."]
        ],
        returns: "No return value.",
        example: `def refill_food(player):\n    mc.set_food_level(player, 20)\n    mc.send_message(player, "Food restored.")`,
        notes: [
            "Use <span class=\"inline-code\">items.register_food(...)</span> when you want a real consumable item instead of an immediate state change.",
            "Keeping the range inside 0..20 matches normal vanilla expectations."
        ],
        related: ["mc-set-health", "content-register-food"]
    },
    "mc-set-experience": {
        title: "mc.set_experience(player, level)",
        signature: "mc.set_experience(player: PlayerHandle, level: int) -> None",
        kind: "Player helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-players",
        parentLabel: "Players and Entities API",
        useCase: "Setting XP level directly",
        useNote: "Use this for scripted progression or scripted shortcuts.",
        summary: "Sets the player's experience level.",
        description: [
            "The shared Python surface treats this as a direct level setter rather than a raw XP-point increment helper.",
            "It is useful for tests because the result is immediately visible on the HUD."
        ],
        parameters: [
            ["player", "Player wrapper or raw server player."],
            ["level", "Experience level to apply."]
        ],
        returns: "No return value.",
        example: `def grant_levels(player):\n    mc.set_experience(player, 10)\n    mc.send_message(player, "Set your level to 10.")`,
        notes: [
            "If you need fine-grained loader-specific XP hooks, check the event matrix for the current loader.",
            "Use clear player-facing messaging when a script changes progression state."
        ],
        related: ["mc-send-message", "events"]
    },
    "mc-add-effect": {
        title: "mc.add_effect(player, effect_id, duration, amplifier=0)",
        signature: "mc.add_effect(player: PlayerHandle, effect_id: str, duration: int, amplifier: int = 0) -> None",
        kind: "Player helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-players",
        parentLabel: "Players and Entities API",
        useCase: "Applying temporary effects",
        useNote: "Use this for temporary boosts, scripted debuffs, or scripted checks.",
        summary: "Applies a status effect such as speed, regeneration, or night vision.",
        description: [
            "The effect id uses normal registry notation like <span class=\"inline-code\">minecraft:speed</span>.",
            "This helper is often more player-friendly than changing raw health or food directly because it keeps the result visible and temporary."
        ],
        parameters: [
            ["player", "Player wrapper or raw server player."],
            ["effect_id", "Effect id to apply."],
            ["duration", "Duration in ticks."],
            ["amplifier", "Optional amplifier level, starting at 0."]
        ],
        returns: "No return value.",
        example: `def buff_player(player):\n    mc.add_effect(player, "minecraft:speed", 200, 0)\n    mc.send_message(player, "Speed boost applied.")`,
        notes: [
            "The example project uses this surface because it is easy to confirm visually.",
            "Keep durations short in quick visible checks so the effect does not outlive the test context."
        ],
        related: ["mc-set-health", "mc-send-message"]
    },
    "mc-spawn-entity": {
        title: "mc.spawn_entity(world, entity_type_id, x, y, z)",
        signature: "mc.spawn_entity(world: WorldHandle, entity_type_id: str, x: float, y: float, z: float) -> None",
        kind: "Entity helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-players",
        parentLabel: "Players and Entities API",
        useCase: "Spawning entities from Python",
        useNote: "Use this for scripted checks, scripted encounters, or world reactions.",
        summary: "Spawns an entity in the supplied world at the target coordinates.",
        description: [
            "This helper expects a normal entity type id such as <span class=\"inline-code\">minecraft:bee</span>.",
            "The current public Python surface does not return the spawned entity object, so scripts usually confirm the result through chat, logs, or later entity scans."
        ],
        parameters: [
            ["world", "Server world or callback world wrapper."],
            ["entity_type_id", "Entity type id to spawn."],
            ["x, y, z", "Spawn coordinates."]
        ],
        returns: "No return value in the public Python wrapper.",
        example: `def spawn_bee(world, x, y, z):\n    mc.spawn_entity(world, "minecraft:bee", x + 2.5, y + 1.0, z + 0.5)\n    print("Spawned bee near the player")`,
        notes: [
            "Use a safe spawn position with enough air around it.",
            "Pair this with <span class=\"inline-code\">mc.get_entities_in_range(...)</span> if you want a second verification step."
        ],
        related: ["mc-get-entities-in-range", "mc-kill-entity"]
    },
    "mc-kill-entity": {
        title: "mc.kill_entity(entity)",
        signature: "mc.kill_entity(entity: EntityHandle) -> None",
        kind: "Entity helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-players",
        parentLabel: "Players and Entities API",
        useCase: "Entity cleanup",
        useNote: "Use this for verification cleanup, scripted kills, or targeted removal without relying on the vanilla /kill command output.",
        summary: "Kills the target entity when possible, with a safe fallback removal path.",
        description: [
            "This helper is designed to work well with nearby-entity scans and event callbacks.",
            "Players now go through a true kill path instead of being silently refused, while non-player entities still clean up correctly."
        ],
        parameters: [
            ["entity", "Entity wrapper or raw entity."]
        ],
        returns: "No return value.",
        example: `def cleanup_first_non_player(entities):\n    for entity in entities:\n        name = str(entity.getName())\n        if "player" not in name.lower():\n            mc.kill_entity(entity)\n            break`,
        notes: [
            "Be careful when using wide cleanup scans on shared servers.",
            "It is often wise to log or message what was removed.",
            "If you do not want vanilla command feedback in chat, prefer this helper over calling <span class=\"inline-code\">/kill</span> through <span class=\"inline-code\">mc.execute_command(...)</span>."
        ],
        related: ["mc-get-entities-in-range", "mc-spawn-entity"]
    },
    "mc-get-entities-in-range": {
        title: "mc.get_entities_in_range(world, x, y, z, range)",
        signature: "mc.get_entities_in_range(world: WorldHandle, x: float, y: float, z: float, range: float) -> list[EntityHandle]",
        kind: "Entity helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-players",
        parentLabel: "Players and Entities API",
        useCase: "Area scans",
        useNote: "Use this to inspect or clean up nearby scripted entities.",
        summary: "Returns the entities inside a radius around the supplied point.",
        description: [
            "This helper is commonly used after entity spawning or during verification scans.",
            "Returned entities can be passed into other helpers such as <span class=\"inline-code\">mc.kill_entity(...)</span>."
        ],
        parameters: [
            ["world", "Server world or callback world wrapper."],
            ["x, y, z", "Center coordinates."],
            ["range", "Search radius."]
        ],
        returns: "A list of entities in the search area.",
        example: `def scan_anchor(world, x, y, z):\n    entities = mc.get_entities_in_range(world, x, y, z, 8)\n    print(f"Found {len(entities)} nearby entities")`,
        notes: [
            "Small scan radii are usually easier to reason about.",
            "Combine this with a scripted message or log line so the result is visible."
        ],
        related: ["mc-spawn-entity", "mc-kill-entity"]
    },
    "mc-execute-command": {
        title: "mc.execute_command(server, command)",
        signature: "mc.execute_command(server: ServerHandle, command: str) -> None",
        kind: "Utility helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-utils",
        parentLabel: "Utils and Environment API",
        useCase: "Routing through the normal command pipeline",
        useNote: "Use this when a feature already exists as a command and you want PyFish to trigger it.",
        summary: "Executes a server command string without a leading slash.",
        description: [
            "This is useful when you deliberately want the server's command behavior rather than a direct helper call.",
            "It requires a server object, so lifecycle callbacks and many player callbacks are natural entry points."
        ],
        parameters: [
            ["server", "Server wrapper or raw Minecraft server."],
            ["command", "Command string without the leading slash."]
        ],
        returns: "No documented Python return value.",
        example: `def on_server_started(event):\n    server = event.getServer()\n    mc.execute_command(server, "gamerule sendCommandFeedback false")`,
        notes: [
            "For simple time changes, <span class=\"inline-code\">mc.set_time(...)</span> may be cleaner than a command.",
            "Keep command strings explicit and avoid composing risky input from untrusted chat text."
        ],
        related: ["mc-set-time", "mc-on"]
    },
    "mc-create-explosion": {
        title: "mc.create_explosion(world, x, y, z, radius, fire=False, mode=\"block\")",
        signature: "mc.create_explosion(world: WorldHandle, x: float, y: float, z: float, radius: float, fire: bool = False, mode: str = \"block\") -> None",
        kind: "Utility helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-utils",
        parentLabel: "Utils and Environment API",
        useCase: "Explosion effects",
        useNote: "Use this carefully for scripted events or scripted checks.",
        summary: "Creates an explosion with configurable fire and interaction mode.",
        description: [
            "The mode decides how the explosion interacts with the world. The public Python surface documents <span class=\"inline-code\">block</span>, <span class=\"inline-code\">none</span>, <span class=\"inline-code\">mob</span>, and <span class=\"inline-code\">tnt</span>.",
            "The example project deliberately uses a non-destructive mode so the behavior is visible without griefing the test area."
        ],
        parameters: [
            ["world", "Server world or callback world wrapper."],
            ["x, y, z", "Explosion center."],
            ["radius", "Explosion radius."],
            ["fire", "Whether fires can start."],
            ["mode", "Interaction mode string."]
        ],
        returns: "No return value.",
        example: `def test_boom(world, x, y, z):\n    mc.create_explosion(world, x, y, z, 2.0, False, "none")`,
        notes: [
            "Use non-destructive settings when testing on a shared build world.",
            "Pair this with a chat message so the player knows it was scripted."
        ],
        related: ["mc-strike-lightning", "mc-spawn-particle"]
    },
    "mc-strike-lightning": {
        title: "mc.strike_lightning(world, x, y, z)",
        signature: "mc.strike_lightning(world: WorldHandle, x: float, y: float, z: float) -> None",
        kind: "Utility helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-utils",
        parentLabel: "Utils and Environment API",
        useCase: "Visible world feedback",
        useNote: "Use this for dramatic scripted events or simple quick visible checks.",
        summary: "Strikes lightning at the supplied coordinates.",
        description: [
            "Lightning is a useful visible signal that the runtime bridge is operating correctly.",
            "Compared with explosions, it is often easier to use as a quick visible check because the effect is clear and local."
        ],
        parameters: [
            ["world", "Server world or callback world wrapper."],
            ["x, y, z", "Target coordinates."]
        ],
        returns: "No return value.",
        example: `def test_lightning(world, x, y, z):\n    mc.strike_lightning(world, x, y, z)`,
        notes: [
            "Avoid repeatedly firing this in a dense area during automated tests.",
            "A one-shot verification command is usually enough."
        ],
        related: ["mc-create-explosion", "mc-play-sound"]
    },
    "mc-play-sound": {
        title: "mc.play_sound(world, x, y, z, sound_id, category=\"master\", volume=1.0, pitch=1.0)",
        signature: "mc.play_sound(world: WorldHandle, x: float, y: float, z: float, sound_id: str, category: str = \"master\", volume: float = 1.0, pitch: float = 1.0) -> None",
        kind: "Utility helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-utils",
        parentLabel: "Utils and Environment API",
        useCase: "Audio feedback",
        useNote: "Use this for verification, ambience, or immediate player feedback.",
        summary: "Plays a sound event at the supplied coordinates.",
        description: [
            "The public Python surface expects a sound id and lets you tune category, volume, and pitch.",
            "This pairs very naturally with particles or messages when you want a richer response to a script action."
        ],
        parameters: [
            ["world", "Server world or callback world wrapper."],
            ["x, y, z", "Sound origin."],
            ["sound_id", "Sound event id."],
            ["category", "Optional sound category, defaulting to <span class=\"inline-code\">master</span>."],
            ["volume / pitch", "Optional playback tuning."]
        ],
        returns: "No return value.",
        example: `def ping_anchor(world, x, y, z):\n    mc.play_sound(world, x, y, z, "minecraft:block.note_block.pling", "master", 1.0, 1.0)`,
        notes: [
            "Use known-good vanilla sound ids during verification.",
            "Audio alone can be easy to miss, so pair it with a visible effect when possible."
        ],
        related: ["mc-spawn-particle", "mc-send-message"]
    },
    "mc-spawn-particle": {
        title: "mc.spawn_particle(world, particle_id, x, y, z, count=1, dx=0.0, dy=0.0, dz=0.0, speed=0.0)",
        signature: "mc.spawn_particle(world: WorldHandle, particle_id: str, x: float, y: float, z: float, count: int = 1, dx: float = 0.0, dy: float = 0.0, dz: float = 0.0, speed: float = 0.0) -> None",
        kind: "Utility helper",
        availability: "Shared on Fabric and NeoForge",
        parentView: "api-utils",
        parentLabel: "Utils and Environment API",
        useCase: "Visible scripted feedback",
        useNote: "Use this for effects, markers, or verification commands.",
        summary: "Spawns particles using count, spread, and speed parameters.",
        description: [
            "Particles are one of the best non-destructive quick visible checks because they are obvious and do not change gameplay state permanently.",
            "The spread parameters let you fan particles out from the center point."
        ],
        parameters: [
            ["world", "Server world or callback world wrapper."],
            ["particle_id", "Particle id to spawn."],
            ["x, y, z", "Effect origin."],
            ["count", "Number of particles."],
            ["dx, dy, dz", "Spread values around the origin."],
            ["speed", "Particle speed."]
        ],
        returns: "No return value.",
        example: `def celebrate(world, x, y, z):\n    mc.spawn_particle(world, "minecraft:happy_villager", x, y + 1.0, z, 12, 0.4, 0.4, 0.4, 0.01)`,
        notes: [
            "Use visible vanilla particles for baseline testing.",
            "Particles and sounds together make great scripted commands."
        ],
        related: ["mc-play-sound", "mc-create-explosion"]
    },
    "mc-on": {
        title: "mc.on(event, callback)",
        signature: "mc.on(event_alias: str, callback: Callable[..., object]) -> None",
        kind: "Event helper",
        availability: "Shared API surface with loader-specific backend coverage",
        parentView: "api-utils",
        parentLabel: "Utils and Environment API",
        useCase: "Registering runtime callbacks",
        useNote: "Use this for lifecycle, player, world, block, chat, and supported entity hooks.",
        summary: "Registers a Python callback for a documented PyFish event alias.",
        description: [
            "On both loaders, the supported aliases are documented in the event matrix. On NeoForge, PyFish also supports direct Java event class names for advanced use cases. Fabric stays alias-based.",
            "This helper is the center of the whole runtime scripting model, so it is worth checking the event matrix for the selected loader and version whenever a callback is especially specialized."
        ],
        parameters: [
            ["event_alias", "One documented PyFish alias such as <span class=\"inline-code\">on_server_started</span> or <span class=\"inline-code\">on_player_join</span>. On NeoForge, a full Java event class name can also be used for advanced cases."],
            ["callback", "Python function that receives the callback class listed in the Event System view, or a raw loader-native event object for specialized NeoForge-only aliases."]
        ],
        returns: "No return value. The callback is stored and invoked later when the event fires.",
        example: `from pyfish import mc, log_print, ServerEvent, PlayerChatEvent\n\ndef on_server_started(event: ServerEvent):\n    log_print("Server started")\n    mc.execute_command(event.getServer(), "gamerule sendCommandFeedback false")\n\ndef on_player_chat(event: PlayerChatEvent):\n    player = event.getPlayer()\n    if player is not None:\n        mc.send_message(player, f"You said: {event.getMessageString()}")\n\nmc.on("on_server_started", on_server_started)\nmc.on("on_player_chat", on_player_chat)`,
        notes: [
            "Fabric and NeoForge do not have identical event coverage. Always cross-check the Event System page for the currently selected loader.",
            "Python type annotations such as <span class=\"inline-code\">def on_player_chat(event: PlayerChatEvent):</span> are safe to keep in real runtime scripts executed by GraalPy.",
            "Dynamic item and block callbacks are configured separately through the content API rather than through <span class=\"inline-code\">mc.on(...)</span>."
        ],
        related: ["events", "callback-objects", "content-callbacks", "mc-send-message"]
    }
};

const PYFISH_DOC_LOADER_KEY = "pyfish-doc-loader";
const PYFISH_DOC_VERSION_KEYS = {
    fabric: "pyfish-doc-version-fabric",
    neoforge: "pyfish-doc-version-neoforge"
};
const pyfishDocState = {
    activeLoader: "neoforge",
    selectedProfiles: {
        fabric: PYFISH_DOC_DEFAULT_PROFILE_ID,
        neoforge: PYFISH_DOC_DEFAULT_PROFILE_ID
    }
};

function pyfishHydrateLoaderSwitches() {
    const template = document.getElementById("loaderSwitchTemplate");
    if (!template) {
        return;
    }

    document.querySelectorAll("[data-loader-switch]").forEach((target) => {
        target.replaceChildren(template.content.cloneNode(true));
    });
}

function pyfishRefreshLoaderCounts() {
    Object.entries(PYFISH_DOC_LOADERS).forEach(([loader, meta]) => {
        const count = PYFISH_DOC_EVENTS.filter((event) => Boolean(event[loader])).length;
        meta.eventCountValue = count;
        meta.eventCount = `${count} supported aliases`;
    });
}

function pyfishGetProfile(profileId) {
    return PYFISH_DOC_VERSION_PROFILE_MAP[profileId] || PYFISH_DOC_VERSION_PROFILE_MAP[PYFISH_DOC_DEFAULT_PROFILE_ID];
}

function pyfishGetLoaderProfileId(loader) {
    return pyfishDocState.selectedProfiles[loader] || PYFISH_DOC_DEFAULT_PROFILE_ID;
}

function pyfishSetLoaderProfileId(loader, profileId) {
    const resolvedProfile = pyfishGetProfile(profileId);
    pyfishDocState.selectedProfiles[loader] = resolvedProfile.id;
    localStorage.setItem(PYFISH_DOC_VERSION_KEYS[loader], resolvedProfile.id);
}

function pyfishBuildLoaderMeta(loader, profileId) {
    const base = PYFISH_DOC_LOADERS[loader] || PYFISH_DOC_LOADERS.neoforge;
    const profile = pyfishGetProfile(profileId);
    const jarName = loader === "fabric"
        ? `pyfish-fabric-${profile.minecraftVersion}-${PYFISH_DOC_MOD_VERSION}.jar`
        : `pyfish-neoforge-${profile.minecraftVersion}-${PYFISH_DOC_MOD_VERSION}.jar`;
    const loaderVersionLabel = loader === "fabric"
        ? PYFISH_DOC_FABRIC_LOADER_VERSION
        : profile.neoforgeVersion;
    const apiVersionLabel = loader === "fabric" ? profile.fabricApiVersion : "";

    return {
        ...base,
        profileId: profile.id,
        minecraftVersion: profile.minecraftVersion,
        versionLabel: profile.minecraftVersion,
        loaderVersionLabel,
        apiVersionLabel,
        installLabel: loader === "fabric"
            ? `Fabric Loader ${loaderVersionLabel} + Fabric API ${apiVersionLabel}`
            : `NeoForge ${loaderVersionLabel}`,
        jarName,
        eventToolbar: loader === "fabric"
            ? `Fabric ${profile.minecraftVersion} is selected, so the bridge column shows the Fabric hook when the alias exists.`
            : `NeoForge ${profile.minecraftVersion} is selected, so the bridge column shows the NeoForge hook for each alias.`
    };
}

function pyfishGetLoaderMeta(loader) {
    return pyfishBuildLoaderMeta(loader, pyfishGetLoaderProfileId(loader));
}

function pyfishSyncVersionSelects() {
    document.querySelectorAll("[data-loader-version-select]").forEach((select) => {
        const loader = select.dataset.loaderVersionSelect;
        if (!loader) {
            return;
        }

        const resolvedValue = pyfishGetLoaderProfileId(loader);
        if (select.value !== resolvedValue) {
            select.value = resolvedValue;
        }
    });
}

function pyfishPopulateVersionSelects() {
    document.querySelectorAll("[data-loader-version-select]").forEach((select) => {
        const loader = select.dataset.loaderVersionSelect;
        if (!loader) {
            return;
        }

        select.innerHTML = PYFISH_DOC_VERSION_PROFILES.map((profile) =>
            `<option value="${profile.id}" style="background:#f6efe6;color:#1a1410;">${profile.minecraftVersion}</option>`
        ).join("");
    });

    pyfishSyncVersionSelects();
}

function pyfishGetEventAccess(event, loader) {
    return loader === "fabric"
        ? (event.fabricAccess || event.access)
        : (event.neoforgeAccess || event.access);
}

function pyfishGetEventDetails(event, loader) {
    return loader === "fabric"
        ? (event.fabricDetails || event.details)
        : (event.neoforgeDetails || event.details);
}

function pyfishGetEventCallbackClass(event, loader) {
    const mapping = PYFISH_DOC_EVENT_CALLBACK_CLASSES[event.alias];
    const className = mapping ? mapping[loader] : null;
    if (className) {
        return className;
    }

    return event[loader] ? "Loader-specific event object" : "";
}

function pyfishApplyLoader(loader) {
    const meta = pyfishGetLoaderMeta(loader);
    pyfishDocState.activeLoader = loader;
    document.body.dataset.loader = loader;
    document.body.dataset.loaderVersion = meta.minecraftVersion;
    localStorage.setItem(PYFISH_DOC_LOADER_KEY, loader);

    document.querySelectorAll("[data-loader-selected]").forEach((element) => {
        element.textContent = meta.name;
    });

    document.querySelectorAll("[data-loader-field]").forEach((element) => {
        const field = element.dataset.loaderField;
        const buttonLoader = element.closest("[data-loader-button]")?.dataset.loaderButton;
        const source = element.dataset.loaderSource || buttonLoader;
        const sourceMeta = source ? pyfishGetLoaderMeta(source) : meta;
        if (field && sourceMeta[field] !== undefined) {
            element.textContent = sourceMeta[field];
        }
    });

    document.querySelectorAll("[data-loader-content]").forEach((element) => {
        const targets = (element.dataset.loaderContent || "").split(/\s+/).filter(Boolean);
        element.hidden = targets.length > 0 && !targets.includes(loader);
    });

    document.querySelectorAll("[data-loader-button]").forEach((button) => {
        const isActive = button.dataset.loaderButton === loader;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
        button.closest("[data-loader-option]")?.classList.toggle("active", isActive);
    });

    pyfishSyncVersionSelects();
    pyfishRenderEvents(loader);
}

function pyfishRenderEvents(loader) {
    const tbody = document.getElementById("eventRows");
    if (!tbody) {
        return;
    }

    const query = (document.getElementById("eventSearch")?.value || "").trim().toLowerCase();
    const activeChip = document.querySelector(".filter-chip.active");
    const activeFilter = activeChip ? activeChip.dataset.filter : "all";
    const meta = pyfishGetLoaderMeta(loader);

    const visibleEvents = PYFISH_DOC_EVENTS.filter((event) => {
        const bridge = event[loader];
        const status = bridge ? "supported" : "missing";
        const access = pyfishGetEventAccess(event, loader) || "";
        const callbackClass = pyfishGetEventCallbackClass(event, loader) || "";
        const details = pyfishGetEventDetails(event, loader) || "";
        const matchesFilter = activeFilter === "all" || event.group === activeFilter;
        const haystack = [
            event.alias,
            bridge || "",
            access,
            callbackClass,
            details,
            event.side,
            status
        ].join(" ").toLowerCase();
        const matchesQuery = !query || haystack.includes(query);
        return matchesFilter && matchesQuery;
    });

    const toolbar = document.getElementById("eventToolbarNote");
    if (toolbar) {
        toolbar.textContent = meta.eventToolbar;
    }

    const summary = document.getElementById("eventCountNote");
    if (summary) {
        summary.textContent = `${visibleEvents.length} aliases visible, ${meta.eventCountValue} supported on ${meta.name} ${meta.minecraftVersion}`;
    }

    tbody.innerHTML = visibleEvents.map((event) => {
        const bridge = event[loader];
        const supported = Boolean(bridge);
        const sideClass = event.side === "Universal" ? "pill-green" : "pill-orange";
        const access = pyfishGetEventAccess(event, loader) || "No documented callback helpers";
        const callbackClass = pyfishGetEventCallbackClass(event, loader) || `Not available on ${meta.name}`;
        const details = pyfishGetEventDetails(event, loader) || "";
        return `
            <tr>
                <td><span class="inline-code">${event.alias}</span></td>
                <td><span class="status-pill ${supported ? "is-supported" : "is-missing"}">${supported ? "Supported" : "Not available"}</span></td>
                <td>${supported ? `<span class="inline-code">${bridge}</span>` : `<span class="inline-code">Not available on ${meta.name}</span>`}</td>
                <td><span class="inline-code">${callbackClass}</span></td>
                <td><span class="pill ${sideClass}">${event.side}</span></td>
                <td>${access}</td>
                <td>${details}</td>
            </tr>
        `;
    }).join("");
}

function pyfishInitFilters(loader) {
    document.querySelectorAll(".filter-chip").forEach((chip) => {
        chip.addEventListener("click", () => {
            document.querySelectorAll(".filter-chip").forEach((other) => other.classList.remove("active"));
            chip.classList.add("active");
            pyfishRenderEvents(document.body.dataset.loader || loader);
        });
    });

    const search = document.getElementById("eventSearch");
    if (search) {
        search.addEventListener("input", () => pyfishRenderEvents(document.body.dataset.loader || loader));
    }
}

function pyfishGetDetailIdFromView(view) {
    return view && view.startsWith("detail-") ? view.slice("detail-".length) : null;
}

function pyfishResolveView(view) {
    const detailId = pyfishGetDetailIdFromView(view);
    if (detailId && PYFISH_DOC_DETAIL_PAGES[detailId]) {
        return "api-detail";
    }

    const aliased = PYFISH_DOC_VIEW_ALIASES[view] || view;
    if (aliased && PYFISH_DOC_VIEWS[aliased]) {
        return aliased;
    }

    return document.body.dataset.defaultView || "overview";
}

function pyfishRenderDetail(detailId) {
    const detail = PYFISH_DOC_DETAIL_PAGES[detailId];
    if (!detail) {
        return null;
    }

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value || "";
        }
    };

    const setHtml = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = value || "";
        }
    };

    setText("detailTitle", detail.title);
    setText("detailSignature", detail.signature || detail.title);
    setText("detailKind", detail.kind || "");
    setText("detailAvailability", detail.availability || "Shared");
    setText("detailUseCase", detail.useCase || "Runtime scripting");
    setText("detailUseNote", detail.useNote || "");
    setHtml("detailSummary", detail.summary || "");
    setText("detailParent", detail.parentLabel ? `Part of ${detail.parentLabel}.` : "Part of the PyFish API reference.");
    setHtml("detailReturns", detail.returns || "No return value.");
    setText("detailExample", detail.example || "");

    const backLink = document.getElementById("detailBackLink");
    if (backLink) {
        backLink.textContent = detail.parentLabel ? `Back to ${detail.parentLabel}` : "Back to API section";
        backLink.href = `#${detail.parentView || "overview"}`;
        backLink.dataset.viewLink = detail.parentView || "overview";
    }

    setHtml(
        "detailDescription",
        (detail.description || []).map((paragraph) => `<p>${paragraph}</p>`).join("")
    );

    const parameterRows = document.getElementById("detailParameterRows");
    const parameterSection = document.getElementById("detailParametersSection");
    if (parameterRows && parameterSection) {
        const parameters = detail.parameters || [];
        parameterRows.innerHTML = parameters.map(([name, meaning]) => `
            <tr>
                <td><span class="inline-code">${name}</span></td>
                <td>${meaning}</td>
            </tr>
        `).join("");
        parameterSection.hidden = parameters.length === 0;
    }

    const notesWrap = document.getElementById("detailNotes");
    const notesSection = document.getElementById("detailNotesSection");
    if (notesWrap && notesSection) {
        const notes = detail.notes || [];
        notesWrap.innerHTML = notes.map((note) => `
            <article class="card">
                <div class="card-eyebrow">Note</div>
                <p>${note}</p>
            </article>
        `).join("");
        notesSection.hidden = notes.length === 0;
    }

    const relatedWrap = document.getElementById("detailRelated");
    const relatedSection = document.getElementById("detailRelatedSection");
    if (relatedWrap && relatedSection) {
        const related = detail.related || [];
        relatedWrap.innerHTML = related.map((relatedId) => {
            const relatedDetail = PYFISH_DOC_DETAIL_PAGES[relatedId];
            if (relatedDetail) {
                return `
                    <a class="quick-link" href="#detail-${relatedId}" data-detail-link="${relatedId}">
                        <strong>${relatedDetail.title}</strong>
                        <span>${relatedDetail.summary}</span>
                    </a>
                `;
            }

            if (PYFISH_DOC_VIEWS[relatedId]) {
                return `
                    <a class="quick-link" href="#${relatedId}" data-view-link="${relatedId}">
                        <strong>${PYFISH_DOC_VIEWS[relatedId]}</strong>
                        <span>Open the dedicated documentation page for this area.</span>
                    </a>
                `;
            }

            return "";
        }).join("");
        relatedSection.hidden = relatedWrap.innerHTML.trim() === "";
    }

    return detail;
}

function pyfishGetResolvedView() {
    const requested = (window.location.hash || "").replace(/^#/, "");
    return pyfishResolveView(requested);
}

function pyfishApplyView(view, syncHash = false) {
    const detailId = pyfishGetDetailIdFromView(view || "");
    const detail = detailId ? pyfishRenderDetail(detailId) : null;
    const resolvedView = detail ? "api-detail" : pyfishResolveView(view);
    const activeNavView = detail?.parentView || resolvedView;

    document.querySelectorAll("[data-doc-view]").forEach((section) => {
        const isActive = section.dataset.docView === resolvedView;
        section.hidden = !isActive;
        section.classList.toggle("active", isActive);
    });

    document.querySelectorAll("[data-nav-view]").forEach((link) => {
        link.classList.toggle("active", link.dataset.navView === activeNavView);
    });

    document.title = detail
        ? `PyFish Documentation - ${detail.title}`
        : `PyFish Documentation - ${PYFISH_DOC_VIEWS[resolvedView]}`;

    if (syncHash) {
        const targetHash = detail ? `#detail-${detailId}` : `#${resolvedView}`;
        if (window.location.hash !== targetHash) {
            history.pushState(null, "", targetHash);
        }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function pyfishInitNavigation() {
    document.addEventListener("click", (event) => {
        const detailLink = event.target.closest("[data-detail-link]");
        if (detailLink) {
            event.preventDefault();
            pyfishApplyView(`detail-${detailLink.dataset.detailLink}`, true);
            return;
        }

        const viewLink = event.target.closest("[data-view-link]");
        if (viewLink) {
            event.preventDefault();
            pyfishApplyView(viewLink.dataset.viewLink, true);
            return;
        }

        const navLink = event.target.closest("[data-nav-view]");
        if (navLink) {
            event.preventDefault();
            pyfishApplyView(navLink.dataset.navView, true);
        }
    });

    window.addEventListener("hashchange", () => {
        const requested = (window.location.hash || "").replace(/^#/, "");
        pyfishApplyView(requested || pyfishGetResolvedView(), false);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    pyfishRefreshLoaderCounts();
    pyfishHydrateLoaderSwitches();
    Object.keys(PYFISH_DOC_VERSION_KEYS).forEach((loader) => {
        const savedProfile = localStorage.getItem(PYFISH_DOC_VERSION_KEYS[loader]);
        if (savedProfile && PYFISH_DOC_VERSION_PROFILE_MAP[savedProfile]) {
            pyfishDocState.selectedProfiles[loader] = savedProfile;
        }
    });
    pyfishPopulateVersionSelects();

    const savedLoader = localStorage.getItem(PYFISH_DOC_LOADER_KEY);
    const defaultLoader = document.body.dataset.loaderDefault || "neoforge";
    const initialLoader = savedLoader && PYFISH_DOC_LOADERS[savedLoader] ? savedLoader : defaultLoader;

    document.querySelectorAll("[data-loader-button]").forEach((button) => {
        button.addEventListener("click", () => pyfishApplyLoader(button.dataset.loaderButton));
    });

    document.querySelectorAll("[data-loader-version-select]").forEach((select) => {
        const loader = select.dataset.loaderVersionSelect;
        select.addEventListener("change", () => {
            pyfishSetLoaderProfileId(loader, select.value);
            pyfishApplyLoader(pyfishDocState.activeLoader || initialLoader);
        });
    });

    pyfishInitNavigation();
    pyfishInitFilters(initialLoader);
    pyfishApplyLoader(initialLoader);
    const requestedView = (window.location.hash || "").replace(/^#/, "");
    pyfishApplyView(requestedView || pyfishGetResolvedView(), false);
});
