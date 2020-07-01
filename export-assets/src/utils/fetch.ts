import {alert, errorMessage} from './error';

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
