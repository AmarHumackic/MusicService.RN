import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
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
    height: 120,
    width: '49%',
    backgroundColor: '#f5f5f5',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 10,
    marginHorizontal: 2,
    alignItems: 'center'
  },
  item: {
    height: '100%',
    width: '100%'
  },
  bgImage: {
    height: '80%',
    width: '100%'
  },
  svg: {
    height: 100,
    width: Dimensions.get('window').width / 2
  },
  titleContainer: {
    height: '20%',
    width: Dimensions.get('window').width / 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5
  },
  title: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center'
  }
});

export default ListItem;
