import React from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { toggleLove } from '../store/actions/tracks';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../constants/Colors';

const LovedTrack = props => {
    let loved = useSelector(state => state.tracks.loved);
    let sessionKey = useSelector(state => state.auth.sessionKey);

    const dispatch = useDispatch();

    return (
        <View style={styles.headContainer} key={props.index}>
            <TouchableOpacity onPress={() => props.navigation.navigate({
                routeName: 'Details',
                params: {
                    artist: props.track.artistName,
                    track: props.track.trackName,
                    typeLove: loved.some(tr => tr.artistName === props.track.artistName && tr.trackName === props.track.trackName) ? 'unlove' : 'love'
                }
            })}>
                <View style={styles.itemContainer}>
                    <View style={styles.track}>
                        <Text style={styles.text}>Artist: {props.track.artistName}</Text>
                        <Text style={styles.text}>Track: {props.track.trackName}</Text>
                    </View>
                    <View style={styles.love}>
                        <TouchableOpacity onPress={() => dispatch(toggleLove(props.track.artistName, props.track.trackName, sessionKey, 'unlove'))}>
                            <Ionicons name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                                size={40} color={Colors.primaryColor}></Ionicons>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </View >
    );
};

const styles = StyleSheet.create({
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
    }
});

export default LovedTrack;