import React from 'react';
import { Text } from 'react-native';
import {
    createStackNavigator, createBottomTabNavigator, createAppContainer, createDrawerNavigator
} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import CountryListScreen from '../screens/CountryListScreen';
import TopTracksScreen from '../screens/TopTracksScreen';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import LovedTracksScreen from '../screens/LovedTracksScreen';
import Colors from '../constants/Colors';

const defaultStackNavOptions = {
    headerStyle: {
        backgroundColor: Colors.primaryColor
    },
    headerTintColor: Colors.accentColor,
    headerTitle: 'A Screen'
};

const CountryTracksNavigator = createStackNavigator(
    {
        CountryList: { screen: CountryListScreen },
        TopTracks: { screen: TopTracksScreen },
        Details: { screen: DetailsScreen }
    },
    {
        defaultNavigationOptions: defaultStackNavOptions
    }
);

const LovedTracksNavigator = createStackNavigator(
    {
        LovedTracks: { screen: LovedTracksScreen },
        Details: { screen: DetailsScreen }
    },
    {
        defaultNavigationOptions: defaultStackNavOptions
    }
);

const CountryLovedTabNavigator = createBottomTabNavigator(
    {
        CountryTracks: {
            screen: CountryTracksNavigator,
            navigationOptions: {
                tabBarIcon: tabInfo => {
                    return (
                        <Ionicons name="md-musical-notes" size={25} color={tabInfo.tintColor} />
                    );
                },
                tabBarLabel: 'All'
            }
        },
        LovedTracks: {
            screen: LovedTracksNavigator,
            navigationOptions: {
                tabBarIcon: tabInfo => {
                    return (
                        <Ionicons name="md-heart" size={25} color={tabInfo.tintColor} />
                    );
                },
                tabBarLabel: 'Loved'
            }
        }
    },
    {
        tabBarOptions: {
            activeTintColor: Colors.accentColor,
            inactiveTintColor: Colors.secondaryColor,
            style: {
                backgroundColor: Colors.primaryColor
            }
        }
    }
);

const LoginNavigator = createStackNavigator(
    {
        Login: LoginScreen
    },
    {
        defaultNavigationOptions: defaultStackNavOptions
    }
);

const MainNavigator = createDrawerNavigator(
    {
        CountryLoved: {
            screen: CountryLovedTabNavigator,
            navigationOptions: {
                drawerLabel: 'Music Service'
            }
        },
        Login: {
            screen: LoginNavigator,
            navigationOptions: {
                drawerLabel: 'Log In'
            }
        }
    },
    {
        contentOptions: {
            activeTintColor: Colors.primaryColor,
        }
    }
);

export default createAppContainer(MainNavigator);