import React, {lazy, Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./store/index";
import {Toaster} from "react-hot-toast";

const App = lazy(() => import('./App'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Provider store={store}>
      <Suspense>
          <App />
          <Toaster
              toastOptions={{
                  position: "top-right",
                  style: {
                      background: '#363636',
                      color: '#fff',
                      fontWeight: 'bold',
                      borderRadius: '10px',
                      padding: '16px',
                      fontSize: '14px'
                  }
              }}
          />
      </Suspense>
      </Provider>
  </BrowserRouter>
);

reportWebVitals();
