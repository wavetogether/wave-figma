var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import SVGIcons2SVGFontStream from 'svgicons2svgfont';
import svg2ttf from 'svg2ttf';
import { Readable } from 'stream';
export function getIconFontData(glyphData, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = '';
        return new Promise((resolve, reject) => {
            const fontStream = new SVGIcons2SVGFontStream(options);
            fontStream
                .on('finish', () => resolve(result))
                .on('data', (data) => { result += data; })
                .on('error', (err) => reject(err));
            glyphData.forEach((glyphDatum) => {
                const glyphStream = new Readable();
                glyphStream.push(glyphDatum.content);
                glyphStream.push(null);
                //@ts-ignore
                glyphStream.metadata = glyphDatum.metadata;
                fontStream.write(glyphStream);
            });
            fontStream.end();
        });
    });
}
export function getFontBuffer(fontData) {
    return svg2ttf(fontData, {});
}
