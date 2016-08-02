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

    async Auth(pin: string): Promise<void> {
        if (this.shouldResolve) {
            return;
        }

        throw "this should fail";
    }
    async Add(data: OrderData): Promise<void> {
        if (this.shouldResolve) {
            return;
        }

        throw "this should fail";
    }
    async List(code: string): Promise<OrderData[]> {
        if (this.shouldResolve) {
            return this.fakeData;
        }

        throw "this should fail";
    }
    async ListAll(): Promise<OrderData[]> {
        if (this.shouldResolve) {
            return this.fakeData;
        }

        throw "this should fail";
    }
}
