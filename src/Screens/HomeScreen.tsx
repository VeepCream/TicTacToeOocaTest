import React, { FunctionComponent, useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'
import AsyncStorage from '@react-native-community/async-storage';

import { callAPI } from '../Libs/CallAPI';

const HomeScreen: FunctionComponent = () => {

  const { navigate } = useNavigation();
  const onPress = (Mode: String) => {
    navigate('GameScreen', { Mode: Mode });
  }

  useEffect(() => {
    AsyncStorage.getItem("@user:key").then((value: any) => {
      if (value) {
        callAPI("loginToken").then((value: any) => {
          //console.warn("login", value.token)
          AsyncStorage.setItem("@user:key", value.token)
          AsyncStorage.setItem("@user:userId", value.userId)
        }).catch(() => {
          //console.log("catch")
        })
      }
      else {
        callAPI("login").then((value: any) => {
          //console.warn("login", value.token)
          AsyncStorage.setItem("@user:key", value.token)
          AsyncStorage.setItem("@user:userId", value.userId)
        }).catch(() => {
          //console.log("catch")
        })
      }

    }).catch(() => {
      callAPI("login").then((value: any) => {
        //console.warn("login", value.token)
        AsyncStorage.setItem("@user:key", value.token)
        AsyncStorage.setItem("@user:userId", value.userId)
      }).catch(() => {
        //console.log("catch")
      })
    })
  }, [])

  return (
    <View>
      <Button
        onPress={() => onPress("BotAIEasy")}>
        <Text>
          {"Easy Bot"}
        </Text>
      </Button>
      <Button
        onPress={() => onPress("BotAIHard")}>
        <Text>
          {"Hard Bot"}
        </Text>
      </Button>
      <Button
        onPress={() => navigate('OnlineListScreen')}>
        <Text>
          {"Online"}
        </Text>
      </Button>
    </View>
  )
}
export default HomeScreen