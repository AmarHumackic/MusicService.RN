import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTracks } from '../store/actions/tracks';
import Colors from '../constants/Colors';
import TopTrack from '../components/TopTrack';
import Pagination from '../components/UI/Pagination';

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
                return <TopTrack key={index} track={track} index={index} navigation={props.navigation}></TopTrack>;
            });
            paginationFooter = (
                <Pagination previousPage={() => setCurrentPage(currentPage - 1)}
                    nextPage={() => setCurrentPage(currentPage + 1)}
                    currentPage={currentPage}>
                </Pagination>
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
});

export default TopTracksScreen;