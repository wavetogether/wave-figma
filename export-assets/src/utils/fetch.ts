import {log} from './notify';

export function getExportables(): Array<SceneNode> {
    const selections: ReadonlyArray<SceneNode> = figma.currentPage.selection;
    const exportables: Array<SceneNode> = [];

    if (!!selections) {
        selections.forEach((node) => {
            if (node.exportSettings.length > 0) {
                exportables.push(node);
            }
        });
    }

    return exportables;
}

export function getSelections(): boolean | ReadonlyArray<SceneNode> {
    const selections = figma.currentPage.selection;

    if (selections.length === 0) {
        return false;
    }

    return selections;
}

export async function exportGlyphs(layers) {
    const glyphs: Array<any> = [];
    const exportOptions: ExportSettingsSVG = {format: 'SVG'};

    for (let layer of layers) {
        const byteData = new Uint8Array(await layer.exportAsync(exportOptions));
        const glyph = String.fromCharCode.apply(null, byteData);

        glyphs.push(glyph);
    }

    return new Promise(resolve => {
        resolve(glyphs);
    });
}

export async function exportAsync(nodes: Array<SceneNode>) {
    const buffers = [];

    for (let node of nodes) {
        for (let option of node.exportSettings) {
            buffers.push({
                name: `${node.name}${option.suffix}.${option.format.toLowerCase()}`,
                byte: await node.exportAsync(option)
            });
        }
    }

    return new Promise(resolve => {
        resolve(buffers);
    });
}

export async function appendProfiles(buffers) {
    log('appendProfiles');

    const images = [];

    const getChunkLength = (lengthArr: Array<number>) => {
        let length = 0;

        lengthArr.forEach((l, i) => {
            length += l * Math.pow(16, (lengthArr.length - i - 1) * 2);
        });

        return length;
    };

    for (let buffer of buffers) {
        log('START: chunkAnalysis');
        console.log(buffer.byte);

        let processedBuffer: Array<number> = Array.from(buffer.byte);

        while(processedBuffer.length > 0) {
            let chunkLength: number, chunkType: Array<number> | string, chunkData: Array<number>, CRC: Array<number>;

            if (processedBuffer.length === buffer.byte.length) {
                chunkLength = 0;
                chunkType = 'PNG SIGNATURE';
                chunkData = processedBuffer.splice(0, 8);
                CRC = [];
            } else {
                chunkLength = getChunkLength(processedBuffer.splice(0, 4));
                chunkType = processedBuffer.splice(0, 4);
                chunkData = processedBuffer.splice(0, chunkLength);
                CRC = processedBuffer.splice(0, 4);
            }

            console.log('CHUNK LENGTH:', chunkLength);
            console.log('CHUNK TYPE:', chunkType);
            console.log('CHUNK DATA:', chunkData);
            console.log('----');
        }

        log('END: chunkAnalysis');
    }
}