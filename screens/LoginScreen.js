import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Button, Keyboard, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../constants/Colors';
import { auth, setAuthRedirectPath } from '../store/actions/auth';

const LoginScreen = props => {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [passwordShow, setPasswordShow] = useState(false);
    const [passwordIcon, setPasswordIcon] = useState('md-eye-off');

    let loading = useSelector(state => state.auth.loading);
    let sessionKey = useSelector(state => state.auth.sessionKey);
    let authRedirectPath = useSelector(state => state.auth.authRedirectPath);

    const dispatch = useDispatch();
    const loginHandler = () => {
        dispatch(auth(username, password));
    };

    useEffect(() => {
        if (sessionKey) {
            if (authRedirectPath === 'loved') {
                dispatch(setAuthRedirectPath('/'));
                props.navigation.navigate('LovedTracks');
            } else {
                props.navigation.navigate('CountryList');
            }
            setUsername(null);
            setPassword(null);
        }
    }, [sessionKey]);

    let submitButton = <Button title='Log In' onPress={loginHandler} />;
    if (loading) {
        submitButton = <ActivityIndicator></ActivityIndicator>;
    }
    return (
        <ScrollView keyboardShouldPersistTaps={'handled'}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.logoText}>last.fm</Text>
                    <Text style={styles.headerText}>Music Service</Text>
                </View>
                <View style={styles.form}>
                    <TextInput
                        style={styles.textInput}
                        value={username}
                        onChangeText={text => setUsername(text)}
                        placeholder={'Username'}
                        autoCapitalize='none'
                    />
                    <View style={styles.passwordInput}>
                        <TextInput
                            style={styles.textInput}
                            value={password}
                            onChangeText={text => setPassword(text)}
                            placeholder={'Password'}
                            secureTextEntry={!passwordShow}
                            selectionColor={Colors.primaryColor}
                            autoCapitalize='none'
                        />
                        <Ionicons name={passwordIcon} size={25} style={styles.showPasswordIcon}
                            onPress={() => {
                                passwordIcon === 'md-eye' ? setPasswordIcon('md-eye-off') : setPasswordIcon('md-eye');
                                setPasswordShow(!passwordShow);
                            }}></Ionicons>
                    </View>
                    {submitButton}
                </View>
            </View>
        </ScrollView>
    );
}

LoginScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Login',
        headerLeft: <Ionicons style={styles.headerLeft} name="md-menu" size={25} color={Colors.accentColor}
            onPress={() => {
                Keyboard.dismiss();
                navData.navigation.toggleDrawer();
            }}></Ionicons>
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.accentColor,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10
    },
    header: {
        paddingVertical: 15
    },
    logoText: {
        color: Colors.accentColor,
        backgroundColor: Colors.primaryColor,
        padding: 15,
        marginBottom: 20,
        fontSize: 34,
        textAlign: 'center',
        borderRadius: 10,
        shadowColor: 'black',
        shadowOpacity: 0.35,
        shadowOffset: { width: 3, height: 4 },
        shadowRadius: 10,
        elevation: 6
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    form: {
        width: "80%"
    },
    textInput: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderBottomWidth: 1,
        marginBottom: 20
    },
    passwordInput: {
        flexDirection: 'row'
    },
    showPasswordIcon: {
        position: 'absolute',
        top: 10,
        right: 0
    },
    headerLeft: {
        paddingLeft: 10
    }
});

export default LoginScreen;