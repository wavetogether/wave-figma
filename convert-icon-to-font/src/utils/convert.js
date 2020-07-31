const BASE_UNICODE = 0xe001;
function convertArrayToChunk(raw, size) {
    const chunk = [];
    let i = 0;
    while (i < raw.length) {
        chunk.push(raw.slice(i, size + i));
        i += size;
    }
    return chunk;
}
function convertStringToHash(str) {
    let hash;
    for (let i = 0; i < str.length; i++) {
        hash = Math.imul(31, hash) + (str.charCodeAt(i) | 0);
    }
    return hash;
}
function convertHashToUnicode(hash) {
    let raw = hash.toString(16);
    let unicode = '';
    if (hash < 0) {
        unicode += '%ue000';
        raw = raw.substring(1);
    }
    const unicodeChunks = convertArrayToChunk(raw, 3).map((chunk) => {
        const unicodeChunk = BASE_UNICODE + parseInt(chunk, 16);
        return `%u${unicodeChunk.toString(16)}`;
    });
    unicode += unicodeChunks.join('');
    return unicode;
}
export function convertGlyphToData(glyphs, nodes) {
    return glyphs.map((glyph, i) => {
        const name = nodes[i].name.replace(/(\s*\/\s*)/g, '_');
        const hash = convertStringToHash(name);
        const unicode = convertHashToUnicode(hash);
        return {
            content: glyph,
            metadata: { name, unicode }
        };
    });
}
export function getFontConfig(glyphData, fontName = 'WaveIcon') {
    const config = { name: fontName, icons: {} };
    for (let glyphDatum of glyphData) {
        config.icons[glyphDatum.metadata.name] = glyphDatum.metadata.unicode;
    }
    return config;
}
