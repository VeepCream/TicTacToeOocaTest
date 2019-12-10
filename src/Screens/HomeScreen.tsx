import React, { FunctionComponent, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';

import GameBoard from '../Components/GameBoard';

const HomeScreen: FunctionComponent = () => {

  const [result, setResult] = useState(-1)

  return (
    <View>

      <GameBoard
        returnResult={(number: any) => {
          setResult(number)
        }} />
      <Button>
        <Text>
          {result}
        </Text>
      </Button>
    </View>
  )
}
export default HomeScreen