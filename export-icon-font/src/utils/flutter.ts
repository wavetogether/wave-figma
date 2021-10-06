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
  let names = nodes.map((node) => _.trim(_.last(node.name.split('/'))));
  let enums = '';

  names = _.uniq(names).sort();

  names.forEach((name) => {
    let iconName = _.replace(
        _.toUpper(name),
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

export function getFlutterIconWidget (fontName: string): string {
  let code = ''
    + "import 'package:flutter/widgets.dart';\n\n"
    + 'class IconExample extends StatelessWidget {\n'
    + '  IconExample({ Key? key, required this.name }) : super(key: key);\n\n'
    + '  final IconName name;\n\n'
    + '  @override\n'
    + '  Widget build(BuildContext context) {\n'
    + '    return Text(\n'
    + '      Characters(IconMap.get(name.str)).toString(),\n'
    + `      style: TextStyle(fontSize: 24, fontFamily: '${fontName}', height: 1, fontWeight: FontWeight.normal},\n`
    + '    );\n'
    + '  }\n'
    + '}';

  return code;
}

export function getFlutterExample (widget: string, map: string, name: string): string {
  return `${widget}\n\n${name}\n\n${map}`;
}
