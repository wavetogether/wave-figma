import './ui.css';
import {saveAs} from 'file-saver';
// import JSZip from 'jszip';
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

const PROFILES = {
    // Updated on June 29, 2020
    'sP3C': {
        name: 'Display P3 (compatible)',
        v4: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/DisplayP3Compat-v4.icc?raw=true',
        v2: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/DisplayP3Compat-v2-magic.icc?raw=true'
    },
    'sP3': {
        name: 'Display P3',
        v4: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/DisplayP3-v4.icc?raw=true',
        v2: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/DisplayP3-v2-magic.icc?raw=true'
    },
    'sRGB': {
        name: 'sRGB',
        v4: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/sRGB-v4.icc?raw=true',
        v2: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/sRGB-v2-magic.icc?raw=true'
    },
    'sGry': {
        name: 'sGrey',
        v4: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/sGrey-v4.icc?raw=true',
        v2: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/sGrey-v2-magic.icc?raw=true'
    },
    'ROMM': {
        name: 'ProPhoto RGB (ROMM RGB)',
        v4: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/ProPhoto-v4.icc?raw=true',
        v2: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/ProPhoto-v2-magic.icc?raw=true'
    },
    'R709': {
        name: 'Rec. 709 (BT.709)',
        v4: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/Rec709-v4.icc?raw=true',
        v2: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/Rec709-v2-magic.icc?raw=true'
    },
    'REC2020C': {
        name: 'Rec. 2020 (compatible)',
        v4: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/Rec2020Compat-v4.icc?raw=true',
        v2: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/Rec2020Compat-v2-magic.icc?raw=true'
    },
    'REC2020': {
        name: 'Rec. 2020',
        v4: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/Rec2020-v4.icc?raw=true',
        v2: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/Rec2020-v2-magic.icc?raw=true'
    },
    'A98C': {
        name: 'Adobe RGB (1998)',
        v4: '',
        v2: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/AdobeCompat-v2.icc?raw=true'
    },
    'APLC': {
        name: 'Apple RGB',
        v4: '',
        v2: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/AppleCompat-v2.icc?raw=true'
    },
    'ACMC': {
        name: 'ColorMatch RGB',
        v4: '',
        v2: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/ColorMatchCompat-v2.icc?raw=true'
    },
    'AWGC': {
        name: 'Wide Gamut RGB',
        v4: '',
        v2: 'https://github.com/saucecontrol/Compact-ICC-Profiles/blob/master/profiles/WideGamutCompat-v2.icc?raw=true'
    }
};

const DEFAULT_PROFILE = 'sP3C';
const HIDDEN_PROFILES = ['sGry', 'ROMM', 'R709', 'REC2020C', 'REC2020', 'A98C', 'APLC', 'ACMC', 'AWGC'];

function setButtonState(state: boolean) {
    const buttonDOM = document.getElementById('btn-save') as HTMLButtonElement;
    buttonDOM.disabled = !state;
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
                (versionList[0].parentNode as HTMLElement).classList.remove('disabled')
            }
        };
    });

    document.getElementById('btn-save').onclick = () => {
        const loading = document.getElementById('loading');

        loading.style.zIndex = '100';
        loading.style.opacity = '1';

        parent.postMessage({
            pluginMessage: {
                type: 'onClickSave'
            }
        }, '*');
    };

    document.getElementById('btn-more-profile').onclick = ({target}) => {
        const hiddenProfiles: HTMLCollectionOf<Element> = document.getElementsByClassName('group-input hidden');

        (target as HTMLElement).style.display = 'none';

        for (let i = 0; i < hiddenProfiles.length; i++) {
            hiddenProfiles[i].classList.add('visible');
        }
    };

    document.getElementById('btn-refresh').onclick = () => {
        parent.postMessage({
            pluginMessage: {
                type: 'onClickRefresh'
            }
        }, '*');
    };
};

window.onmessage = async (e) => {
    if (!e.data) {
        return;
    }

    const msg = e.data?.pluginMessage;

    switch (msg?.type) {
        case 'onChangeSelection':
            setButtonState(msg?.data?.isEnabled);
            break;
        case 'onSave':
            break;
        default:
            console.log('message type checked');
    }
};

