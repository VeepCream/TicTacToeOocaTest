import React, { FunctionComponent, useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Button, Text } from 'native-base';
import ai from 'tictactoe-complex-ai';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'
import AsyncStorage from '@react-native-community/async-storage';

import RowListRoom from '../Components/RowListRoom';
import { callAPI } from '../Libs/CallAPI';

const OnlineListScreen: FunctionComponent = () => {

  const [result, setResult] = useState(-1)
  const [data, setdata] = useState([])
  const { navigate } = useNavigation();
  let aiInstance = ai.createAI({ level: 'easy' });

  useEffect(() => {
    reload()
  }, [])

  const reload = () => {
    callAPI("listRoom").then((value: any) => {
      setdata(value.data)
    }).catch(() => {
      //console.log("catch")
    })
  }

  const createRoom = () => {
    callAPI("createRoom").then((value: any) => {
      AsyncStorage.getItem("@user:userId").then((userId: any) => {
        navigate('GameScreen', { Mode: "Online", User: userId, channel: userId  });
      })
    }).catch(() => {
      //console.log("catch")
    })
  }

  const renderRow = ({ item, index }: any) => {
    return <RowListRoom data={item} reload={() => { reload() }} />
  }


  return (
    <View>
      <Button
        onPress={() => {
          createRoom()
        }}>
        <Text>
          {"create room"}
        </Text>
      </Button>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderRow}
        keyExtractor={(data:any)=>{ return data._id + "game"}}
      />
    </View>
  )
}
export default OnlineListScreen