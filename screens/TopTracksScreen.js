import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, Alert, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTracks, toggleLove } from '../store/actions/tracks';
import { setAuthRedirectPath } from '../store/actions/auth';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';


const TopTracksScreen = props => {
    const [currentPage, setCurrentPage] = useState(1);
    const countryName = props.navigation.getParam('name');

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchTracks(countryName, 20, currentPage));
    }, [loved, currentPage]);

    let tracksOutput = null;
    let paginationFooter = null;

    let loading = useSelector(state => state.tracks.loading);
    let tracks = useSelector(state => state.tracks.tracks);
    let loved = useSelector(state => state.tracks.loved);
    let error = useSelector(state => state.tracks.error);
    let sessionKey = useSelector(state => state.auth.sessionKey);

    if (loading) {
        tracksOutput = (
            <View style={styles.activityIndicator}>
                <ActivityIndicator size="large" color={Colors.primaryColor}></ActivityIndicator>
            </View>
        );
    } else if (error) {
        tracksOutput = <Text style={styles.error}>{error.message}</Text>;
    } else {
        if (tracks.length === 0) {
            tracksOutput = <Text style={[styles.error, { color: 'black' }]}>There is no tracks for {countryName}.</Text>;
        } else {
            tracksOutput = tracks.map((track, index) => {
                return (
                    <View style={styles.headContainer} key={index}>
                        <TouchableOpacity onPress={() => props.navigation.navigate({
                            routeName: 'Details',
                            params: {
                                artist: track.artistName,
                                track: track.trackName,
                                typeLove: loved.some(tr => tr.artistName === track.artistName && tr.trackName === track.trackName) ? 'unlove' : 'love'
                            }
                        })}>
                            <View style={styles.itemContainer}>
                                <View style={styles.track}>
                                    <Text style={styles.text}>Artist: {track.artistName}</Text>
                                    <Text style={styles.text}>Track: {track.trackName}</Text>
                                </View>
                                {loved.some(tr => tr.artistName === track.artistName && tr.trackName === track.trackName) ?
                                    <View style={styles.love}>
                                        <TouchableOpacity onPress={() => dispatch(toggleLove(track.artistName, track.trackName, sessionKey, 'unlove'))}>
                                            <Ionicons name={Platform.OS === 'android' ? 'md-heart' : 'ios-heart'}
                                                size={40} color={Colors.primaryColor}></Ionicons>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View style={styles.love}>
                                        <TouchableOpacity onPress={() => {
                                            if (sessionKey) {
                                                dispatch(toggleLove(track.artistName, track.trackName, sessionKey, 'love'))
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
                                        }}>
                                            <Ionicons name={Platform.OS === 'android' ? 'md-heart-empty' : 'ios-heart-empty'}
                                                size={40} color={'black'}></Ionicons>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        </TouchableOpacity >
                    </View >
                );
            })
            paginationFooter = (
                <View style={styles.paginationContainer}>
                    <TouchableOpacity onPress={() => setCurrentPage(currentPage - 1)}>
                        <View style={styles.paginationItemLeft}>
                            <Text style={styles.paginationText}>Previous</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.paginationCurrentPage}>
                        <Text style={styles.paginationText}>{currentPage}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setCurrentPage(currentPage + 1)}>
                        <View style={styles.paginationItemRight}>
                            <Text style={styles.paginationText}>Next</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                {tracksOutput}
                {paginationFooter}
            </View>
        </ScrollView >
    );
}

TopTracksScreen.navigationOptions = navData => {
    const countryTitle = navData.navigation.getParam('name');
    return {
        headerTitle: countryTitle + ' Top Tracks'
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headContainer: {
        width: '100%',
        height: 80,
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 3
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    track: {
        width: '80%',
        flexDirection: 'column'
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 3
    },
    love: {
        width: '15%',
        height: '100%',
        justifyContent: 'center'
    },
    activityIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Dimensions.get("window").height / 2 - 40
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
        marginTop: Dimensions.get("window").height / 2 - 40
    },
    paginationContainer: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-around',
        paddingTop: 5,
        paddingBottom: 10
    },
    paginationItemLeft: {
        backgroundColor: Colors.primaryColor,
        padding: 5,
        width: 100,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20
    },
    paginationItemRight: {
        backgroundColor: Colors.primaryColor,
        padding: 5,
        width: 100,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20
    },
    paginationCurrentPage: {
        backgroundColor: Colors.primaryColor,
        padding: 5,
        width: 40,
    },
    paginationText: {
        padding: 5,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        fontSize: 14
    }
});

export default TopTracksScreen;