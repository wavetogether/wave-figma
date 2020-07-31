import { getSelectedNodes, exportGlyphs, hasDuplicatedNames } from './utils/fetch';
import {convertGlyphToData, getFontConfig} from "./utils/convert";

async function convertIconToFont (
    nodes: ReadonlyArray<SceneNode>,
    fontName: string = 'WaveIcon'
) {
    const glyphs = await exportGlyphs(nodes);
    const glyphData = convertGlyphToData(glyphs, nodes);
    const fontConfig = getFontConfig(glyphData, fontName);
}

async function onSave (fontName: string = 'WaveIcon') {
    const nodes = getSelectedNodes();

    if (hasDuplicatedNames(nodes)) {
        figma.ui.postMessage({
            type: 'err: duplicated-names'
        });

        figma.notify('⚠️ ERR: There are duplicated names in your selected nodes');

        return;
    }

    // const [fontBuffer, fontConfig] = await convertIconToFont(nodes, fontName);
}

async function onMessage ({ type, data }) {
    switch (type) {
        case 'req: save':
            await onSave();
            break;
        case 'req: done':
            break;
        default:
            figma.notify('⚠️ ERR: Unknown message type')
    }
}

function init () {
    figma.showUI(__html__);
    figma.ui.onmessage = onMessage;
}

init();