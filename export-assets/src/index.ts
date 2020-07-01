import _ from 'lodash';

import {alert} from './utils/error';
import {getSelections, getExportables} from './utils/fetch';
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

// Note: Main Logic
figma.on('selectionchange', onChangeSelection);
figma.ui.onmessage = async (msg) => {
    switch (msg.type) {
        case 'onClickSave':
            break;
        default:
            alert('Sent unknown action message');
    }
};

console.log(getSelections()[0])

init();