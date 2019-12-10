import React, { FunctionComponent, useState, useEffect } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Button, Text } from 'native-base';

import Circle from './CircleComponent';
import Cross from './CrossComponent';

import {
    CENTER_POINTS,
    CONDITIONS,
    AREAS,
    GAME_RESULT_NO,
    GAME_RESULT_USER,
    GAME_RESULT_AI,
    GAME_RESULT_TIE
} from '../Libs/LibsGame';

type typeProps = {
    returnResult: any
}

const GameBoard: FunctionComponent<typeProps> = ({ returnResult }) => {
    // since we pass a number here, clicks is going to be a number.
    // setClicks is a function that accepts either a number or a function returning
    // a number

    const [AIInputs, setAIInputs] = useState([])
    const [userInputs, setUserInputs] = useState([])
    const [result, setResult] = useState(GAME_RESULT_NO)
    const [round, setRound] = useState(0)

    const isWinner = (inputs: any) => {

        return CONDITIONS.some((d: any) => {
            return d.every((item: any) => {
                return inputs.indexOf(item) !== -1
            })
        })
    }

    const restart =()=> {
        setUserInputs([])
        setAIInputs([])
        setResult(GAME_RESULT_NO)
        setRound(round + 1)
      }

    const judgeWinner = () => {
        const inputs = userInputs.concat(AIInputs)
        console.log(inputs)
        if (inputs.length >= 5) {
            console.log(userInputs)
            let res = isWinner(userInputs)
            //console.log(res)
            if (res && result !== GAME_RESULT_USER) {
                setResult(GAME_RESULT_USER)
                returnResult(GAME_RESULT_USER)
            }
            res = isWinner(AIInputs)
            if (res && result !== GAME_RESULT_AI) {
                setResult(GAME_RESULT_AI)
                returnResult(GAME_RESULT_AI)
            }
        }

        if (inputs.length === 9 && result !== GAME_RESULT_TIE && result === GAME_RESULT_NO) {
            setResult(GAME_RESULT_TIE)
            returnResult(GAME_RESULT_TIE)
        }
    }


    const boardClickHandler = (e: any) => {
        const { locationX, locationY } = e.nativeEvent
        if (result !== -1) {
            return
        }
        const inputs = userInputs.concat(AIInputs)

        const area: any = AREAS.find(d =>
            (locationX >= d.startX && locationX <= d.endX) &&
            (locationY >= d.startY && locationY <= d.endY))

        if (area && inputs.every((d: any) => d !== area.id)) {
            console.log("id", area.id)
            if ((userInputs.length + AIInputs.length) % 2 === 0) {
                setUserInputs(userInputs.concat(area.id))
            }
            else {
                setAIInputs(AIInputs.concat(area.id))
            }
            // setTimeout(() => {
            //     judgeWinner()
            //     // this.AIAction()
            // }, 5)
        }
    }

    useEffect(() => {
        judgeWinner()
    }, [
        AIInputs,
        userInputs,
        result,
        round
    ]);

    return (
        <View
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20
            }}>
            <TouchableWithoutFeedback onPress={e => boardClickHandler(e)}>
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
                                key={i}
                                xTranslate={CENTER_POINTS[d].x}
                                yTranslate={CENTER_POINTS[d].y}
                                color='deepskyblue'
                            />
                        ))
                    }
                    {
                        AIInputs.map((d, i) => (
                            <Cross
                                key={i}
                                xTranslate={CENTER_POINTS[d].x}
                                yTranslate={CENTER_POINTS[d].y}
                                color='black'
                            />
                        ))
                    }
                    <Text>{result}</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}
export default GameBoard