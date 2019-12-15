import React, { FunctionComponent, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';
import ai from 'tictactoe-complex-ai';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'
import { useSelector, useDispatch } from "react-redux";

import GameBoard from '../Components/GameBoard';

const GameScreen: any = () => {

  const [result, setResult] = useState(-1)
  const [whoturn, setWhoturn] = useState("Please waiting")
  const Mode = useNavigationParam('Mode')
  const User = useNavigationParam('User')
  const channel = useNavigationParam('channel')
  const game = useSelector((state: any) => state.game);
  const dispatch = useDispatch();
console.log(game)
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center"
      }}>

      <Text>
        {Mode}
      </Text>
      <Text>
        {game.whoturn}
      </Text>

      <GameBoard
        returnResult={(number: any) => {
          setResult(number)
        }}
        Mode={Mode}
        User={User}
        channel={channel} />
      {result !== -1 ?
        <Button
          onPress={() => {
            dispatch({ type: "reload", payload: true })
          }}>
          <Text>
            {"Reload"}
          </Text>
        </Button>
        : null}
        <Button
          onPress={() => {
            dispatch({ type: "exit", payload: true })
          }}>
          <Text>
            {"exit"}
          </Text>
        </Button>

    </View>
  )
}
GameScreen.navigationOptions = ({ navigation }: any) => ({
  title: "Game room",
  headerLeft: null
});
export default GameScreen