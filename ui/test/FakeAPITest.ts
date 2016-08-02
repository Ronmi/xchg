/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />

import FakeAPI from "./FakeAPI";
import { OrderData } from "../src/commons";

let expect = chai.expect;

describe("API mock", () => {
    describe("with success()", () => {
        let api = new FakeAPI();
        api.fakeData = [
            { when: 1, local: -1, foreign: 1, code: "USD" },
        ];
        api.will.success();
        it("runs Auth() successfuly", () => {
            return api.Auth("");
        });
        it("runs Add() successfuly", () => {
            return api.Add({ when: 0, foreign: 1, local: -1, code: "USD" });
        });
        it("runs List() successfuly and returns the fake data", async () => {
            let data = await api.List("USD");
            expect(data).to.deep.equal(api.fakeData);
        });
        it("runs ListAll() successfuly and returns the fake data", async () => {
            let data = await api.ListAll();
            expect(data).to.deep.equal(api.fakeData);
        });
    });
    describe("with fail()", () => {
        let api = new FakeAPI();
        api.will.fail();
        it("fails to run Auth()", async () => {
            try {
                await api.Auth("");
            } catch (e) {
                return;
            }

            throw "this should fail";
        });
        it("fails to run Add()", async () => {
            try {
                await api.Add({ when: 0, foreign: 1, local: -1, code: "USD" });
            } catch (e) {
                return;
            }

            throw "this should fail";
        });
        it("fails to run List()", async () => {
            try {
                await api.List("USD");
            } catch (e) {
                return;
            }

            throw "this should fail";
        });
        it("fails to run ListAll()", async () => {
            try {
                await api.ListAll();
            } catch (e) {
                return;
            }

            throw "this should fail";
        });
    });
});
