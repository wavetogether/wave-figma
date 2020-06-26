import './ui.css';
import {saveAs} from 'file-saver';
import JSZip from 'jszip';
/*

function simplePost(type: string) {
    parent.postMessage({
        pluginMessage: {type}
    }, '*');
}

function saveFont(data) {
    const zip = new JSZip();
    const {fontBuffer, fontConfig, fontName} = data;

    zip.file(`${fontName}.ttf`, Buffer.from(fontBuffer.buffer));
    zip.file(`${fontName}Config.json`, JSON.stringify(fontConfig));

    zip.generateAsync({
        type: 'blob'
    }).then(zipFile => {
        saveAs(zipFile, `${fontName}.zip`);
        simplePost('done');
    });
}
*/

function setButtonState(state: boolean) {
    const buttonDOM = document.getElementById('btn-save') as HTMLButtonElement;

    if (state) {
        buttonDOM.style.background = '#EE3669';
        buttonDOM.style.color = '#FFFFFF';
        buttonDOM.style.cursor = 'pointer';
        buttonDOM.disabled = false;
    } else {
        buttonDOM.style.background = '#E3E4E8';
        buttonDOM.style.color = '#F5F6F8';
        buttonDOM.style.cursor = 'not-allowed';
        buttonDOM.disabled = true;
    }
}

window.onmessage = (event) => {
    if (!event.data) {
        return;
    }

    const msg = event.data?.pluginMessage;

    switch (msg?.type) {
        case 'onChangeSelection':
            setButtonState(msg?.data?.isSelected);
            break;
        case 'onPressSave':
            break;
        default:
            console.log('message type checked');
    }
};
/*

document.getElementById('btn-save').onclick = () => {
    // @ts-ignore
    const fontName = document.getElementById('input-fontName').value;
    const loading = document.getElementById('loading');

    loading.style.zIndex = '100';
    loading.style.opacity = '1';

    parent.postMessage({
        pluginMessage: {
            type: 'save',
            fontName
        }
    }, '*');
};

document.getElementById('btn-cancel').onclick = () => {
    simplePost('cancel');
};
*/
