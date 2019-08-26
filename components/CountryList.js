import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Platform, Image, ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';

import Colors from '../constants/Colors';
import ListItem from './ListItem';

const CountryList = props => {
    const [data, setData] = useState(null);
    const [arrayHolder, setArrayHolder] = useState(null);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        setData(props.countries);
        setArrayHolder(props.countries);
    }, [props.countries]);

    const searchFilterHandler = name => {
        setSearchValue(name);

        const newData = arrayHolder.filter(item => {
            const itemData = item.name.toUpperCase();
            const textData = name.toUpperCase();
            return itemData.startsWith(textData);
        });

        setData(newData);
    };

    const renderHeader = () => {
        return arrayHolder ? (
            <SearchBar placeholder="Search countries..." lightTheme autoCorrect={true}
                value={searchValue} onChangeText={text => searchFilterHandler(text)}
                style={{ width: '100%' }} platform={Platform.OS === 'ios' ? 'ios' : 'android'}
            ></SearchBar> ) : null;
    };

    const renderListItem = itemData => {

        return (
            <ListItem
                title={itemData.item.name}
                image={itemData.item.flag}
                onSelectCountry={() => {
                    props.navigation.navigate({
                        routeName: 'TopTracks',
                        params: {
                            name: itemData.item.name
                        }
                    });
                }} />
        );
    };

    if (!props.countries) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator></ActivityIndicator>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList data={data} numColumns={2} keyExtractor={(info, index) => index.toString()}
                renderItem={renderListItem} style={styles.flatList}
                ListHeaderComponent={renderHeader} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        alignItems: 'center'
    },
    flatList: {
        width: '95%',
        paddingHorizontal: 2
    }
});

export default CountryList;