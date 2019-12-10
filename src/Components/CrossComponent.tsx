import React, { FunctionComponent, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';

import GameBoard from './GameBoard';
import { type } from 'os';

type typeProps = {
    xTranslate: number,
    yTranslate: number,
    color: any

}
// our components props accept a number for the initial value
const CrossComponent: FunctionComponent<typeProps> = ({ xTranslate, yTranslate, color }) => {

    return (
        <View style={{
            position: 'absolute',
            width: 80,
            height: 80,
            transform: [
                { translateX: (xTranslate ? xTranslate : 10) + 35 },
                { translateY: (yTranslate ? yTranslate : 10) - 12 },
            ]
        }}>
            <View
                style={{
                    position: 'absolute',
                    width: 8,
                    height: 105,
                    transform: [
                        { rotate: '45deg' },
                    ],
                    backgroundColor: color ? color : '#000'
                }} />
            <View
                style={{
                    position: 'absolute',
                    width: 8,
                    height: 105,
                    transform: [
                        { rotate: '135deg' },
                    ],
                    backgroundColor: color ? color : '#000'
                }} />
        </View>
    )
}
export default CrossComponent