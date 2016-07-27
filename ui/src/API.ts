/// <reference path="../typings/globals/es6-shim/index.d.ts" />

import { OrderData } from "./commons";

export interface API {
    Auth: (pin: string) => Promise<void>;
    Add: (data: OrderData) => Promise<void>;
    List: (code: string) => Promise<OrderData[]>;
    ListAll: () => Promise<OrderData[]>;
}

export default API;

export class ByJquery implements API {
    private token: string;

    constructor() {
        this.token = "";
    }

    Auth(pin: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            $.post({
                url: "/api/auth",
                data: JSON.stringify({ pin: pin }),
                processData: false,
                contentType: "text/plain",
                dataType: "json"
            }).done((token: string) => {
                this.token = token;
                resolve();
            }).fail((msg: string) => {
                reject();
            });
        });
    }

    Add(data: OrderData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            $.post({
                url: "/api/add",
                data: JSON.stringify({ data: data, token: this.token }),
                processData: false,
                contentType: "text/plain; charset=UTF-8",
                dataType: "json"
            }).done(() => {
                resolve();
            }).fail(() => {
                reject();
            });
        });
    }

    List(code: string): Promise<OrderData[]> {
        return new Promise<OrderData[]>((resolve, reject) => {
            $.post({
                url: "/api/list",
                data: JSON.stringify({ code: code, token: this.token }),
                processData: false,
                contentType: "text/plain",
                dataType: "json"
            }).done((data: OrderData[]) => {
                resolve(data);
            }).fail(() => {
                reject();
            });
        });
    }

    ListAll(): Promise<OrderData[]> {
        return new Promise<OrderData[]>((resolve, reject) => {
            $.post({
                url: "/api/listall",
                data: JSON.stringify({ token: this.token }),
                contentType: "text/plain",
                dataType: "json"
            }).done((data: OrderData[]) => {
                resolve(data);
            }).fail(() => {
                reject();
            });
        });
    }
};
