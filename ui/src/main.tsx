import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { ByJquery } from "./API";

let api = new ByJquery();

ReactDOM.render(
    <App api={api} alert={alert} />,
    document.getElementById('app')
);
