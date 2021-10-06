import { TGlyphData } from './types';

export function getFlutterIconMap (glyphData: TGlyphData): string {
  let maps = '';

  glyphData.forEach(({ metadata: { name, unicode}}, index) => {
    maps += `    '${name}': '${unicode.join('')}',\n`;
  });

  let code = ''
    + 'class IconMap {\n'
    + '  static const Map<String, String> _data = {\n' + maps
    + '  };\n\n'
    + '  static String get(String key) {\n'
    + "    return _data[key]!;\n"
    + '  }\n'
    + '}';

  return code;
}

export function getFlutterIconName (glyphData: TGlyphData): string {
  let names = glyphData.map(({ metadata: { name }}) => name);

  return '';
}