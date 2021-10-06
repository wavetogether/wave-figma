import { TGlyphData } from './types';
import _ from 'lodash';

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

export function getFlutterIconName (nodes: ReadonlyArray<SceneNode>): string {
  let names = nodes.map((node) => node.name).sort();
  let enums = '';

  names.forEach((name) => {
    let iconName = _.replace(
        _.toUpper(_.trim(_.last(name.split('/')))),
        /-/g,
        '_'
    );

    enums += `  ${iconName},\n`;
  });

  let code = ''
    + 'enum IconName {\n' + enums
    + '}\n\n'
    + 'extension IconNameExtension on IconName {\n'
    + '  String get str {\n'
    + "    return describeEnum(this).toLowerCase().replaceAll(\'_\', \'-\');\n"
    + '  }\n'
    + '}';

  return code;
}
