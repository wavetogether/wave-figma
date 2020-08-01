import SVGIcons2SVGFontStream from 'svgicons2svgfont';
import svg2ttf from 'svg2ttf';
import { Readable } from 'stream';
import { TGlyphData, TIconFontOptions } from './types';

export async function getIconFontData (
    glyphData: TGlyphData,
    options: TIconFontOptions
) {
    let result = '';

    return new Promise((resolve, reject) => {
       const fontStream = new SVGIcons2SVGFontStream(options)
           .on('finish', () => resolve(result))
           .on('data', (data) => { result += data })
           .on('error', (err) => reject(err));

       glyphData.forEach((glyphDatum, i) => {
           const glyphStream = new Readable();

           glyphStream.push(glyphDatum.content);
           glyphStream.push(null);

           //@ts-ignore
           glyphStream.metadata = glyphDatum.metadata;

           fontStream.write(glyphStream);

           if (i === glyphData.length - 1) {
               fontStream.emit('end');
           }
       });

       fontStream.end();
    });
}

export function getFontBuffer (fontData): Buffer {
    return svg2ttf(fontData, {});
}