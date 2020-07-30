import { getSelectedNodes, exportGlyphs } from './utils/fetch';

async function icon2font (
    fontName: string = 'Wave Icon'
) {
    const nodes = getSelectedNodes();
    const glyphs = exportGlyphs(nodes);
}
