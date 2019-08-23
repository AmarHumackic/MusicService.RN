import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground
} from 'react-native';

// import SvgUri from "expo-svg-uri";


const ListItem = props => {
  return (
    <View style={styles.listItem}>
      <TouchableOpacity onPress={props.onSelectMeal}>
        <View>
          <View style={{ ...styles.listRow, ...styles.listHeader }}>
            <ImageBackground source={{ uri: 'https://interactive-examples.mdn.mozilla.net/media/examples/grapefruit-slice-332-332.jpg' }} style={styles.bgImage}>
            {/* <View>
            <SvgUri
                width="200"
                height="200"
                source={{
                  uri: props.image
                }}
              /></View> */}
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={1}>
                  {props.title}
                </Text>
                {/* <Text>{props.image}</Text> */}
              </View>
            </ImageBackground>
          </View>
        </View>
      </TouchableOpacity>
    </View >
  );
};

const styles = StyleSheet.create({
  listItem: {
    height: 200,
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10
  },
  bgImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  listRow: {
    flexDirection: 'row'
  },
  listHeader: {
    height: '85%'
  },
  titleContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5,
    paddingHorizontal: 12
  },
  title: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center'
  }
});

export default ListItem;
