import _ from 'lodash';

export function alert (errType: String) {
    const errList = ['no-selection'];

    if (_.includes(errList, errType)) {
        figma.notify(errorMessage(errType));
    } else {
        figma.notify(`⚠️ ${errType}`);
    }
}

export function errorMessage (errType: String) {
    switch (errType) {
        case 'no-selection':
            return '⚠️ Select at least 1 layer.';
        default:
            return '⚠️ Something went wrong.';
    }
}

export function log (msg: String) {
    console.log(`==== ${msg} ===`);
}
