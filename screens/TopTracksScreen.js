import React, { useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTracks, toggleLove } from '../store/actions/tracks';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';


const checkContains = (arr, obj) => {
    arr.forEach(element => {
        if (element.artistName === obj.artistName && element.trackName === obj.trackName) {
            console.log('contains function');
            console.log(true);
            return true;
        }
    });
    return false;
}

const TopTracksScreen = props => {
    const countryName = props.navigation.getParam('name');

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchTracks(countryName));
    }, [loved]);

    let tracksOutput = null;

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
            console.log(tracks);
            console.log('--------');
            console.log(loved);
            tracksOutput = tracks.map((track, index) => {
                return (
                    <View style={styles.headContainer} key={index}>
                        <TouchableOpacity onPress={() => props.navigation.navigate({
                            routeName: 'Details',
                            params: {
                                artist: track.artistName,
                                track: track.trackName,
                                sessionKey: sessionKey,
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
                                        <Ionicons name={'md-heart'}
                                            size={40} color={Colors.primaryColor}></Ionicons>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={styles.love}>
                                    <TouchableOpacity onPress={() => dispatch(toggleLove(track.artistName, track.trackName, sessionKey, 'love'))}>
                                        <Ionicons name={'md-heart-empty'}
                                            size={40} color={Colors.primaryColor}></Ionicons>
                                    </TouchableOpacity>
                                </View>
                                }
                            </View>
                        </TouchableOpacity>
                    </View >
                );
            })
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                {tracksOutput}
            </View>
        </ScrollView>
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
    }

})

export default TopTracksScreen;