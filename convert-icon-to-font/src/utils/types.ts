export type TGlyphData = Array<{content: string, metadata: { name: string, unicode: string }}>;
export type TFontConfig = { name: string, icons: { [index: string]: string }}
export type TChunkable = Array<any> | string;
export type TIconFontOptions = { fontName: string, fontHeight: number, normalize: boolean };