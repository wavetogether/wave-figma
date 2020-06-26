const START_UNICODE = 0xe001;

function _chunk(arr, size) {
    const chunkedArr: Array<any> = [];

    let i = 0;

    while (i < arr.length) {
        chunkedArr.push(arr.slice(i, size + i));
        i += size;
    }

    return chunkedArr;
}

function convertStringToHash(str) {
    let hash;

    for (let i = 0; i < str.length; i++) {
        hash = Math.imul(31, hash) + (str.charCodeAt(i) | 0);
    }

    return hash;
}

function convertHashToUnicode(hash, startUnicode) {
    let code = hash.toString(16);
    let unicode = '';

    if (hash < 0) {
        unicode += '%ue000';
        code = code.substring(1);
    }

    const unicodeChunks = _chunk(code, 3).map((codeChunk) => {
        const unicodeChunk = startUnicode + parseInt(codeChunk, 16);

        return `%u${unicodeChunk.toString(16)}`;
    });

    unicode += unicodeChunks.join('');

    return unescape(unicode);
}

export function convertGlyphsToData(glyphs, layers) {
    return glyphs.map((glyph, i) => {
        const name: string = layers[i].name.replace(/(\s*\/\s*)/gi, '_');
        const hash = convertStringToHash(name);
        const code = convertHashToUnicode(hash, START_UNICODE);

        return {
            content: glyph,
            metadata: {
                name,
                unicode: [code],
            },
        };
    });
}

export function convertDataToConfig(data) {
    return {
        name: 'WaveIcon',
        icons: data.map(({metadata: {name, unicode}}) => ({
            name,
            unicode: escape(unicode[0]),
        })),
    };
}
