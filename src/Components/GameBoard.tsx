import React, { FunctionComponent, useState, useEffect } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { Button, Text } from 'native-base';
import ai from 'tictactoe-complex-ai';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'

import Circle from './CircleComponent';
import Cross from './CrossComponent';
import { PubNubInit } from '../Libs/LibsPubNub';
import { callAPI } from '../Libs/CallAPI';

import {
    CENTER_POINTS,
    CONDITIONS,
    AREAS,
    GAME_RESULT_NO,
    GAME_RESULT_USER,
    GAME_RESULT_AI,
    GAME_RESULT_TIE
} from '../Libs/LibsGame';
enum nodeEnum {
    "BotAIEasy" = 0,
    "BotAIHard" = 1,
    "Online" = 2,
    "Multi" = 3
}

type typeProps = {
    returnResult: any,
    Mode?: nodeEnum
    User?: any
    channel?: any
}

const GameBoard: FunctionComponent<typeProps> = ({ returnResult, Mode = "BotAIEasy", User, channel }) => {

    const game = useSelector((state: any) => state.game);
    const dispatch = useDispatch();

    const { navigate, goBack } = useNavigation();

    let aiInstance: any = null
    if (Mode !== "Online" && Mode !== "Multi") {
        aiInstance = ai.createAI({
            level: Mode === "BotAIEasy" ? "easy" : "expert",
            ai: "X",
            player: "O"
        });
    }
    let userPlayer = "user"
    if (User !== channel) {
        userPlayer = "ai"
    }

    const [AIInputs, setAIInputs] = useState([])
    const [userInputs, setUserInputs] = useState([])
    const [result, setResult] = useState(GAME_RESULT_NO)
    const [round, setRound] = useState(0)
    const [board, setBoard] = useState(['', '', '', '', '', '', '', '', ''])
    const [start, setStart] = useState(false)
    let loadstart = false

    const whoturn =(value: string)=>{
        dispatch({ type: "whoturn", payload: value })
    }

    if (Mode === "Online") {
        loadstart = true
    }
    const [load, setLoad] = useState(loadstart)


    const isWinner = (inputs: any) => {

        return CONDITIONS.some((d: any) => {
            return d.every((item: any) => {
                return inputs.indexOf(item) !== -1
            })
        })
    }

    const restart = () => {
        setUserInputs([])
        setAIInputs([])
        setResult(GAME_RESULT_NO)
        setRound(round + 1)
        setBoard(['', '', '', '', '', '', '', '', ''])
        setLoad(false)
        whoturn("Your Turn")
        returnResult(GAME_RESULT_NO)
    }

    if (game.reload) {
        dispatch({ type: "reload", payload: false })
        restart()
    }

    if (game.exit) {
        dispatch({ type: "exit", payload: false })
        if (userPlayer === "user" && Mode === "Online") {
            callAPI("killRoom", { channel: channel }).then((value: any) => {

                let pubnub = PubNubInit(User)
                pubnub.unsubscribeAll();
                goBack()
            }).catch(() => {
                //console.log("catch")
            })
        }
        else {
            goBack()
        }
    }

    const judgeWinner = async () => {
        const inputs = userInputs.concat(AIInputs)
        let userRes = isWinner(userInputs)
        let AIRes = isWinner(AIInputs)

        if (inputs.length >= 5) {
            if (userRes && result !== GAME_RESULT_USER) {
                setResult(GAME_RESULT_USER)
                returnResult(GAME_RESULT_USER)
            }
            if (AIRes && result !== GAME_RESULT_AI) {
                setResult(GAME_RESULT_AI)
                returnResult(GAME_RESULT_AI)
            }
        }

        if (inputs.length === 9 && result !== GAME_RESULT_TIE && result === GAME_RESULT_NO) {
            setResult(GAME_RESULT_TIE)
            returnResult(GAME_RESULT_TIE)
        }
        if ((Mode === "BotAIEasy" || Mode === "BotAIHard")
            &&
            (AIInputs.length - userInputs.length === 1 || userInputs.length - AIInputs.length === 1)
            &&
            !(userRes || AIRes)
            &&
            inputs.length !== 9) {
            console.log("Mode", Mode)
            let pos = await aiInstance.play(board)
            let newAIInputs: any = AIInputs
            newAIInputs.push(pos)
            setAIInputs(newAIInputs)
            console.log("Mode", AIInputs)
            let newBoard = board
            newBoard[pos] = 'X'
            setBoard(newBoard)
            setLoad(false)
            whoturn("Your Turn")
        }
        else if (Mode === "Online") {

        }
    }


    const boardClickHandler = (e: any) => {
        whoturn("Please waiting")
        const { locationX, locationY } = e.nativeEvent

        const inputs = userInputs.concat(AIInputs)

        const area: any = AREAS.find(d =>
            (locationX >= d.startX && locationX <= d.endX) &&
            (locationY >= d.startY && locationY <= d.endY))

        if (area && inputs.every((d: any) => d !== area.id)) {
            if ((userInputs.length + AIInputs.length) % 2 === 0 && Mode !== "Online") {
                setInPutUser(area)
            }
            else if (Mode === "Multi") {
                setInPutAI(area)
            }
            else if (Mode === "Online") {
                if (userPlayer === "user") {
                    setInPutUser(area)
                    onSend(area.id)
                }
                else if (userPlayer === "ai") {
                    setInPutAI(area)
                    onSend(area.id)
                }
            }
        }
    }

    const setInPutUser = (area: any) => {
        let newuserInputs: any = userInputs
        newuserInputs.push(area.id)
        setUserInputs(newuserInputs)
        let newBoard = board
        newBoard[area.id] = 'O'
        setBoard(newBoard)
    }

    const setInPutAI = (area: any) => {
        let newAIInputs: any = AIInputs
        newAIInputs.push(area.id)
        setAIInputs(newAIInputs)
        let newBoard = board
        newBoard[area.id] = 'X'
        setBoard(newBoard)
    }

    const onSend = (messagesOnSend: any = []) => {
        let pubnub = PubNubInit(User)
        pubnub.publish({
            message: {
                index: messagesOnSend,
                uuid: User
            },
            channel: channel
        });
    }

    const presenceFunc = (presence: any) => {
        if (userPlayer === "user" && presence.uuid !== User) {
            if (presence.action !== 'join') {
                callAPI("exitRoom", { channel: channel }).then((value: any) => {
                    restart()
                }).catch(() => {
                    console.log("catch")
                })
            }
            else {
                setLoad(false)
                whoturn("Your Turn")
            }
        }
        else if (presence.uuid !== User) {
            if (presence.action !== 'join') {
                callAPI("killRoom", { channel: channel }).then((value: any) => {
                    goBack()
                }).catch(() => {
                    console.log("catch")
                })
            }
        }
    }

    const messageFunc = (msg: any) => {
        if (userPlayer === "user") {
            if (msg.message.uuid !== User && msg.message.index !== "start") {
                const area = AREAS.find((d) => {
                    return d.id === msg.message.index
                })
                setInPutAI(area)
                setLoad(false)
                whoturn("Your Turn")
            }
            else if (msg.message.uuid !== User && msg.message.index === "start") {
                setLoad(false)
                whoturn("Your Turn")
            }
        }
        else if (userPlayer === "ai" && msg.message.index !== "start") {
            if (msg.message.uuid !== User) {
                const area = AREAS.find((d) => {
                    return d.id === msg.message.index
                })
                setInPutUser(area)
                setLoad(false)
                whoturn("Your Turn")
            }
        }
    }

    const pubnubFunc = () => {
        let pubnub = PubNubInit(User)
        pubnub.addListener({
            status: (statusEvent: any) => {
                if (statusEvent.category === "PNConnectedCategory") {
                    console.log("Connected to PubNub!")
                    onSend("start")
                }
            },
            message: (msg: any) => {
                messageFunc(msg)
            },
            presence: (presence) => {
                console.log("FRIEND PRESENCE: ", presence)
                presenceFunc(presence)
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
                //console.log("History Response: ", response)
            });
    }

    useEffect(() => {

        if (!start && Mode === "Online") {
            setStart(true)
            pubnubFunc()

        }
        console.log("judgeWinner")
        judgeWinner()
        if (Mode !== "Online") {
            whoturn("Your Turn")
        }

        return function cleanup() {
            let pubnub = PubNubInit(User)
            pubnub.unsubscribeAll();
        }

    }, [
        AIInputs,
        userInputs,
        result,
        round,
        load,
        board,
        start,
    ]);

    return (
        <View
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20
            }}>
            <TouchableWithoutFeedback
                onPress={e => {
                    if (!load) {
                        setLoad(true)
                        boardClickHandler(e)
                    }
                }}>
                <View
                    style={{
                        width: 312,
                        height: 312,
                        borderWidth: 3,
                        borderColor: '#000'
                    }}>
                    <View
                        style={{
                            position: 'absolute',
                            width: 3,
                            height: 306,
                            backgroundColor: '#000',
                            transform: [
                                { translateX: 100 }
                            ]
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: '#000',
                            width: 3,
                            height: 306,
                            transform: [
                                { translateX: 200 }
                            ]
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: '#000',
                            width: 306,
                            height: 3,
                            transform: [
                                { translateY: 100 }
                            ]
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: '#000',
                            width: 306,
                            height: 3,
                            transform: [
                                { translateY: 200 }
                            ]
                        }}
                    />
                    {
                        userInputs.map((d, i) => (
                            <Circle
                                key={"o" + i}
                                xTranslate={CENTER_POINTS[d].x}
                                yTranslate={CENTER_POINTS[d].y}
                                color='deepskyblue'
                            />
                        ))
                    }
                    {
                        AIInputs.map((d, i) => (
                            <Cross
                                key={"x" + i}
                                xTranslate={CENTER_POINTS[d].x}
                                yTranslate={CENTER_POINTS[d].y}
                                color='black'
                            />
                        ))
                    }
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}
export default GameBoard