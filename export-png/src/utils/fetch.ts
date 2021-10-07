import pako from 'pako';
import {
    encodeImageChunks,
    getDataBytes,
    getImageChunks,
    setProfileChunk
} from './chunk';
// import {log} from './notify';

import PROFILES_MAP from './profiles-map.json';
import PROFILES from './profiles.json';

function hasExportablePNG(settings): boolean {
    for (const setting of settings) {
        if (setting.format.toLowerCase() === "png") {
            return true;
        }
    }

    return false;
}

export function getExportables(): Array<SceneNode> {
    const selections: ReadonlyArray<SceneNode> = figma.currentPage.selection;
    const exportables: Array<SceneNode> = [];

    if (!!selections) {
        selections.forEach((node) => {
            if (node.exportSettings.length > 0 && hasExportablePNG(node.exportSettings)) {
                exportables.push(node);
            }
        });
    }

    return exportables;
}

export function getSelections(): boolean | ReadonlyArray<SceneNode> {
    const selections = figma.currentPage.selection;

    if (selections.length === 0) {
        return false;
    }

    return selections;
}

export async function exportAsync(nodes: Array<SceneNode>): Promise<Array<{ name: string, data: Uint8Array }>> {
    const output: Array<{name: string, data: Uint8Array}> = [];

    for (let node of nodes) {
        for (let option of node.exportSettings) {
            if (option.format.toLowerCase() === 'png') {
                output.push({
                    name: `${node.name}${option.suffix}.${option.format.toLowerCase()}`,
                    data: await node.exportAsync(option)
                });
            }
        }
    }

    return output;
}

export function encodeImage(image, profile) {
    console.log(`processing starts ... ${image.name}`);

    const _start = Date.now();
    const _chunks = getImageChunks(image.data);
    const _chunkData = getDataBytes({
        'Profile name': convertStringToBytes(profile.name),
        'Null separator': convertNumToByte(0),
        'Compression method': convertNumToByte(0),
        'Compressed profile': pako.deflate(PROFILES[PROFILES_MAP[profile.name][profile.version]]),
    });

    image.data = encodeImageChunks(setProfileChunk(_chunks, _chunkData));

    console.log(`... processing ends: ${Date.now() - _start}ms\n\n`);

    return image;
}

function convertStringToBytes(val) {
    const data = new Uint8Array(val.length);

    for (let i = 0; i < val.length; i++) {
        data[i] = val.charCodeAt(i);
    }

    return data;
}

function convertNumToByte(val) {
    return new Uint8Array([val & 0xff]);
}
