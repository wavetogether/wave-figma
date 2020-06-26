import SVGIcons2SVGFontStream from 'svgicons2svgfont';
import svg2ttf from 'svg2ttf';
import {Readable} from 'stream';

export async function generateIconFont(glyphs, options) {
    let result = '';

    return new Promise((resolve, reject) => {
        const fontStream = new SVGIcons2SVGFontStream(options)
            .on('finish', () => resolve(result))
            .on('data', (data) => {
                result += data;
            })
            .on('error', (err) => reject(err));

        glyphs.forEach((glyph) => {
            const glyphStream = new Readable();

            glyphStream.push(glyph.content);
            glyphStream.push(null);

            glyphStream.metadata = glyph.metadata;

            fontStream.write(glyphStream);
        });

        fontStream.end();
    });
}

export function generateFontBuffer(fontData) {
    return svg2ttf(fontData, {});
}
