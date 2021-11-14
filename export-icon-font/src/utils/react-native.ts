import _ from 'lodash';

export function getRNIconName (nodes: ReadonlyArray<SceneNode>): string {
    let names = nodes.map((node) => _.trim(_.last(node.name.split('/'))));
    let enums = '';
    let types = '';

    names = _.uniq(names).sort();

    names.forEach((name, i) => {
        let iconName = _.replace(
            _.toUpper(name),
            /-/g,
            '_'
        );

        enums += `  ${iconName} = '${name}',\n`;
        types += `  '${name}'${i < names.length - 1 ? ' |' : ';'}\n`;
    });

    let code = ''
        + 'export const enum IconName {\n' + enums
        + '}\n\n'
        + 'export type TIconName = \n' + types;

    return code;
}

export function getRNIconComponent (fontName: string): string {
    let codeLines = [
        "import React from 'react';",
        "import { View, Text } from 'react-native';",
        `import IconConfig from '../${fontName}Config.json'; // with json-loader`,
        '',
        "export const Icon = ({ name }) => {",
        '  return (',
        '    <View style={{ width: 24, height: 24 }}>',
        `      <Text style={{ color: '#FFF', fontSize: 24, lineHeight: 24, fontFamily: '${fontName}', fontWeight: 'normal', fontStyle: 'normal' }}>`,
        "        {unescape(String(IconConfig['icons'][name]))}",
        '      </Text>',
        '    </View>',
        '  );',
        '};',
    ];

    return codeLines.join('\n');
}

export function getRNExample(component: string, name: string): string {
    return `${component}\n\n${name}`;
}
