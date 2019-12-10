import React, { FunctionComponent, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';

import GameBoard from '../Components/GameBoard';
import { type } from 'os';

type typeProps = {
    xTranslate: number,
    yTranslate: number,
    color: any
}
// our components props accept a number for the initial value
const CircleComponent: FunctionComponent<typeProps> = ({ xTranslate, yTranslate, color }) => {

    return (
        <View
            style={{
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: 40,
                transform: [
                    { translateX: xTranslate ? xTranslate : 10 },
                    { translateY: yTranslate ? yTranslate : 10 },
                ],
                backgroundColor: color ? color : '#000'
            }}>
            <View
                style={{
                    backgroundColor: '#F5FCFF',
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                }}>
            </View>
        </View>
    )
}
export default CircleComponent