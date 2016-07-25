/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/es6-shim/index.d.ts" />

import { OrderData } from "../src/types";

let expect = chai.expect;

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

describe("API mock", () => {
    describe("with success()", () => {
        let api = new FakeAPI();
        api.fakeData = [
            { when: 1, local: -1, foreign: 1, code: "USD" },
        ];
        api.will.success();
        it("runs Auth() successfuly", (done) => {
            api.Auth("").then(
                () => { done(); },
                () => { throw "error"; }
            );
        });
        it("runs Add() successfuly", (done) => {
            api.Add({ when: 0, foreign: 1, local: -1, code: "USD" }).then(
                () => { done(); },
                () => { throw "error"; }
            );
        });
        it("runs List() successfuly and returns the fake data", (done) => {
            api.List("USD").then(
                (data: OrderData[]) => {
                    expect(data).to.deep.equal(api.fakeData);
                    done();
                },
                () => { throw "error"; }
            );
        });
        it("runs ListAll() successfuly and returns the fake data", (done) => {
            api.ListAll().then(
                (data: OrderData[]) => {
                    expect(data).to.deep.equal(api.fakeData);
                    done();
                },
                () => { throw "error"; }
            );
        });
    });
    describe("with fail()", () => {
        let api = new FakeAPI();
        api.will.fail();
        it("fails to run Auth()", (done) => {
            api.Auth("").then(
                () => { throw "error"; },
                () => { done(); }
            );
        });
        it("fails to run Add()", (done) => {
            api.Add({ when: 0, foreign: 1, local: -1, code: "USD" }).then(
                () => { throw "error"; },
                () => { done(); }
            );
        });
        it("fails to run List()", (done) => {
            api.List("USD").then(
                () => { throw "error"; },
                () => { done(); }
            );
        });
        it("fails to run ListAll()", (done) => {
            api.ListAll().then(
                () => { throw "error"; },
                () => { done(); }
            );
        });
    });
});
