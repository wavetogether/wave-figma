import { getSelectedNodes, exportGlyphs } from './utils/fetch';

async function convertIconToFont (
    fontName: string = 'Wave Icon'
) {
    const nodes = getSelectedNodes();
    const glyphs = exportGlyphs(nodes);
}

async function onMessage ({ type, data }) {
    switch (type) {
        case 'onRequestSave':
            break;
        case 'onRequestDone':
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