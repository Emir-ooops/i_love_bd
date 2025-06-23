import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from "./store/UserStore";
import DeviceStore from "./store/DeviceStore";
import BasketStore from "./store/basketStore";
import './globalStyles.css';

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Context.Provider value={{
          user: new UserStore(),
          device: new DeviceStore(),
          basket: new BasketStore()
      }}>
          <App />
      </Context.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

