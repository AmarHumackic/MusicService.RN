import React, { useState } from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { useDispatch } from 'react-redux';
import { AppLoading } from 'expo';

import Navigation from './navigation/Navigation';
import configureStore from './store/configureStore';
import { authSuccess } from './store/actions/auth';

const store = configureStore();


export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
