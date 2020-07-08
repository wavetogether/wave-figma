import {alert} from './utils/notify';
import {getExportables, exportAsync, appendProfile} from './utils/fetch';

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
    figma.showUI(__html__, {width: 240, height: 360});
    onChangeSelection();
}

figma.on('selectionchange', onChangeSelection);
figma.ui.onmessage = msg => {
    console.log(msg.type);
    switch (msg.type) {
        case 'onClickSave':
            const nodes = getExportables();

            exportAsync(nodes).then(images => {
                console.log('exportAsync');
                appendProfile(images, msg.data).then(imageData => {
                    console.log('appendProfiles');

                    figma.ui.postMessage({
                        type: 'onSave',
                        data: {
                            images: imageData
                        }
                    });
                    console.log('onSave');
                });
                console.log('exporting...');
            });

            break;
        case 'onClickRefresh':
            onChangeSelection();
            break;
        case 'onSaveDone':
            console.log('saved');
            break;
        default:
            alert('Sent unknown action message');
    }
};

init();
