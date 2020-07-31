import './ui.css';

function postMessage(type: string) {
    parent.postMessage({
        pluginMessage: {type}
    }, '*');
}

function setButtonState(state: boolean) {
    const buttonDOM = document.getElementById('btn-save') as HTMLButtonElement;

    if (state) {
        buttonDOM.classList.remove('disabled');
    } else {
        buttonDOM.classList.add('disabled');
    }
}

function setLoadingState(state: boolean) {
    const loading = document.getElementById('loading');

    loading.style.zIndex = state ? '100' : '-1';
    loading.style.opacity = state ? '1' : '0';
}

function reset() {
    setLoadingState(false);

    window.removeEventListener('focus', reset);
}

function save(font) {

}

window.onload = () => {
    reset();
}

window.onmessage = (event) => {
    if (!event.data) {
        return;
    }
}
