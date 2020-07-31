var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function getSelectedNodes() {
    const nodes = figma.currentPage.selection;
    if (nodes.length === 0) {
        figma.notify('⚠️ ERR: There is no selection to export');
        return [];
    }
    return nodes;
}
export function exportGlyphs(nodes) {
    return __awaiter(this, void 0, void 0, function* () {
        const glyphs = [];
        const options = { format: 'SVG' };
        for (let node of nodes) {
            const raw = yield node.exportAsync(options);
            const glyph = String.fromCharCode.apply(null, raw);
            glyphs.push(glyph);
        }
        return new Promise(resolve => {
            resolve(glyphs);
        });
    });
}
export function hasDuplicatedNames(nodes) {
    const names = nodes.map(node => node.name.replace(/(\s*\/\s*)/g, '_'));
    const nameSet = new Set(names);
    return (names.length !== nameSet.size);
}
