import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Keyboard, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../constants/Colors';
import { fetchCountries } from '../store/actions/countryList';
import CountryList from '../components/CountryList';

const CountryListScreen = props => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCountries());
    }, 0);

    let countriesOutput = null;

    let loading = useSelector(state => state.countryList.loading);
    let countries = useSelector(state => state.countryList.countries);
    let error = useSelector(state => state.countryList.error);

    if (loading) {
        countriesOutput = <ActivityIndicator size="large"></ActivityIndicator>;
    } else if (error) {
        countriesOutput = <Text>{error.message}</Text>;
    } else {
        countriesOutput = <CountryList countries={countries} navigation={props.navigation}></CountryList>;
    }


    return (
        <View style={styles.container}>
            {countriesOutput}
        </View>
    );
}

CountryListScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Countries',
        headerLeft: <Ionicons style={styles.headerLeft} name="md-menu" size={25} color={Colors.accentColor}
            onPress={() => navData.navigation.toggleDrawer()}></Ionicons>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerLeft: {
        paddingLeft: 10
    }
})

export default CountryListScreen;