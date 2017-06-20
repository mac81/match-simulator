import React from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import eventMessages from './eventMessages';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

i18next.init({
  lng: 'en',
  debug: false,
  resources: {
    en: {
      translation: eventMessages
    }
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
