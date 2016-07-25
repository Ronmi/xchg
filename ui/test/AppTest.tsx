/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/es6-shim/index.d.ts" />

import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import App from "../src/App";
import { OrderData } from "../src/types";
import FakeAPI from "./FakeAPI";

// use global chai since karma-chai-sinon registers to global scope
let expect = chai.expect;
let check = function(done: any, cb: Function): () => void {
    return () => {
        try {
            cb();
            done();
        } catch (e) {
            done(e);
        }
    };
};

let helper = {
    emitPincode: function(wrapper: any, pin?: string): Promise<void> {
        if (pin === undefined) {
            pin = "";
        }
        return wrapper.find("AuthForm").prop("submitPincode")(pin);
    },
    emitOrder: function(wrapper: any, order: OrderData): Promise<void> {
        return wrapper.find("OrderForm").prop("submitOrder")(order);
    },
    emitCode: function(wrapper: any, code?: string): Promise<void> {
        if (code === undefined) {
            code = "";
        }
        return wrapper.find("CurrencySelector").prop("codeSelected")(code);
    },
};

describe("<App />", () => {
    describe("structure", () => {
        it("shows only AuthForm if not logged in", () => {
            let api = new FakeAPI();
            let wrapper = shallow(<App api={api} alert={() => { } } />);
            expect(wrapper.find("AuthForm")).to.have.length(1);
        });
        it("shows OrderForm, CurrencySelector and OrderList after loggedin", () => {
            let api = new FakeAPI();
            let wrapper = shallow(<App api={api} alert={() => { } } />);
            wrapper.setState({ authed: true, code: "", data: [] });
            wrapper.update();
            expect(wrapper.find("OrderForm")).to.have.length(1);
            expect(wrapper.find("CurrencySelector")).to.have.length(1);
            expect(wrapper.find("OrderList")).to.have.length(1);
        });
    });

    describe("logic", () => {
        it("authenticates user on submitPincode event", (done) => {
            let api = new FakeAPI();
            api.will.success();
            sinon.spy(api, "Auth");
            let wrapper = shallow(<App api={api} alert={() => { } } />);
            helper.emitPincode(wrapper).then(
                check(done, () => {
                    expect(api.Auth).has.been.calledOnce;
                    expect(wrapper.state("authed")).to.be.true;
                }),
                () => { done(new Error("Unexpected error occurs with api.Auth")); }
            );
        });
        it("stays at login form if failed to login", (done) => {
            let api = new FakeAPI();
            api.will.fail();
            sinon.spy(api, "Auth");
            let wrapper = shallow(<App api={api} alert={() => { } } />);
            helper.emitPincode(wrapper).then(
                () => { done(new Error("Unexpected api success with api.Auth")); },
                check(done, () => {
                    expect(wrapper.state("authed")).to.be.false;
                })
            );
        });
        it("updates order list data after successful authenticating", (done) => {
            let api = new FakeAPI();
            api.will.success();
            api.fakeData = [{ when: 1, foreign: 1, local: -1, code: "USD" }];
            sinon.spy(api, "ListAll");
            let wrapper = shallow(<App api={api} alert={() => { } } />);
            helper.emitPincode(wrapper).then(
                check(done, () => {
                    expect(api.ListAll).has.been.calledOnce;
                    expect(wrapper.state("data")).to.deep.equal(api.fakeData);
                }),
                () => { done(new Error("Unexpected error occurs with api.Auth")); }
            );
        });
        it("adds a new order to backend on submitOrder event", (done) => {
            let api = new FakeAPI();
            api.will.success();
            sinon.spy(api, "Add");
            let wrapper = shallow(<App api={api} alert={() => { } } />);
            helper.emitPincode(wrapper).then(
                check(done, () => {
                    wrapper.update();
                    let check = function() {
                        expect(api.Add).has.been.calledOnce;
                    };
                    helper.emitOrder(wrapper, { when: 1, local: -1, foreign: 1, code: "USD" }).then(
                        check, check
                    );
                }),
                () => { done(new Error("Unexpected error occurs with api.Auth")); }
            );
        });
        it("updates order list data after new data added", (done) => {
            let order = { when: 1, local: -1, foreign: 1, code: "USD" }
            let api = new FakeAPI();
            api.will.success();
            let wrapper = shallow(<App api={api} alert={() => { } } />);
            helper.emitPincode(wrapper).then(
                check(done, () => {
                    wrapper.update();
                    api.fakeData = [order];
                    helper.emitOrder(wrapper, order).then(
                        () => {
                            expect(api.fakeData).to.deep.equal(wrapper.state("data"));
                        },
                        () => { done(new Error("Unexpected error occurs with api.Add")); }
                    );
                }),
                () => { done(new Error("Unexpected error occurs with api.Auth")); }
            );
        });
        it("remains old order list data if failed to add data", (done) => {
            let order = { when: 1, local: -1, foreign: 1, code: "USD" }
            let api = new FakeAPI();
            api.will.success();
            let wrapper = shallow(<App api={api} alert={() => { } } />);
            helper.emitPincode(wrapper).then(
                () => {
                    wrapper.update();
                    api.fakeData = [order];
                    api.will.fail();
                    helper.emitOrder(wrapper, order).then(
                        () => { done(new Error("Unexpected success with api.Add")); },
                        check(done, () => {
                            expect(wrapper.state("data")).to.have.length(0);
                        })
                    );
                },
                () => { done(new Error("Unexpected error occurs with api.Auth")); }
            );
        });
        it("updates order list data according to codeSelected event", (done) => {
            const code = "USD";
            let order = { when: 1, local: -1, foreign: 1, code: code }
            let api = new FakeAPI();
            sinon.spy(api, "List");
            api.will.success();
            let wrapper = shallow(<App api={api} alert={() => { } } />);
            helper.emitPincode(wrapper).then(
                () => {
                    wrapper.update();
                    api.fakeData = [order];
                    helper.emitCode(wrapper, code).then(
                        check(done, () => {
                            expect(api.List).calledOnce;
                            expect(api.List).calledWith(code);
                        }),
                        () => { done(new Error("Unexpected error occured with api.List")); }
                    );
                },
                () => { done(new Error("Unexpected error occurs with api.Auth")); }
            );
        });
    });
});
