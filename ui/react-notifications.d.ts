import * as React from "react";

declare namespace NotificationContainer {

    export interface Attributes {
        enterTimeout?: number;
        leaveTimeout?: number;
    }
}

declare var NotificationContainer: React.ClassicComponentClass<NotificationContainer.Attributes>;

declare namespace NotificationManager {
    function info(msg: string, title?: string, timeout?: number, callback?: () => void): void;
    function success(msg: string, title?: string, timeout?: number, callback?: () => void): void;
    function warning(msg: string, title?: string, timeout?: number, callback?: () => void): void;
    function error(msg: string, title?: string, timeout?: number, callback?: () => void): void;
}
