function clone(node) {
    return JSON.parse(JSON.stringify(node))
}

function postMessage (type: string, data?: {}) {
    figma.ui.postMessage({ type, data });
}

function syncColor (parserString: string) {
    if (!parserString.includes('PALETTE_NAME')) {
        figma.notify('⚠️ Please write proper parser string including the word, "PALETTE_NAME"');
        postMessage('req: reset');

        return;
    }

    const parser = new RegExp(
        parserString.replace('PALETTE_NAME', '.*')
    );

    const paintStyles = figma.getLocalPaintStyles();

    for (const paintStyle of paintStyles) {
        const desc = paintStyle.description;
        const linkedColor = desc.match(parser);

        if (linkedColor) {
            const linkedColorName = linkedColor[0].replace(/([{}])/g, '');
            const paint = clone(getColor(linkedColorName));

            paint.opacity = paintStyle.paints[0].opacity;
            paintStyle.paints = [paint];
        }
    }

    figma.notify('✅ Color Palette is Synced!!');
    figma.closePlugin();
}

function getColor (name: string) {
    const paintStyles = figma.getLocalPaintStyles();

    for (const paintStyle of paintStyles) {
        if (paintStyle.name === name) {
            return paintStyle.paints[0];
        }
    }
}

async function onMessage ({ type, data }) {
    switch (type) {
        case 'req: sync':
            syncColor(data.parserString);
            break;

        case 'err: unknown-type':
            console.log('UNKNOWN TYPE:', data.unknownType);
            break;

        default:
            figma.notify(`⚠️ ERR: Unknown message type (${type})`)
    }
}

function init () {
    figma.showUI(__html__, { width: 240, height: 237 });
    figma.ui.onmessage = onMessage;
}

init();
