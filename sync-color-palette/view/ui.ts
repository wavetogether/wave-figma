import './ui.css';

function postMessage (type: string, data?: {[index: string]: any}) {
    parent.postMessage({
        pluginMessage: { type, data }
    }, '*');
}

function setLoadingState (state: boolean) {
    const loading = document.getElementById('loading');

    loading.style.zIndex = state ? '100' : '-1';
    loading.style.opacity = state ? '1' : '0';
}

function setButtonState (state: boolean) {
    const buttonDOM = document.getElementById('btn-sync') as HTMLButtonElement;

    if (state) {
        buttonDOM.classList.remove('disabled');
    } else {
        buttonDOM.classList.add('disabled');
    }
}

function loading (state: boolean) {
    setButtonState(!state);
    setLoadingState(state);
}

function reset () {
    loading(false);
}

function showCaution () {
    const parserInputDOM = document.getElementById('palette-name-parser') as HTMLInputElement;

    parserInputDOM.focus();
    parserInputDOM.classList.add('error');
}

function sync (val) {
    loading(true);

    setTimeout(() => {
        postMessage('req: sync', {
            parserString: val || '{PALETTE_NAME}'
        });
    }, 100);
}

window.onload = () => {
    reset();

    const syncButtonDOM = document.getElementById('btn-sync');
    const parserInputDOM = document.getElementById('palette-name-parser') as HTMLInputElement;

    syncButtonDOM.onclick = () => {
        sync(parserInputDOM.value);
    };

    parserInputDOM.onkeydown = ({keyCode}) => {
        if (keyCode === 13) { // Enter Key
            sync(parserInputDOM.value);
            parserInputDOM.blur();
        } else {
            parserInputDOM.classList.remove('error');
        }
    };
}

window.onmessage = (e) => {
    if (!e.data) {
        return;
    }

    const msg = e.data?.pluginMessage;

    if (!msg) {
        return;
    }

    switch (msg?.type) {
        case 'req: reset':
            showCaution();
            reset();
            break;

        default:
            console.log('Unknown message type is received:', msg.type);
    }
};
