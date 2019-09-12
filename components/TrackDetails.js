import React from 'react';
import { View, Text, StyleSheet, FlatList, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TrackDetails = props => {
    const minutes = Math.floor((props.details.duration / 1000) / 60);
    const seconds = (props.details.duration / 1000) - minutes * 60;
    return (
        <View>
            <Text style={styles.textHeader}>Track</Text>
            <View style={styles.rowItem}>
                <Ionicons name="md-musical-note" size={25}></Ionicons>
                <Text style={[styles.textItem, { color: 'blue' }]} onPress={() => Linking.openURL(props.details.url)}>
                    {props.details.name}
                </Text>
            </View>
            <View style={[styles.rowItem, styles.rowItemCentered]}>
                <Text>{minutes}:{seconds} length</Text>
                <Text>{props.details.listeners} listeners</Text>
            </View>
            {props.details.album ?
                <View>
                    <Text style={styles.textHeader}>Album</Text>
                    <View style={styles.rowItem}>
                        <Ionicons name="md-globe" size={25}></Ionicons>
                        <Text style={[styles.textItem, { color: 'blue' }]} onPress={() => Linking.openURL(props.details.album.url)}>
                            {props.details.album.title}
                        </Text>
                    </View>
                </View> : null
            }
            <Text style={styles.textHeader}>Artist</Text>
            <View style={styles.rowItem}>
                <Ionicons name="md-person" size={25}></Ionicons>
                <Text style={[styles.textItem, { color: 'blue' }]} onPress={() => Linking.openURL(props.details.artist.url)}>
                    {props.details.artist.name}
                </Text>
            </View>
            <FlatList data={props.details.tag} keyExtractor={(info, index) => index.toString()} numColumns={3}
                contentContainerStyle={styles.flatList} renderItem={(info) => (
                    <Text style={styles.flatListText} onPress={() => Linking.openURL(info.item.url)}>{info.item.name}</Text>
                )} />
            {props.details.wiki ?
                <View style={styles.wiki}>
                    <Text style={styles.textHeader}>Summary</Text>
                    <Text>
                        {props.details.wiki}
                        <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(props.details.url)}>Read more on Last.fm</Text>
                    </Text>
                </View> : null
            }
        </View>
    );
};

const styles = StyleSheet.create({
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
    }
});

export default TrackDetails;