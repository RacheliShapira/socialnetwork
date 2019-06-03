import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer } from "./reducers.js";
import { Provider } from "react-redux";
import { initSocket } from "./socket";
import { Welcome } from "./welcome";
import App from "./app";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
let compToRender;

if (location.pathname == "/welcome") {
    compToRender = <Welcome />;
} else {
    compToRender = (initSocket(store),
    (
        <Provider store={store}>
            <App />
        </Provider>
    ));
}

ReactDOM.render(compToRender, document.querySelector("main"));
