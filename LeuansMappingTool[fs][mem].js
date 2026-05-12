// <reference path=".config/sa.d.ts" />
// LeuansMappingTool - Loads SAMP Map Editor objects into GTA SA via Cleo Redux
// Standalone script, no menu or signal dependency.
//
// Run MapConverter.py first to prepare your map files.

const INDEX_FILE = "cleo\\mapping\\index.ini";
const MAX_FILES  = 128;
const MAX_LINES  = 4000;

wait(5000);
const player = new Player(0);
while (!player.isPlaying() || !player.isControlOn()) wait(500);

let spawnedObjects = [];

function requestModel(modelId) {
    if (native("HAS_MODEL_LOADED", modelId)) return true;
    native("REQUEST_MODEL", modelId);
    for (let t = 0; t < 30; t++) {
        wait(0);
        if (native("HAS_MODEL_LOADED", modelId)) return true;
    }
    return false;
}

function loadMappingFile(filePath) {
    let count = 0;
    for (let i = 0; i < MAX_LINES; i++) {
        if (i > 0 && i % 100 === 0) wait(0);

        let line = IniFile.ReadString(filePath, "map", "" + i);
        if (!line) break;
        line = line.trim();

        if (!line.startsWith("CreateObject(")) continue;

        let inner = line.slice("CreateObject(".length);
        let closeIdx = inner.indexOf(")");
        if (closeIdx === -1) continue;
        inner = inner.slice(0, closeIdx);

        let parts = inner.split(",");
        if (parts.length < 4) continue;

        let modelId = parseInt(parts[0]);
        let x       = parseFloat(parts[1]);
        let y       = parseFloat(parts[2]);
        let z       = parseFloat(parts[3]);
        let rx      = parts.length > 4 ? parseFloat(parts[4]) : 0.0;
        let ry      = parts.length > 5 ? parseFloat(parts[5]) : 0.0;
        let rz      = parts.length > 6 ? parseFloat(parts[6]) : 0.0;

        if (isNaN(modelId) || isNaN(x) || isNaN(y) || isNaN(z)) continue;
        if (!requestModel(modelId)) continue;

        let obj = ScriptObject.CreateNoOffset(modelId, x, y, z);
        obj.setRotation(rx, ry, rz);
        obj.freezePosition(true);
        spawnedObjects.push(obj);
        count++;
    }
    return count;
}

function loadAll() {
    for (let i = 0; i < spawnedObjects.length; i++) {
        try { spawnedObjects[i].delete(); } catch (e) {}
    }
    spawnedObjects = [];

    let totalObjects = 0;
    let totalFiles   = 0;

    for (let f = 0; f < MAX_FILES; f++) {
        let filename = IniFile.ReadString(INDEX_FILE, "files", "" + f);
        if (!filename) break;
        filename = filename.trim();
        if (!filename) continue;

        let filePath = "cleo\\mapping\\" + filename;
        let n = loadMappingFile(filePath);
        totalObjects += n;
        totalFiles++;
    }

    showTextBox("~g~LeuansMappingTool~n~~w~Files: " + totalFiles + " | Objects: " + totalObjects);
}

loadAll();

while (true) {
    wait(2000);
}
