import { getSelectedNodes, exportGlyphs, hasDuplicatedNames } from './utils/fetch';
import { convertGlyphToData, getFontConfig } from './utils/convert';
import { getIconFontData, getFontBuffer } from './utils/fontify';
import { TFontConfig } from './utils/types';

async function convertIconToFont (
    nodes: ReadonlyArray<SceneNode>,
    fontName: string = 'WaveIcon'
): Promise<[Buffer, TFontConfig]> {
    const glyphs = await exportGlyphs(nodes);
    const glyphData = convertGlyphToData(glyphs, nodes);
    const fontConfig = getFontConfig(glyphData, fontName);

    const fontData = await getIconFontData(glyphData, { fontName, fontHeight: 1000, normalize: true });
    console.log('font data:', fontData);
    const fontBuffer = getFontBuffer(fontData);
    console.log('font buffer:', fontBuffer);

    return new Promise((resolve) => {
       resolve([fontBuffer, fontConfig]);
    });
}

async function onSave (fontName: string = 'WaveIcon') {
    const nodes = getSelectedNodes();
    const duplNames = hasDuplicatedNames(nodes);

    if (duplNames.length > 0) {
        figma.ui.postMessage({
            type: 'err: duplicated-names'
        });

        figma.notify('⚠️ ERR: There are duplicated names in your selected nodes (check your console)');
        console.log('DUPLICATED NAMES:', duplNames);

        return;
    }

    const [fontBuffer, fontConfig] = await convertIconToFont(nodes, fontName);

    figma.ui.postMessage({
        type: 'res: save',
        data: { fontBuffer, fontConfig, fontName }
    });
}

async function onMessage ({ type, data }) {
    switch (type) {
        case 'req: save':
            console.log('req: save');
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