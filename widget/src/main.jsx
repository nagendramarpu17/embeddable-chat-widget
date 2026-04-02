// widget/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const host = document.createElement('div');
host.id = 'support-chat-widget';
document.body.appendChild(host);

const shadow = host.attachShadow({ mode: 'open' });
const renderRoot = document.createElement('div');
shadow.appendChild(renderRoot);

// Mount React into the Shadow DOM
ReactDOM.createRoot(renderRoot).render(
  <React.StrictMode>
    <App shadowRoot={shadow} />
  </React.StrictMode>
);