import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const Pagination = props => (
    <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={props.previousPage}>
            <View style={styles.paginationItemLeft}>
                <Text style={styles.paginationText}>Previous</Text>
            </View>
        </TouchableOpacity>
        <View style={styles.paginationCurrentPage}>
            <Text style={styles.paginationText}>{props.currentPage}</Text>
        </View>
        <TouchableOpacity onPress={props.nextPage}>
            <View style={styles.paginationItemRight}>
                <Text style={styles.paginationText}>Next</Text>
            </View>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    paginationContainer: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-around',
        paddingTop: 5,
        paddingBottom: 10
    },
    paginationItemLeft: {
        backgroundColor: Colors.primaryColor,
        padding: 5,
        width: 100,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20
    },
    paginationItemRight: {
        backgroundColor: Colors.primaryColor,
        padding: 5,
        width: 100,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20
    },
    paginationCurrentPage: {
        backgroundColor: Colors.primaryColor,
        padding: 5,
        width: 40,
    },
    paginationText: {
        padding: 5,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        fontSize: 14
    }
});

export default Pagination;