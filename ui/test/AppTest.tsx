/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/promises-a-plus/index.d.ts" />
/// <reference path="../typings/globals/chai-as-promised/index.d.ts" />

import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import App from "../src/App";
import { OrderData } from "../src/commons";
import FakeAPI from "./FakeAPI";

// use global chai since karma-chai-sinon registers to global scope
let expect = chai.expect;

let helper = {
    emitPincode: function(wrapper: any, pin?: string): Promise<void> {
        if (pin === undefined) {
            pin = "";
        }
        return wrapper.find("AuthForm").prop("submitPincode")(pin);
    },
    emitPincodeError: function(wrapper: any): Promise<void> {
        return wrapper.find("AuthForm").prop("formatError")();
    },
    emitOrder: function(wrapper: any, order: OrderData): Promise<void> {
        return wrapper.find("OrderForm").prop("submitOrder")(order);
    },
    emitOrderError: function(wrapper: any): Promise<void> {
        return wrapper.find("OrderForm").prop("formatError")();
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
        it("authenticates user on submitPincode event", async () => {
            let api = new FakeAPI();
            api.will.success();
            sinon.spy(api, "Auth");
            let wrapper = shallow(<App api={api} alert={() => { } } />);
            await helper.emitPincode(wrapper);
            expect(api.Auth).has.been.calledOnce;
            expect(wrapper.state("authed")).to.be.true;
        });
        it("stays at login form if failed to login", async () => {
            let api = new FakeAPI();
            api.will.fail();
            sinon.spy(api, "Auth");
            let wrapper = shallow(<App api={api} alert={() => { } } />);

	    await expect(helper.emitPincode(wrapper)).to.be.rejected;
            expect(wrapper.state("authed")).to.be.false;
        });
        it("updates order list data after successful authenticating", async () => {
            let api = new FakeAPI();
            api.will.success();
            api.fakeData = [{ when: 1, foreign: 1, local: -1, code: "USD" }];
            sinon.spy(api, "ListAll");
            let wrapper = shallow(<App api={api} alert={() => { } } />);
            await helper.emitPincode(wrapper);
            expect(api.ListAll).has.been.calledOnce;
            expect(wrapper.state("data")).to.deep.equal(api.fakeData);
        });
        it("adds a new order to backend on submitOrder event", async () => {
            let api = new FakeAPI();
            api.will.success();
            sinon.spy(api, "Add");
            let wrapper = shallow(<App api={api} alert={() => { } } />);
            await helper.emitPincode(wrapper); // emulate login
            wrapper.update();

            await helper.emitOrder(wrapper, { when: 1, local: -1, foreign: 1, code: "USD" });
            expect(api.Add).has.been.calledOnce;
        });
        it("updates order list data after new data added", async () => {
            let order = { when: 1, local: -1, foreign: 1, code: "USD" }
            let api = new FakeAPI();
            api.will.success();
            let wrapper = shallow(<App api={api} alert={() => { } } />);
            await helper.emitPincode(wrapper); // emulate login
            wrapper.update();

            api.fakeData = [order];
            await helper.emitOrder(wrapper, order);
            expect(api.fakeData).to.deep.equal(wrapper.state("data"));
        });
	it("will not update order list if new data does not belong to current category", async () => {
            let order = { when: 1, local: -1, foreign: 1, code: "USD" }
            let api = new FakeAPI();
            api.will.success();
	    api.fakeData = [{ when: 1, local: -1, foreign: 1, code: "JPY" }];
            let wrapper = shallow(<App api={api} alert={() => { } } />);

            await helper.emitPincode(wrapper); // emulate login
	    wrapper.update();
	    await helper.emitCode(wrapper, "JPY"); // select JPY
	    wrapper.update();

	    await helper.emitOrder(wrapper, order);
	    wrapper.update();
	    expect(api.fakeData).to.deep.equal(wrapper.state("data"));
	});
        it("remains old order list data if failed to add data", async () => {
            let order = { when: 1, local: -1, foreign: 1, code: "USD" }
            let api = new FakeAPI();
            api.will.success();
            let wrapper = shallow(<App api={api} alert={() => { } } />);
            await helper.emitPincode(wrapper); // emulate login
            wrapper.update();

            api.fakeData = [order];
            api.will.fail();
            await expect(helper.emitOrder(wrapper, order)).to.be.rejected;
            expect(wrapper.state("data")).to.have.length(0);
        });
        it("updates order list data according to codeSelected event", async () => {
            const code = "USD";
            let order = { when: 1, local: -1, foreign: 1, code: code }
            let api = new FakeAPI();
            sinon.spy(api, "List");
            api.will.success();
            let wrapper = shallow(<App api={api} alert={() => { } } />);
            await helper.emitPincode(wrapper); // emulate login
            wrapper.update();

            api.fakeData = [order];
            await helper.emitCode(wrapper, code);
            expect(api.List).calledOnce;
            expect(api.List).calledWith(code);
	});
    });

    describe("error handling", () => {
	it("shows message when pin format error", () => {
	    let spy = sinon.spy();
	    let wrapper = shallow(<App api={new FakeAPI()} alert={spy} />);
	    helper.emitPincodeError(wrapper);
	    expect(spy).has.been.calledOnce;
	});
	it("shows message when order format error", async () => {
	    let spy = sinon.spy();
	    let api = new FakeAPI();
	    let wrapper = shallow(<App api={api} alert={spy} />);

	    await helper.emitPincode(wrapper); // emulate login
	    wrapper.update();

	    await helper.emitOrderError(wrapper);
	    expect(spy).has.been.calledOnce;
	});
    });
});
