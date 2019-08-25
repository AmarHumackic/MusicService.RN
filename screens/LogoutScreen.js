import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import { logout } from '../store/actions/auth';

class LogoutScreen extends Component {
    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener('didFocus', () => {
                this.props.onLogout();
                this.props.navigation.navigate('CountryList');
            }),
        ];
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator></ActivityIndicator>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(logout())
    };
};

export default connect(null, mapDispatchToProps)(LogoutScreen);
