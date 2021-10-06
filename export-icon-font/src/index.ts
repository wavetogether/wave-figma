import { getSelectedNodes, exportGlyphs, hasDuplicatedNames } from './utils/fetch';
import { convertGlyphToData, getFontConfig } from './utils/convert';
import { getIconFontData, getFontBuffer } from './utils/fontify';
import { TFontConfig } from './utils/types';
import {getFlutterIconMap} from "./utils/flutter";

function postMessage (type: string, data?: {}) {
    figma.ui.postMessage({ type, data });
}

async function convertIconToFont (
    nodes: ReadonlyArray<SceneNode>,
    fontName: string,
    prefix: string,
    suffix: string,
): Promise<[Buffer, TFontConfig, String]> {
    const glyphs = await exportGlyphs(nodes);
    const glyphData = convertGlyphToData(glyphs, nodes, prefix, suffix);
    const fontConfig = getFontConfig(glyphData, fontName);

    const fontData = await getIconFontData(glyphData, { fontName, fontHeight: 1000, normalize: true });
    const fontBuffer = getFontBuffer(fontData);

    const fontMap = getFlutterIconMap(glyphData);

    return new Promise((resolve) => {
       resolve([fontBuffer, fontConfig, fontMap]);
    });
}

async function save (
  fontName: string = 'WaveIcon',
  prefix: string = '',
  suffix: string = ''
) {
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
        const [fontBuffer, fontConfig, fontMap] = await convertIconToFont(nodes, fontName, prefix, suffix);

        postMessage('res: save', {
            fontBuffer,
            fontConfig,
            fontMap,
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
            await save(data.fontName, data.prefix, data.suffix);
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
    figma.showUI(__html__, { width: 240, height: 280 });
    figma.ui.onmessage = onMessage;
}

init();