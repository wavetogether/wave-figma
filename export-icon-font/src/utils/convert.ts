import { TGlyphData, TFontConfig, TChunkable } from './types';

const BASE_UNICODE = 0xe900;

function convertArrayToChunk (raw: TChunkable, size: number): Array<any> {
    const chunk: Array<any> = [];

    let i = 0;

    while (i < raw.length) {
        chunk.push(raw.slice(i, size + i));
        i += size;
    }

    return chunk;
}

function convertStringToHash (str: string): number {
    let hash;

    for (let i = 0; i < str.length; i++) {
        hash = Math.imul(31, hash) + (str.charCodeAt(i) | 0);
    }

    return hash;
}

function convertHashToUnicode (hash: number): string {
    let raw = hash.toString(16);
    let unicode = '';

    if (hash < 0) {
        unicode += '%ue000';
        raw = raw.substring(1);
    }

    const unicodeChunks = convertArrayToChunk(raw, 3).map((chunk) => {
        const  unicodeChunk = BASE_UNICODE + parseInt(chunk, 16);

        return `%u${unicodeChunk.toString(16)}`;
    });

    unicode += unicodeChunks.join('');

    return unicode;
}

export function convertGlyphToData (glyphs: Array<string>, nodes: ReadonlyArray<SceneNode>): TGlyphData {
    return glyphs.map((glyph, i) => {
        const name = nodes[i].name.replace(/(\s*\/\s*)/g, '_');
        // const code = BASE_UNICODE + i;
        // const unicode = '%u' + code.toString(16);

        const hash = convertStringToHash(name);
        const unicode = convertHashToUnicode(hash);

        return {
            content: glyph,
            metadata: {
                name,
                unicode: [unescape(unicode)]
            }
        };
    });
}

export function getFontConfig (glyphData: TGlyphData, fontName: string = 'WaveIcon'): TFontConfig {
    const config: TFontConfig = { name: fontName, icons: {}};

    for (let glyphDatum of glyphData) {
        config.icons[glyphDatum.metadata.name] = glyphDatum.metadata.unicode[0];
    }

    return config;
}