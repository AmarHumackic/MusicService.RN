import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const LovedTracksScreen = props => {
    return (
        <View>
            <Text>LovedTracks Screen!</Text>
        </View>
    );
}

LovedTracksScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Loved',
        headerLeft: <Ionicons style={styles.headerLeft} name="md-menu" size={25} color={Colors.accentColor}
            onPress={() => navData.navigation.toggleDrawer()}></Ionicons> 
    }
};

const styles = StyleSheet.create({
    headerLeft: {
        paddingLeft: 10
    }
});

export default LovedTracksScreen;