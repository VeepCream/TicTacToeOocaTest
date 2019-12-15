import React, { FunctionComponent, useState } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { Button } from 'native-base';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'
import AsyncStorage from '@react-native-community/async-storage';

import { callAPI } from '../Libs/CallAPI'

const { height, width } = Dimensions.get('window');

type typeProps = {
    data: any,
    reload: any
}
// our components props accept a number for the initial value
const RowListRoom: FunctionComponent<typeProps> = ({ data, reload }) => {

    const { navigate, goBack } = useNavigation();
    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: width,
            height: 80,

        }}>
            <Text>{data.owner}</Text>
            <Text>{data.status}</Text>
            <Button
                onPress={() => {
                    AsyncStorage.getItem("@user:userId").then((userId: any) => {
                        callAPI("joinRoom", { channel: data.owner }).then((value: any) => {
                            navigate('GameScreen', { Mode: "Online", User: userId, channel: data.owner });
                        }).catch(() => {
                            //console.log("catch")
                        })
                    })
                }}>
                <Text>{"join"}</Text>
            </Button>
        </View>
    )
}
export default RowListRoom