import {alert} from './utils/notify';
import {getExportables, exportAsync, encodeImage} from './utils/fetch';

let imageStack: Array<{name: string, data: Uint8Array}> = [];
let embedStack: Array<{name: string, data: Uint8Array}> = [];
let profile = {
    name: 'sP3C',
    version: 'v4'
};

function onChangeSelection() {
    const exportableNodes: Array<SceneNode> = getExportables();

    figma.ui.postMessage({
        type: 'onChangeSelection',
        data: {
            isEnabled: exportableNodes.length > 0
        }
    });
}

function init() {
    imageStack = [];
    embedStack = [];

    figma.showUI(__html__, {width: 240, height: 360});

    onChangeSelection();
}

figma.on('selectionchange', onChangeSelection);
figma.ui.onmessage = async msg => {
    switch (msg.type) {
        case 'onClickRefresh':
            onChangeSelection();
            break;

        case 'onClickSave':
            const nodes = getExportables();

            if (nodes.length > 0) {
                imageStack = await exportAsync(nodes);
                profile = msg.data;

                figma.ui.postMessage({
                    type: 'onRequestEncode',
                    data: {
                        index: 0,
                        length: imageStack.length,
                        text: imageStack[0].name
                    }
                });
            } else {
                alert('There is no node to export PNG');

                figma.ui.postMessage({
                    type: 'onError',
                });
            }

            break;

        case 'onResponseEncode':
            const i = msg.data.index;
            const image = imageStack[i];
            const embed = encodeImage(image, profile);

            embedStack.push(embed);

            if (embedStack.length < imageStack.length) {
                figma.ui.postMessage({
                    type: 'onRequestEncode',
                    data: {
                        index: i + 1,
                        length: imageStack.length,
                        text: imageStack[i + 1].name
                    }
                });
            } else {
                figma.ui.postMessage({
                    type: 'onRequestSave',
                    data: {
                        images: embedStack
                    }
                });
            }

            break;

        case 'onDoneSave':
            imageStack = [];
            embedStack = [];

            onChangeSelection();

            break;

        default:
            alert('Received unknown action message');
    }
};

init();
