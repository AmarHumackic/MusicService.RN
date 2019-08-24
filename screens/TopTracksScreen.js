import React, { useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTracks } from '../store/actions/tracks';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const TopTracksScreen = props => {
    const countryName = props.navigation.getParam('name');

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchTracks(countryName));
    }, 0);

    let tracksOutput = null;

    let loading = useSelector(state => state.tracks.loading);
    let tracks = useSelector(state => state.tracks.tracks);
    let error = useSelector(state => state.tracks.error);

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
            tracksOutput = <Text>There is no tracks for {countryName}.</Text>;
        } else {
            tracksOutput = tracks.map((track, index) => {
                return (
                    <View style={styles.headContainer} key={index}>
                        <TouchableOpacity onPress={() => props.navigation.navigate({
                            routeName: 'Details',
                            params: {
                                artist: track.artistName,
                                track: track.trackName
                            }
                        })}>
                            <View style={styles.itemContainer}>
                                <View style={styles.track}>
                                    <Text style={styles.text}>Artist: {track.artistName}</Text>
                                    <Text style={styles.text}>Track: {track.trackName}</Text>
                                </View>
                                <View style={styles.love}>
                                    <TouchableOpacity onPress={() => alert('Loved')}>
                                        <Ionicons name="md-heart-empty" size={40} color={Colors.primaryColor}></Ionicons>
                                    </TouchableOpacity>
                                </View>
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
        shadowOpacity: 0.26,
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
        color: 'red'
    }

})

export default TopTracksScreen;