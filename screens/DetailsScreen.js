import React, { useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions, Platform, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import { fetchDetails, toggleLove } from '../store/actions/tracks';
import { setAuthRedirectPath } from '../store/actions/auth';
import TrackDetails from '../components/TrackDetails';

const DetailsScreen = props => {
    const artistName = props.navigation.getParam('artist');
    const trackName = props.navigation.getParam('track');
    let typeLove = props.navigation.getParam('typeLove');
    let sessionKey = useSelector(state => state.auth.sessionKey);
    let loved = useSelector(state => state.tracks.loved);

    const dispatch = useDispatch();

    //callback for toggle love, if user is logged in(sessionKey exists)
    const toggleLoveHandler = useCallback(() => {
        if (sessionKey) {
            dispatch(toggleLove(artistName, trackName, sessionKey, typeLove));
            typeLove = typeLove === 'love' ? 'unlove' : 'love';
            props.navigation.setParams({ typeLove: typeLove });
        } else {
            Alert.alert(
                'Permissions',
                'Authentication is required.',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'Login', onPress: () => {
                            dispatch(setAuthRedirectPath('top'));
                            props.navigation.navigate('Login');
                        }
                    },
                ],
                { cancelable: false }
            );
        }

    }, [dispatch, artistName, trackName, sessionKey]);

    //connect callback with love button
    useEffect(() => {
        props.navigation.setParams({ toogleLoveHeader: toggleLoveHandler });
    }, [toggleLoveHandler]);

    //fetch track details
    useEffect(() => {
        dispatch(fetchDetails(artistName, trackName));
    }, 0);

    //for case when user is not logged in and after successfull login this checks if current track is loved
    useEffect(() => {
        const typeLoveNew = loved.some(tr => tr.artistName === artistName && tr.trackName === trackName) ? 'unlove' : 'love'
        props.navigation.setParams({ typeLove: typeLoveNew });
    }, [sessionKey, loved]);

    let detailsOutput = null;

    let loading = useSelector(state => state.tracks.loading);
    let details = useSelector(state => state.tracks.details);
    let error = useSelector(state => state.tracks.error);

    if (loading) {
        detailsOutput = (
            <View style={styles.activityIndicator}>
                <ActivityIndicator size="large" color={Colors.primaryColor}></ActivityIndicator>
            </View>
        );
    } else if (error) {
        detailsOutput = <Text style={styles.error}>{error.message}</Text>;
    } else {
        if (details) {
            detailsOutput = <TrackDetails details={details}></TrackDetails>;
        } else {
            detailsOutput = <Text style={styles.emptyDetails}>Empty Details...</Text>;
        }
    }
    return (
        <ScrollView>
            <View>
                {detailsOutput}
            </View>
        </ScrollView>
    );
}

DetailsScreen.navigationOptions = navData => {
    const trackName = navData.navigation.getParam('track');
    let typeLove = navData.navigation.getParam('typeLove');
    const toogleLoveHeader = navData.navigation.getParam('toogleLoveHeader');
    return {
        headerTitle: trackName,
        headerRight: <Ionicons style={styles.headerRight} size={30}
            name={Platform.OS === 'android' ?
                typeLove === 'love' ? 'md-heart-empty' : 'md-heart' :
                typeLove === 'love' ? 'ios-heart-empty' : 'ios-heart'}
            color={Platform.OS === 'android' ? Colors.accentColor : Colors.primaryColor} onPress={toogleLoveHeader}></Ionicons>
    };
};

const styles = StyleSheet.create({
    headerRight: {
        paddingRight: 10
    },
    activityIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Dimensions.get("window").height / 2 - 40
    },
    error: {
        color: 'red'
    },
    emptyDetails: {
        color: 'black'
    }
});

export default DetailsScreen;