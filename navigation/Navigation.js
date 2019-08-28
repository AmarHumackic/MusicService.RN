import React, { useState } from 'react';
import { Text, AsyncStorage, SafeAreaView, View, Image, Platform } from 'react-native';
import {
    createStackNavigator, createBottomTabNavigator, createAppContainer, createDrawerNavigator, DrawerItems
} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { AppLoading } from 'expo';

import CountryListScreen from '../screens/CountryListScreen';
import TopTracksScreen from '../screens/TopTracksScreen';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import LovedTracksScreen from '../screens/LovedTracksScreen';
import LogoutScreen from '../screens/LogoutScreen';
import Colors from '../constants/Colors';
import { authSuccess } from '../store/actions/auth';
import { fetchLoved } from '../store/actions/tracks';
import { fetchCountries } from '../store/actions/countryList';
import Logo from '../assets/logo.png';

const Navigation = props => {

    const [sessionChecked, setSessionChecked] = useState(false);

    const dispatch = useDispatch();

    const checkSession = () => {
        AsyncStorage.getItem('username').then(username => {
            console.log(username);
            if (username) {
                AsyncStorage.getItem('sessionKey').then(sessionKey => {
                    console.log(sessionKey);
                    if (sessionKey) {
                        AsyncStorage.getItem('api_sig').then(api_sig => {
                            console.log(api_sig);
                            if (api_sig) {
                                dispatch(authSuccess(username, sessionKey, api_sig));
                                dispatch(fetchLoved(username));
                                console.log('session checked true');
                            }
                        });
                    }
                });
            }
        })
    };

    let username = useSelector(state => state.auth.username);

    if (!sessionChecked) {
        return (
            <AppLoading
                startAsync={checkSession}
                onFinish={() => setSessionChecked(true)}
            />
        );
    }
    return (
        <AppContainer screenProps={{ username: username }}></AppContainer>
    );
}

const defaultStackNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primaryColor : ''
    },
    headerTintColor: Platform.OS === 'android' ? Colors.accentColor : Colors.primaryColor
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
            activeTintColor: Platform.OS === 'android' ? Colors.accentColor : Colors.primaryColor,
            inactiveTintColor: Colors.secondaryColor,
            style: {
                backgroundColor: Platform.OS === 'android' ? Colors.primaryColor : ''
            },
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
                drawerLabel: 'Music Service',
                drawerIcon: () => (
                    <Ionicons name={Platform.OS === 'android' ? "md-musical-notes" : "ios-musical-notes"} size={25}></Ionicons>
                )
            }
        },
        Login: {
            screen: LoginNavigator,
            navigationOptions: {
                drawerLabel: 'Login',
                drawerIcon: () => (
                    <Ionicons name={Platform.OS === 'android' ? "md-log-in" : "ios-log-in"} size={25}></Ionicons>
                )
            }
        },
        Logout: {
            screen: LogoutScreen,
            params: { temp: 1 },
            navigationOptions: {
                drawerLabel: 'Logout',
                drawerIcon: () => (
                    <Ionicons name={Platform.OS === 'android' ? "md-log-out" : "ios-log-out"} size={25}></Ionicons>
                )
            }
        }
    },
    {
        contentComponent: (props) => {
            var copyprops = Object.assign({}, props);
            if (props.screenProps.username) {
                copyprops.items = copyprops.items.filter(item => item.key !== 'Login')
            } else {
                copyprops.items = copyprops.items.filter(item => item.key !== 'Logout')
            }

            return (
                <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Image style={{ width: '100%', height: 150 }} source={Logo} />
                        </View>
                        {props.screenProps.username ?
                            <Text style={{
                                position: 'absolute', bottom: 5,
                                color: Colors.accentColor, paddingLeft: 15, fontWeight: 'bold', fontStyle: 'italic'
                            }}>
                                Logged in as {props.screenProps.username}
                            </Text> : null
                        }
                    </View>
                    <DrawerItems {...copyprops}
                        activeTintColor={Colors.primaryColor} activeBackgroundColor={Colors.primaryColorLight}
                        inactiveTintColor={Colors.primaryColor} inactiveBackgroundColor='white'
                        labelStyle={{ color: Colors.primaryColor, fontSize: 16 }} />
                </SafeAreaView>
            );
        }
    }
);

const AppContainer = createAppContainer(MainNavigator);

export default Navigation;