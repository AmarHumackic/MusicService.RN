import React from 'react';
import { Provider } from 'react-redux';

import Navigation from './navigation/Navigation';
import configureStore from './store/configureStore';

const store = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};