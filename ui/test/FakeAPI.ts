import { OrderData } from "../src/commons";

export default class FakeAPI {
    fakeData: OrderData[];
    private shouldResolve: boolean;

    constructor() {
        this.fakeData = [];
        this.shouldResolve = true;
    }

    get will(): FakeAPI {
        return this;
    }
    success() {
        this.shouldResolve = true;
    }
    fail() {
        this.shouldResolve = false;
    }

    Auth(pin: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.shouldResolve) {
                resolve();
                return;
            }
            reject();
        });
    }
    Add(data: OrderData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.shouldResolve) {
                resolve();
                return;
            }
            reject();
        });
    }
    List(code: string): Promise<OrderData[]> {
        return new Promise<OrderData[]>((resolve, reject) => {
            if (this.shouldResolve) {
                resolve(this.fakeData);
                return;
            }
            reject();
        });
    }
    ListAll(): Promise<OrderData[]> {
        return new Promise<OrderData[]>((resolve, reject) => {
            if (this.shouldResolve) {
                resolve(this.fakeData);
                return;
            }
            reject();
        });
    }
}
