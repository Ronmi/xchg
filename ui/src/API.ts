/// <reference path="../typings/globals/whatwg-fetch/index.d.ts" />

import { OrderData } from "./commons";

export interface API {
    Auth: (pin: string) => Promise<void>;
    Add: (data: OrderData) => Promise<void>;
    List: (code: string) => Promise<OrderData[]>;
    ListAll: () => Promise<OrderData[]>;
}

export default API;

async function post<T>(url: string, data: any): Promise<T> {
    let r = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
            "Accept": "application/json, text/plain",
        },
        body: JSON.stringify(data),
    });

    if (r.status >= 400) {
        throw r.status + " " + r.statusText;
    }

    return await r.json<T>();
}

export class ByFetch implements API {
    private token: string;

    constructor() {
        this.token = "";
    }

    async Auth(pin: string): Promise<void> {
        this.token = await post<string>("/api/auth", { pin: pin });
    }

    async Add(data: OrderData): Promise<void> {
        await post("/api/add", { data: data, token: this.token });
    }

    async List(code: string): Promise<OrderData[]> {
        return await post<OrderData[]>("/api/list", { code: code, token: this.token });
    }

    async ListAll(): Promise<OrderData[]> {
        return await post<OrderData[]>("/api/listall", { token: this.token });
    }
};
