import _ from 'lodash';

import {alert} from './utils/error';
import {getSelections, exportGlyphs} from './utils/fetch';
import {convertGlyphsToData, convertDataToConfig} from './utils/convert';
import {generateIconFont, generateFontBuffer} from './utils/generateFont';

function init() {
    figma.showUI(__html__, {width: 240, height: 258});

    figma.ui.postMessage({
        type: 'onChangeSelection',
        data: {
            isSelected: !!getSelections()
        }
    });
}

// Note: Main Logic

figma.on('selectionchange', () => {
    figma.ui.postMessage({
        type: 'onChangeSelection',
        data: {
            isSelected: !!getSelections()
        }
    });
});

init();
