const fs = require('fs');
const PROFILE_DIR = './profiles';

const names = fs.readdirSync(PROFILE_DIR);
const profiles = {};

names.forEach(name => {
    if (!name.endsWith('icc')) {
        return;
    }

    const profile = fs.readFileSync(`${PROFILE_DIR}/${name}`);
    const data = new Uint8Array(profile.length);

    for (let i = 0; i < profile.length; i++) {
        data[i] = profile[i];
    }

    profiles[name.slice(0, -4)] = Array.from(data);
});

fs.writeFileSync('src/utils/profiles.json', JSON.stringify(profiles));
console.log('Convert color profiles (.icc) to arrays successfully');