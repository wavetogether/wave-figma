import './ui.css';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';


function postMessage (type: string, data?: {[index: string]: any}) {
    parent.postMessage({
        pluginMessage: { type, data }
    }, '*');
}

function setButtonState (state: boolean) {
    const buttonDOM = document.getElementById('btn-save') as HTMLButtonElement;

    if (state) {
        buttonDOM.classList.remove('disabled');
    } else {
        buttonDOM.classList.add('disabled');
    }
}

function setLoadingState (state: boolean) {
    const loading = document.getElementById('loading');

    loading.style.zIndex = state ? '100' : '-1';
    loading.style.opacity = state ? '1' : '0';
}

function reset () {
    setButtonState(true);
    setLoadingState(false);

    window.removeEventListener('focus', done);
}

function done () {
    reset();
    toast('Icon font is generated!');
}

function save (data) {
    console.log(data);
    setButtonState(false);
    setLoadingState(true);

    const zip = new JSZip();
    const { fontBuffer, fontConfig, fontName } = data;

    zip.file(`${fontName}.ttf`, Buffer.from(fontBuffer.buffer));
    zip.file(`${fontName}Config.json`, JSON.stringify(fontConfig));

    zip.generateAsync({
        type: 'blob'
    }).then((file) => {
        saveAs(file, `${fontName}.zip`);
        postMessage('req: done');

        window.addEventListener('focus', done);
    });
}

function toast (msg) {
    const toastBoxDOM = document.getElementById('message');
    const toastTextDOM = document.getElementById('message-text');

    toastTextDOM.innerText = msg;

    toastBoxDOM.style.opacity = '1';

    setTimeout(() => {
        toastBoxDOM.style.opacity = '0';
    }, 3000);
}

window.onload = () => {
    reset();

    const saveButtonDOM = document.getElementById('btn-save');
    const nameInputDOM = document.getElementById('input-font-name') as HTMLInputElement;
    const toastBoxDOM = document.getElementById('message');

    saveButtonDOM.onclick = () => {
        postMessage('req: save', {
            fontName: nameInputDOM.value || 'WaveIcon'
        });
    };

    toastBoxDOM.style.display = 'flex';
}

window.onmessage = (event) => {
    if (!event.data || !event.data.pluginMessage) {
        return;
    }

    const {
        type,
        data
    } = event.data.pluginMessage;

    switch (type) {
        case 'res: save':
            save(data);
            break;

        case 'err: internal-error':
        case 'err: duplicated-names':
        case 'err: no-selection':
            reset();
            break;

        default:
            postMessage('err: unknown-type', {
                unknownType: type
            });
    }
}
