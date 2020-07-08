import _ from 'lodash';

import {alert} from './utils/notify';
import {getExportables, exportAsync, appendProfiles} from './utils/fetch';

import {convertGlyphsToData, convertDataToConfig} from './utils/convert';
import {generateIconFont, generateFontBuffer} from './utils/generateFont';

function onChangeSelection() {
    const exportableNodes: Array<SceneNode> = getExportables();
    console.log(exportableNodes);

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
figma.ui.onmessage = async (msg) => {
    switch (msg.type) {
        case 'onClickSave':
            const nodes = getExportables();
            const buffers = await exportAsync(nodes);
            console.log('ExportAsync:', buffers);
            const images = appendProfiles(buffers);
            console.log('AppendProfiles:', images);

            figma.ui.postMessage({
                type: 'onSave',
                data: {
                    buffers
                }
            });

            break;
        case 'onClickRefresh':
            onChangeSelection();
            break;
        default:
            alert('Sent unknown action message');
    }
};

init();
