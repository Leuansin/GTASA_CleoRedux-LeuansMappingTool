# LeuansMappingTool

**The first tool that lets you load SAMP Map Editor mappings into GTA San Andreas Singleplayer — no modloader required.**

Built for [Cleo Redux](https://github.com/cleolibrary/CLEO-Redux), a modern JavaScript scripting engine for GTA SA.

---

## What is this?

If you've ever built a map in **SAMP Map Editor** and wanted to see it in your **singleplayer** game, you know the pain — there was no easy way. Existing tools require modloaders, IMG editors, or complex setups.

**LeuansMappingTool** solves this with two simple files:

- `LeuansMappingTool.js` — a Cleo Redux script that reads your map data and spawns all objects in-game, automatically, every time you load the game.
- `MapConverter.py` — a Python script that converts your raw Map Editor export files into the format the JS script can read. Run it once, done.

No modloader. No IMG editing. No complex configuration.

---

## Requirements

- GTA San Andreas (PC)
- [Cleo Redux](https://github.com/cleolibrary/CLEO-Redux) installed
- Python 3.x (for the converter, run once)

---

## How to use

### Step 1 — Convert your map files

Drop your raw Map Editor export files (`.ini`, `.pwn` or `.txt`) into:
```
GTA San Andreas\CLEO\mapping\
```

Your files should look like this (standard SAMP Map Editor export):
```
CreateObject(1412, 1687.27991, -2434.15430, 13.76362, 0.00000, 0.00000, 84.90007);
CreateObject(1412, 1684.10535, -2434.33081, 13.76362, 0.00000, 0.00000, 89.34009);
```

Then run **`MapConverter.py`**. It will:
- Read every file in the `mapping/` folder
- Convert each one to a proper format the JS script can read
- Generate `index.ini` listing all your map files

### Step 2 — Install the script

Copy `LeuansMappingTool.js` into your `CLEO` folder:
```
GTA San Andreas\CLEO\LeuansMappingTool.js
```

### Step 3 — Play

Launch the game. After loading into the world, the script runs automatically and spawns all your mapped objects. A message will confirm how many files and objects were loaded.

```
LeuansMappingTool
Files: 2 | Objects: 147
```

That's it.

---

## Adding more maps

1. Drop new map files into `CLEO\mapping\`
2. Run `MapConverter.py` again
3. Reload the game

---

## How it works (technical)

`MapConverter.py` takes the raw `CreateObject(modelId, x, y, z, rx, ry, rz)` lines from your Map Editor exports and reformats them into INI files that Cleo Redux can parse. It also generates `index.ini` which tells the JS script which files to load.

`LeuansMappingTool.js` reads `index.ini` on game start, iterates through every listed map file, parses each `CreateObject` line, requests the model, and spawns it using `ScriptObject.CreateNoOffset` — which places objects at the **exact coordinates** from the Map Editor, with no ground-offset adjustment.

`RemoveBuildingForPlayer` lines are ignored, as that opcode is not available in singleplayer Cleo Redux context.

---

## Why this matters

Cleo Redux brought modern JavaScript scripting to GTA SA singleplayer, but there was no bridge between the massive library of SAMP Map Editor community maps and SP players. This tool fills that gap — for the first time, you can take any map from the SAMP mapping community and run it in your singleplayer game with zero friction.

---

## Credits

Built by **Leuan** for the GTA SA Cleo Redux community.
