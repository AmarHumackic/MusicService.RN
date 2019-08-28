import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions, FlatList, Linking, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { fetchDetails, toggleLove } from '../store/actions/tracks';

const DetailsScreen = props => {
    const artistName = props.navigation.getParam('artist');
    const trackName = props.navigation.getParam('track');
    const sessionKey = props.navigation.getParam('sessionKey');
    let typeLove = props.navigation.getParam('typeLove');

    const dispatch = useDispatch();

    const toggleLoveHandler = useCallback(() => {
        dispatch(toggleLove(artistName, trackName, sessionKey, typeLove));
        
        typeLove = typeLove === 'love' ? 'unlove' : 'love';
        props.navigation.setParams({ typeLove: typeLove });

    }, [dispatch, artistName, trackName]);

    useEffect(() => {
        props.navigation.setParams({ toogleLoveHeader: toggleLoveHandler });
        console.log('useEffect prvi');
    }, [toggleLoveHandler]);

    useEffect(() => {
        dispatch(fetchDetails(artistName, trackName));
    }, 0);

    // useEffect(() => {
    //     console.log('useEffect typeLove');
    //     props.navigation.setParams({ typeLove: typeLove });

    // }, [typeLove])

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
        console.log(details);
        if (details) {
            const minutes = Math.floor((details.duration / 1000) / 60);
            const seconds = (details.duration / 1000) - minutes * 60;
            detailsOutput = (
                <View>
                    <Text style={styles.textHeader}>Track</Text>
                    <View style={styles.rowItem}>
                        <Ionicons name="md-musical-note" size={25}></Ionicons>
                        <Text style={[styles.textItem, { color: 'blue' }]} onPress={() => Linking.openURL(details.url)}>
                            {details.name}
                        </Text>
                    </View>
                    <View style={[styles.rowItem, styles.rowItemCentered]}>
                        <Text>{minutes}:{seconds} length</Text>
                        <Text>{details.listeners} listeners</Text>
                    </View>
                    {details.album ?
                        <View>
                            <Text style={styles.textHeader}>Album</Text>
                            <View style={styles.rowItem}>
                                <Ionicons name="md-globe" size={25}></Ionicons>
                                <Text style={[styles.textItem, { color: 'blue' }]} onPress={() => Linking.openURL(details.album.url)}>
                                    {details.album.title}
                                </Text>
                            </View>
                        </View> : null
                    }
                    <Text style={styles.textHeader}>Artist</Text>
                    <View style={styles.rowItem}>
                        <Ionicons name="md-person" size={25}></Ionicons>
                        <Text style={[styles.textItem, { color: 'blue' }]} onPress={() => Linking.openURL(details.artist.url)}>
                            {details.artist.name}
                        </Text>
                    </View>
                    <FlatList data={details.tag} keyExtractor={(info, index) => index.toString()} numColumns={3}
                        contentContainerStyle={styles.flatList} renderItem={(info) => (
                            <Text style={styles.flatListText} onPress={() => Linking.openURL(info.item.url)}>{info.item.name}</Text>
                        )} />
                    {details.wiki ?
                        <View style={styles.wiki}>
                            <Text style={styles.textHeader}>Summary</Text>
                            <Text>{details.wiki}<Text style={{ color: 'blue' }} onPress={() => Linking.openURL(details.url)}>Read more on Last.fm</Text></Text>
                        </View> : null
                    }
                </View>
            );
        } else {
            detailsOutput = <Text style={styles.error}>Empty Details...</Text>;
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
        headerRight:<Ionicons style={styles.headerRight} name={typeLove === 'love' ? 'md-heart-empty' : 'md-heart'}
                size={30} color={Platform === 'android' ? Colors.accentColor : Colors.primaryColor} onPress={toogleLoveHeader}></Ionicons>
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 10
    },
    rowItem: {
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 15
    },
    rowItemCentered: {
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    textItem: {
        fontSize: 16,
        paddingLeft: 10
    },
    flatList: {
        alignItems: 'center'
    },
    flatListText: {
        backgroundColor: 'lightgray',
        fontSize: 15,
        margin: 5,
        paddingHorizontal: 5
    },
    wiki: {
        paddingHorizontal: 10,
        marginBottom: 10
    },
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
    }
});

export default DetailsScreen;