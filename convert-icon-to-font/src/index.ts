import { getSelectedNodes, exportGlyphs, hasDuplicatedNames } from './utils/fetch';
import { convertGlyphToData, getFontConfig } from './utils/convert';
import { getIconFontData, getFontBuffer } from './utils/fontify';
import { TFontConfig } from './utils/types';

function postMessage (type: string, data?: {}) {
    figma.ui.postMessage({ type, data });
}

async function convertIconToFont (
    nodes: ReadonlyArray<SceneNode>,
    fontName: string = 'WaveIcon'
): Promise<[Buffer, TFontConfig]> {
    const glyphs = await exportGlyphs(nodes);
    const glyphData = convertGlyphToData(glyphs, nodes);
    const fontConfig = getFontConfig(glyphData, fontName);

    const fontData = await getIconFontData(glyphData, { fontName, fontHeight: 1000, normalize: true });
    const fontBuffer = getFontBuffer(fontData);

    return new Promise((resolve) => {
       resolve([fontBuffer, fontConfig]);
    });
}

async function save (fontName: string = 'WaveIcon') {
    const nodes = getSelectedNodes();
    const duplNames = hasDuplicatedNames(nodes);

    if (nodes.length === 0) {
        postMessage('err: no-selection');
        figma.notify('⚠️ ERR: There is no selection to export');

        return;
    }

    if (duplNames.length > 0) {
        postMessage('err: duplicated-names');
        figma.notify('⚠️ ERR: There are duplicated names in your selected nodes (check your console)');

        console.log('DUPLICATED NAMES:', duplNames);

        return;
    }

    try {
        const [fontBuffer, fontConfig] = await convertIconToFont(nodes, fontName);

        postMessage('res: save', {
            fontBuffer,
            fontConfig,
            fontName
        });
    } catch (err) {
        postMessage('err: internal-error');
        figma.notify('⚠️ ERR: Couldn\'t convert icon to font');
    }


}

async function onMessage ({ type, data }) {
    switch (type) {
        case 'req: save':
            await save(data.fontName);
            break;

        case 'req: done':
            break;

        case 'err: unknown-type':
            console.log('UNKNOWN TYPE:', data.unknownType);
            break;

        default:
            figma.notify(`⚠️ ERR: Unknown message type (${type})`)
    }
}

function init () {
    figma.showUI(__html__, { width: 240, height: 155 });
    figma.ui.onmessage = onMessage;
}

init();