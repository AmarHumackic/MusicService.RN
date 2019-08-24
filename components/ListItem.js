import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground
} from 'react-native';

// import SvgUri from "expo-svg-uri";
// import Image from 'react-native-remote-svg'
// import { Svg, Image } from 'react-native-svg';
import SVGImage from 'react-native-svg-image';

const ListItem = props => {

  const limitItemTitle = (title, limit = 25) => {
    const newTitle = [];
    if (title.length > limit) {
      title.split(' ').reduce((acc, cur) => {
        if (acc + cur.length <= limit) {
          newTitle.push(cur);
        }
        return acc + cur.length;
      }, 0);

      return `${newTitle.join(' ')}...`;
    }
    return title;
  };
  return (
    <View style={styles.listItem}>
      <TouchableOpacity onPress={props.onSelectCountry}>
        <View style={styles.item}>
          <View style={styles.bgImage}>
            <SVGImage
              style={styles.svg}
              source={{ uri: props.image }} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {limitItemTitle(props.title)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
    alignItems: 'center'
  },
  item: {
    width: '100%',
    height: '100%',
  },
  bgImage: {
    width: '100%',
    height: '80%'
  },
  svg: {
    width: 300,
    height: 200
  },
  titleContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5,
    paddingHorizontal: 12
  },
  title: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center'
  }
  // listItem: {
  //   height: 200,
  //   width: '100%',
  //   backgroundColor: '#f5f5f5',
  //   borderRadius: 10,
  //   overflow: 'hidden',
  //   marginVertical: 10
  // },
  // bgImage: {
  //   width: '100%',
  //   height: '100%',
  //   // justifyContent: 'flex-end',
  //   position: 'absolute'
  // },
  // listRow: {
  //   // flexDirection: 'row'
  //   flexDirection: 'column',
  // },
  // listHeader: {
  //   height: '100%'
  // },
  // titleContainer: {
  //   backgroundColor: 'rgba(0,0,0,0.5)',
  //   paddingVertical: 5,
  //   paddingHorizontal: 12
  // },
  // title: {
  //   fontSize: 20,
  //   color: 'white',
  //   textAlign: 'center'
  // }
});

export default ListItem;
