import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, TextInput, Keyboard, ToastAndroid, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../constants/Colors';
import { auth, setAuthRedirectPath } from '../store/actions/auth';
import ButtonWithBackground from '../components/UI/ButtonWithBackground';

const LoginScreen = props => {
    const [username, setUsername] = useState(null);
    const [usernameTouched, setUsernameTouched] = useState(false);
    const [usernameValid, setUsernameValid] = useState(false);

    const [password, setPassword] = useState(null);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordShow, setPasswordShow] = useState(false);
    const [passwordIcon, setPasswordIcon] = useState('md-eye-off');
    const [passwordRef, setPasswordRef] = useState(null);

    let loading = useSelector(state => state.auth.loading);
    let sessionKey = useSelector(state => state.auth.sessionKey);
    let usernameLogged = useSelector(state => state.auth.username);
    let authRedirectPath = useSelector(state => state.auth.authRedirectPath);

    const dispatch = useDispatch();
    const loginHandler = () => {
        dispatch(auth(username, password));
    };

    useEffect(() => {
        if (sessionKey) {
            Keyboard.dismiss();
            if (authRedirectPath === 'loved') {
                dispatch(setAuthRedirectPath('/'));
                props.navigation.navigate('LovedTracks');
            } else if (authRedirectPath === 'top') {
                dispatch(setAuthRedirectPath('/'));
                props.navigation.navigate('CountryTracks');
            } else {
                props.navigation.navigate('CountryList');
            }
            ToastAndroid.show('Logged in as ' + usernameLogged, ToastAndroid.SHORT);
            setUsername(null);
            setPassword(null);
        }
    }, [sessionKey]);

    let submitButton = (
        <ButtonWithBackground color={Colors.primaryColor} tintColor={Colors.accentColor} onPress={loginHandler} disabled={!usernameValid || !passwordValid}>
            Let me in!
        </ButtonWithBackground>
    );

    if (loading) {
        submitButton = <ActivityIndicator color={Colors.primaryColor}></ActivityIndicator>;
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={50}>
                <View style={styles.shadowContainer}>
                    <ScrollView keyboardShouldPersistTaps={'always'}>
                        <Text style={styles.logoText}>last.fm</Text>
                        <Text style={styles.headerText}>Music Service</Text>
                        <TextInput
                            style={[styles.textInput, !usernameValid && usernameTouched ? styles.invalid : null]}
                            value={username}
                            onChangeText={text => {
                                setUsername(text);
                                setUsernameValid(text ? true : false);
                                setUsernameTouched(true);
                            }}
                            placeholder={'Username'}
                            autoCapitalize='none'
                            onSubmitEditing={() => { passwordRef.focus(); }}
                            blurOnSubmit={false}
                            returnKeyType={'next'}
                        />
                        <View style={styles.passwordInput}>
                            <TextInput
                                style={[styles.textInput, !passwordValid && passwordTouched ? styles.invalid : null]}
                                value={password}
                                onChangeText={text => {
                                    setPassword(text);
                                    setPasswordValid(text ? true : false);
                                    setPasswordTouched(true);
                                }}
                                placeholder={'Password'}
                                secureTextEntry={!passwordShow}
                                autoCapitalize='none'
                                ref={input => {
                                    setPasswordRef(input);
                                }}
                                blurOnSubmit={true}
                                returnKeyType={'done'}
                            />
                            <Ionicons name={passwordIcon} size={25} style={styles.showPasswordIcon}
                                onPress={() => {
                                    passwordIcon === 'md-eye' ? setPasswordIcon('md-eye-off') : setPasswordIcon('md-eye');
                                    setPasswordShow(!passwordShow);
                                }}></Ionicons>
                        </View>
                    </ScrollView>
                    <View style={styles.buttonContainer}>
                        {submitButton}
                    </View>
                </View>
        </KeyboardAvoidingView>
    );
}

LoginScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Login',
        headerLeft: <Ionicons style={styles.headerLeft} name={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
            size={30} color={Platform.OS === 'android' ? Colors.accentColor : Colors.primaryColor}
            onPress={() => {
                Keyboard.dismiss();
                navData.navigation.toggleDrawer();
            }}></Ionicons>
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2'
    },
    shadowContainer: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
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
        textAlign: 'center',
        paddingBottom: 10
    },
    form: {
        paddingTop: '10%'
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
    invalid: {
        borderColor: 'red',
        borderBottomWidth: 2
    },
    buttonContainer: {
        alignItems: 'center'
    },
    disabledButton: {
        backgroundColor: "#eee",
        borderColor: "#aaa"
    },
    headerLeft: {
        paddingLeft: 10
    }
});

export default LoginScreen;