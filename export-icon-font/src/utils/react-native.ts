import _ from 'lodash';

export function getRNIconName (nodes: ReadonlyArray<SceneNode>): string {
    let names = nodes.map((node) => _.trim(_.last(node.name.split('/'))));
    let enums = '';

    names = _.uniq(names).sort();

    names.forEach((name) => {
        let iconName = _.replace(
            _.toUpper(name),
            /-/g,
            '_'
        );

        enums += `  ${iconName} = '${name}',\n`;
    });

    let code = ''
        + 'export enum IconName {\n' + enums
        + '}';

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
