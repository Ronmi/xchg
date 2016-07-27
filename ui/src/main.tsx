import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { ByFetch } from "./API";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

let api = new ByFetch();
let err = function(msg: string) {
    NotificationManager.error(msg);
};

ReactDOM.render(
    <div>
	<App api={api} alert={err} />
	<NotificationContainer />
    </div>,
    document.getElementById('app')
);
