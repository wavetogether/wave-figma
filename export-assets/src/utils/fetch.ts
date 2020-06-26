import {alert, errorMessage} from './error';

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
