/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />

import * as React from "react";
import { shallow } from "enzyme";
import OrderForm from "../../src/components/OrderForm";
import { OrderData } from "../../src/types";

// use global chai since karma-chai-sinon registers to global scope
let expect = chai.expect;

describe("<OrderForm />", () => {
    let d = "2016/07/23 00:00:00";
    let when = Math.floor(Date.parse(d)/1000);
    let f = function(data: OrderData) {
    };
    let wrapper = shallow(<OrderForm submitOrder={f} />);
    it("is a form", () => {
	expect(wrapper.is("form")).to.be.true;
    });
    it("has an input named when for time", () => {
	expect(wrapper.find('input[name="when"]')).to.have.length(1);
    });
    it("has an input named local for local currency", () => {
    	expect(wrapper.find('input[name="local"]')).to.have.length(1);
    });
    it("has an input named foreign for foreign currency", () => {
    	expect(wrapper.find('input[name="foreign"]')).to.have.length(1);
    });
    it("has a currency selector for choosing foreign currency type", () => {
	expect(wrapper.find('CurrencySelector')).to.have.length(1);
    });
    it("has a submit button to submit the order", () => {
	expect(wrapper.find('button[type="submit"]')).to.have.length(1);
    });

    describe("submitOrder event", () => {
	let myspy = sinon.spy(f);
	let wrapper = shallow(<OrderForm submitOrder={myspy} />);
	let ok = {
	    when: when,
	    local: -3300,
	    foreign: 100,
	    code: "USD"
	};

	// simulates filling correct data
	wrapper.find('input[name="when"]').simulate("change", {target: {value: d}});
	wrapper.find('input[name="local"]').simulate("change", {target: {value: "-3300"}});
	wrapper.find('input[name="foreign"]').simulate("change", {target: {value: "100"}});
	wrapper.find('CurrencySelector').prop("codeSelected")("USD");

	// simulates submitting
	wrapper.find("form").simulate("submit", {preventDefault: function(){}});
	it("is emitted when submitting correct order", () => {
	    expect(myspy.called).to.be.true;
	});
	it("contains same OrderData as the data in form", () => {
	    expect(myspy).to.have.been.calledWithMatch(ok);

	});
    });

    describe("failing", () => {
	it("emits an error event when date format is invalid");
	it("emits an error event when both local and foreign currency are positive");
	it("emits an error event when both local and foreign currency are negative");
    });
});
