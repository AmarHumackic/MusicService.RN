import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Platform, Keyboard } from 'react-native';
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
                <ActivityIndicator color={Colors.primaryColor}></ActivityIndicator>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SearchBar placeholder="Search countries..." lightTheme value={searchValue} style={styles.flatList}
                onChangeText={text => searchFilterHandler(text)} onClear={text => searchFilterHandler('')}
                platform={Platform.OS === 'ios' ? 'ios' : 'android'}></SearchBar>
            <FlatList data={data} numColumns={2} keyExtractor={(info, index) => index.toString()}
                renderItem={renderListItem} style={styles.flatList} />
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