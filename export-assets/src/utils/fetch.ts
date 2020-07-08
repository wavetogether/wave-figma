import {log} from './notify';
import * as png from '@vivaxy/png';

import PROFILES_MAP from './profiles-map.json';
import PROFILES from './profiles.json';

export function getExportables(): Array<SceneNode> {
    const selections: ReadonlyArray<SceneNode> = figma.currentPage.selection;
    const exportables: Array<SceneNode> = [];

    if (!!selections) {
        selections.forEach((node) => {
            if (node.exportSettings.length > 0) {
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

export async function exportGlyphs(layers) {
    const glyphs: Array<any> = [];
    const exportOptions: ExportSettingsSVG = {format: 'SVG'};

    for (let layer of layers) {
        const byteData = new Uint8Array(await layer.exportAsync(exportOptions));
        const glyph = String.fromCharCode.apply(null, byteData);

        glyphs.push(glyph);
    }

    return new Promise(resolve => {
        resolve(glyphs);
    });
}

export async function exportAsync(nodes: Array<SceneNode>) {
    const output = [];

    for (let node of nodes) {
        for (let option of node.exportSettings) {
            output.push({
                name: `${node.name}${option.suffix}.${option.format.toLowerCase()}`,
                data: await node.exportAsync(option)
            });
        }
    }

    return new Promise(resolve => {
        resolve(output);
    });
}

export async function appendProfile(images, profile) {
    const iccName = PROFILES_MAP[profile.name][profile.version];
    const iccData = PROFILES[iccName];

    const output = [];

    for (const image of images) {
        const encodedImage = await encodeImage(image, profile.name, iccData);
        output.push(encodedImage);
    }

    return new Promise(resolve => {
       resolve(output);
    });
}

async function encodeImage(image, profileName, profileData) {
    const metadata = png.decode(image.data.buffer);

    metadata.icc = {
        name: profileName,
        profile: profileData
    };

    delete metadata.sRGB;

    image.data = png.encode(metadata);

    return new Promise(resolve => {
       resolve(image);
    });
}