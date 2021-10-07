import { extractChunks, encodeChunks } from 'png-metadata-writer';

export function getImageChunks(buffer) {
    return extractChunks(buffer);
}

export function encodeImageChunks(chunks) {
    return encodeChunks(chunks);
}

export function setProfileChunk(chunks, chunkData) {
    const sRGB = getChunkIndex(chunks, 'sRGB');
    const PLTE = getChunkIndex(chunks, 'PLTE');
    const IDAT = getChunkIndex(chunks, 'IDAT');

    let _index = sRGB < 0 ? getInsertPoint(PLTE, IDAT) : sRGB;
    let _offset = sRGB < 0 ? 0 : 1;

    let output = [];

    output = output.concat(chunks.slice(0, _index));
    output.push({ name: 'iCCP', data: chunkData });
    output = output.concat(chunks.slice(_index + _offset));

    return output;
}

function getInsertPoint(c1, c2) {
    c1 = c1 < 0 ? c1 + 100 : c1;
    c2 = c2 < 0 ? c2 + 100 : c2;

    return c1 < c2 ? c1 : c2;
}

function getChunkIndex(chunks, chunkName = 'sRGB') {
    let index = -1;

    for (let i = 0; i < chunks.length; i++) {
        if (chunks[i].name === chunkName) {
            index = i;
            break;
        }
    }

    return index;
}

export function getDataBytes(data: { [index: string]: Uint8Array }): Uint8Array {
    const dataArray: Array<Uint8Array> = [];

    for (const prop in data) {
        console.log(prop);
        dataArray.push(data[prop]);
    }

    let _length = 0;

    dataArray.forEach(val => {
       _length += val.length;
    });

    let dataBytes = new Uint8Array(_length);
    let _offset = 0;

    dataArray.forEach(val => {
        dataBytes.set(val, _offset);
        _offset += val.length;
    });

    return dataBytes;
}
