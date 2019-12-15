import React, { FunctionComponent, useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';
import ai from 'tictactoe-complex-ai';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'
import { GiftedChat } from 'react-native-gifted-chat'
import PubNub from 'pubnub';

import { callAPI } from '../Libs/CallAPI';


import GameBoard from '../Components/GameBoard';

const GameScreen: FunctionComponent = () => {

  const [result, setResult] = useState(-1)
  const [messages, setMessages] = useState([])
  const Mode = useNavigationParam('Mode')
  let defaultChannel = "Global";
  const [channel, setChannel] = useState(defaultChannel);
  const [username,] = useState(['user', new Date().getTime()].join('-'));

  const onSend = (messagesOnSend: any = []) => {
    setMessages(GiftedChat.append(messages, messagesOnSend))
    const pubnub = new PubNub({
      publishKey: "pub-c-868ad9fb-4cec-41ba-a91e-260acc82c21b",
      subscribeKey: "sub-c-883a28a0-1e15-11ea-8c76-2e065dbe5941",
      uuid: username
    });
    pubnub.publish({
      message: {
        text: messagesOnSend.text,
        uuid: username
      },
      channel: channel
    });
  }
  useEffect(() => {
    //console.warn("username", username)

    callAPI("login").then((value: any) => {
      //console.warn("login", value.token)
    }).catch(() => {
      //console.log("catch")
    })

    const pubnub = new PubNub({
      publishKey: "pub-c-868ad9fb-4cec-41ba-a91e-260acc82c21b",
      subscribeKey: "sub-c-883a28a0-1e15-11ea-8c76-2e065dbe5941",
      uuid: username
    });
    pubnub.addListener({
      status: function (statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
          console.log("Connected to PubNub!")
        }
      },
      message: function (msg) {
        console.log("Messaged Received: ", msg)
      },
      presence: function (presence) {
        console.log("FRIEND PRESENCE: ", presence)
      },
    });
    pubnub.subscribe({
      channels: [channel],
      withPresence: true
    });
    pubnub.history(
      {
        channel: channel,
        count: 10, // 100 is the default
      }, function (status, response) {
        console.log("History Response: ", response)
      });
    return function cleanup() {
      pubnub.unsubscribeAll();
    }
  }, [channel, username]);


  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  )
}
export default GameScreen