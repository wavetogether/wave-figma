import './ui.css';
import {saveAs} from 'file-saver';
import * as JSZip from 'jszip';

const PROFILES = {
    // Updated on June 29, 2020
    'sP3C': {
        name: 'Display P3 (compatible)',
        v4: true,
        v2: true
    },
    'sP3': {
        name: 'Display P3',
        v4: true,
        v2: true
    },
    'sRGB': {
        name: 'sRGB',
        v4: true,
        v2: true
    },
    'sGry': {
        name: 'sGrey',
        v4: true,
        v2: true
    },
    'ROMM': {
        name: 'ProPhoto RGB (ROMM RGB)',
        v4: true,
        v2: true
    },
    'R709': {
        name: 'Rec. 709 (BT.709)',
        v4: true,
        v2: true
    },
    'REC2020C': {
        name: 'Rec. 2020 (compatible)',
        v4: true,
        v2: true
    },
    'REC2020': {
        name: 'Rec. 2020',
        v4: true,
        v2: true
    },
    'A98C': {
        name: 'Adobe RGB (1998)',
        v4: false,
        v2: true
    },
    'APLC': {
        name: 'Apple RGB',
        v4: false,
        v2: true
    },
    'ACMC': {
        name: 'ColorMatch RGB',
        v4: false,
        v2: true
    },
    'AWGC': {
        name: 'Wide Gamut RGB',
        v4: false,
        v2: true
    }
};

const DEFAULT_PROFILE = 'sP3C';
const HIDDEN_PROFILES = ['sGry', 'ROMM', 'R709', 'REC2020C', 'REC2020', 'A98C', 'APLC', 'ACMC', 'AWGC'];

function simplePost(type: string) {
    parent.postMessage({
        pluginMessage: {type}
    }, '*');
}

function setButtonState(state: boolean) {
    const buttonDOM = document.getElementById('btn-save') as HTMLButtonElement;
    buttonDOM.disabled = !state;
}

function saveImages(images) {
    // @ts-ignore
    const zip = new JSZip();

    for (let image of images) {
        zip.file(`${image.name}`, Buffer.from(image.data));
    }

    zip.generateAsync({
       type: 'blob'
    }).then(zipFile => {
       saveAs(zipFile, 'assets.zip');
       simplePost('onSaveDone');
    });
}

window.onload = () => {
    const profileList = document.getElementById('profile-list');
    const versionList: NodeListOf<HTMLInputElement> = document.getElementsByName('profile-version') as NodeListOf<HTMLInputElement>

    for (let profile in PROFILES) {
        let checked = '';
        let hidden = '';

        if (profile === DEFAULT_PROFILE) {
            checked = 'checked';
        } else if (HIDDEN_PROFILES.includes(profile)) {
            hidden = 'hidden';
        }

        profileList.insertAdjacentHTML('beforeend', `
            <label class="group-input ${hidden}">
                <input type="radio" name="color-profile" value="${profile}" ${checked ? 'checked="checked"' : ''}>
                <span class="radio-mark"></span>
                <span class="radio-label">${PROFILES[profile].name}</span>
            </label>
        `);
    }

    document.getElementsByName('color-profile').forEach((elm: HTMLInputElement) => {
        elm.onclick = () => {
            const profile = PROFILES[elm.value];

            versionList[0].disabled = !profile.v4;

            if (!profile.v4) {
                versionList[1].checked = true;
                (versionList[0].parentNode as HTMLElement).classList.add('disabled');
            } else {
                (versionList[0].parentNode as HTMLElement).classList.remove('disabled');
                versionList[0].checked = true;
            }
        };
    });

    document.getElementById('btn-save').onclick = () => {
        const loading = document.getElementById('loading');

        loading.style.zIndex = '100';
        loading.style.opacity = '1';

        const profile: HTMLInputElement = document.querySelector("input[name='color-profile']:checked");
        const version: HTMLInputElement = document.querySelector("input[name='profile-version']:checked");

        setTimeout(() => {
            parent.postMessage({
                pluginMessage: {
                    type: 'onClickSave',
                    data: {
                        name: profile.value,
                        version: version.value
                    }
                }
            }, '*');
        }, 100);
    };

    document.getElementById('btn-more-profile').onclick = ({target}) => {
        const hiddenProfiles: HTMLCollectionOf<Element> = document.getElementsByClassName('group-input hidden');

        (target as HTMLElement).style.display = 'none';

        for (let i = 0; i < hiddenProfiles.length; i++) {
            hiddenProfiles[i].classList.add('visible');
        }
    };

    document.getElementById('btn-refresh').onclick = () => {
        simplePost('onClickRefresh');
    };
};

window.onmessage = (e) => {
    if (!e.data) {
        return;
    }

    const msg = e.data?.pluginMessage;

    if (!msg) {
        return;
    }

    switch (msg?.type) {
        case 'onChangeSelection':
            setButtonState(msg?.data?.isEnabled);
            break;
        case 'onSave':
            saveImages(msg?.data?.images);
            break;
        default:
            console.error('Unknown message type is received');
    }
};

