import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import HomeScreen from '../Screens/HomeScreen'
import GameScreen from '../Screens/GameScreen'
import OnlineListScreen from '../Screens/OnlineListScreen'
import TestScreen from '../Screens/TestScreen'

const HomeStack = createStackNavigator(
    {
        HomeScreen: {
            screen: HomeScreen
        },
        GameScreen: {
            screen: GameScreen
        },
        OnlineListScreen:{
            screen: OnlineListScreen
        },
        TestScreen: {
            screen: TestScreen
        },
    },
    {
        initialRouteName: "HomeScreen",
        mode: "modal",

    }
)

export default createAppContainer(HomeStack)