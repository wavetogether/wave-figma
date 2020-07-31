export function getSelectedNodes (): ReadonlyArray<SceneNode> {
    const nodes = figma.currentPage.selection;

    if (nodes.length === 0) {
        figma.notify('⚠️ ERR: There is no selection to export');
        return [];
    }

    return nodes;
}

export async function exportGlyphs (
    nodes: ReadonlyArray<SceneNode>
): Promise<string[]> {
    const glyphs: Array<string> = [];
    const options: ExportSettingsSVG = { format: 'SVG' };

    for (let node of nodes) {
        const raw = await node.exportAsync(options);
        const glyph = String.fromCharCode.apply(null, raw);

        glyphs.push(glyph);
    }

    return new Promise(resolve => {
        resolve(glyphs);
    });
}

// check duplicate names