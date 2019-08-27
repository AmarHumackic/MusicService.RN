import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, Platform } from "react-native";

const buttonWithBackground = props => {
  const content = (
    <View style={[styles.button, props.style, { backgroundColor: props.color }, props.disabled ? styles.disabled : null]}>
      <Text style={props.disabled ? styles.disabledText : { color: props.tintColor }}>
        {props.children}
      </Text>
    </View>
  );

  if (props.disabled) {
    return content;
  }

  if (Platform.OS === 'android') {
    return (
      <TouchableOpacity onPress={props.onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return <TouchableOpacity onPress={props.onPress}>{content}</TouchableOpacity>;
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black'
  },
  disabled: {
    backgroundColor: '#eee',
    borderColor: '#aaa'
  },
  disabledText: {
    color: '#aaa'
  }
});

export default buttonWithBackground;
