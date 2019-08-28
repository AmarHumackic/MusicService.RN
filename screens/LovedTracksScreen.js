import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';

import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { fetchLoved, toggleLove } from '../store/actions/tracks';
import { setAuthRedirectPath } from '../store/actions/auth';

class LovedTracksScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Loved',
            headerLeft: <Ionicons style={{ paddingLeft: 10 }} name="md-menu" size={30}
                color={Platform.OS === 'android' ? Colors.accentColor : Colors.primaryColor}
                onPress={() => navigation.toggleDrawer()}></Ionicons>
        };
    };

    state = {
        user: null
    }

    checkFetchingTracks = () => {
        if (this.props.username) {
            if (this.state.user !== this.props.username) {
                this.props.onFetchLoved(this.props.username);
                this.setState({ user: this.props.username });
            }
        } else {
            this.navigateToLogin();
        }
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener('didFocus', this.checkFetchingTracks),
        ];
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    navigateToLogin = () => {
        if (!this.props.username) {
            this.props.onSetAuthRedirectPath('loved');
            this.props.navigation.navigate("CountryTracks");
            this.props.navigation.navigate("Login");
        }
    }

    render() {

        let lovedTracksOutput = null;

        if (this.props.loading) {
            lovedTracksOutput = (
                <View style={styles.activityIndicator}>
                    <ActivityIndicator size="large" color={Colors.primaryColor}></ActivityIndicator>
                </View>
            );
        } else if (this.props.error) {
            lovedTracksOutput = <Text style={styles.error}>{this.props.error.message}</Text>;
        } else {
            if (this.props.loved.length === 0) {
                lovedTracksOutput = <Text style={styles.noTracks}>You haven't loved any tracks yet.</Text>;
            } else {
                lovedTracksOutput = this.props.loved.map((track, index) => {
                    return (
                        <View style={styles.headContainer} key={index}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate({
                                routeName: 'Details',
                                params: {
                                    artist: track.artistName,
                                    track: track.trackName,
                                    sessionKey: this.props.sessionKey,
                                    typeLove: this.props.loved.some(tr => tr.artistName === track.artistName && tr.trackName === track.trackName) ? 'unlove' : 'love'
                                }
                            })}>
                                <View style={styles.itemContainer}>
                                    <View style={styles.track}>
                                        <Text style={styles.text}>Artist: {track.artistName}</Text>
                                        <Text style={styles.text}>Track: {track.trackName}</Text>
                                    </View>
                                    <View style={styles.love}>
                                        <TouchableOpacity onPress={() => this.props.onToggleLove(track.artistName, track.trackName, this.props.sessionKey, 'unlove')}>
                                            <Ionicons name="md-trash" size={40} color={Colors.primaryColor}></Ionicons>
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
                    {lovedTracksOutput}
                </View>
            </ScrollView>
        );
    }
}

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
        color: 'red',
        fontWeight: 'bold',
        marginTop: Dimensions.get("window").height / 2 - 40
    },
    noTracks: {
        color: 'black',
        fontWeight: 'bold',
        marginTop: Dimensions.get("window").height / 2 - 40

    },
    headerLeft: {
        paddingLeft: 10
    }
});

const mapStateToProps = state => {
    return {
        sessionKey: state.auth.sessionKey,
        username: state.auth.username,
        loved: state.tracks.loved,
        loading: state.tracks.loading,
        error: state.tracks.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchLoved: (username) => dispatch(fetchLoved(username)),
        onToggleLove: (artistName, trackName, sessionKey, type) => dispatch(toggleLove(artistName, trackName, sessionKey, type)),
        onSetAuthRedirectPath: (path) => dispatch(setAuthRedirectPath(path))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LovedTracksScreen);

// export default LovedTracksScreen;
