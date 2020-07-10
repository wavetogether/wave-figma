import {log} from './notify';
import * as png from '@vivaxy/png';

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
    const metadata = png.decode(image.data.buffer);

    metadata.icc = {
        name: profile.name,
        profile: PROFILES[
            PROFILES_MAP[profile.name][profile.version]
        ]
    };

    delete metadata.sRGB;

    image.data = png.encode(metadata);

    return image;
}
