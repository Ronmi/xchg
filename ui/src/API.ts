/// <reference path="../typings/globals/whatwg-fetch/index.d.ts" />

import { OrderData } from "./commons";

export interface API {
    Auth: (pin: string) => Promise<void>;
    Add: (data: OrderData) => Promise<void>;
    List: (code: string) => Promise<OrderData[]>;
    ListAll: () => Promise<OrderData[]>;
}

export default API;

function post<T>(url: string, data: any): Promise<T> {
    return new Promise<T>(function(res, rej) {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                "Accept": "application/json, text/plain",
            },
            body: JSON.stringify(data),
        }).then(
            function(r: Response) {
                if (r.status >= 400) {
                    rej(r.status + " " + r.statusText);
                }

                r.json<T>().then(
                    function(data: T) {
                        res(data);
                    },
                    function() {
                        rej("Not JSON format");
                    }
                );
            },
            function() {
                rej("Connection error");
            }
            );
    });
}

export class ByFetch implements API {
    private token: string;

    constructor() {
        this.token = "";
    }

    Auth(pin: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            post<string>("/api/auth", { pin: pin }).then(
                (token: string) => {
                    this.token = token;
                    resolve();
                },
                (msg: string) => {
                    reject();
                }
            );
        });
    }

    Add(data: OrderData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            post("/api/add", { data: data, token: this.token }).then(
                () => {
                    resolve();
                },
                () => {
                    reject();
                }
            );
        });
    }

    List(code: string): Promise<OrderData[]> {
        return new Promise<OrderData[]>((resolve, reject) => {
            post("/api/list", { code: code, token: this.token }).then(
                (data: OrderData[]) => {
                    resolve(data);
                },
                () => {
                    reject();
                }
            );
        });
    }

    ListAll(): Promise<OrderData[]> {
        return new Promise<OrderData[]>((resolve, reject) => {
            post("/api/listall", { token: this.token }).then(
                (data: OrderData[]) => {
                    resolve(data);
                },
                () => {
                    reject();
                }
            );
        });
    }
};
