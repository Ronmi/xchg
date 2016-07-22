/// <reference path="../../typings/globals/mocha/index.d.ts" />

import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import OrderForm from "../../src/components/OrderForm";
import { OrderData } from "../../src/types";

describe("<OrderForm />", () => {
    let f = function(data: OrderData) {
    };
    let wrapper = shallow(<OrderForm submitOrder={f} />);
    it("is a form", () => {
	expect(wrapper.is("form")).to.be.true;
    });
    it("has an input named when for time", () => {
	expect(wrapper.find('input[name="when"]')).to.have.length(1);
    });
    it("has an input named local for local currency");
    it("has an input named foreign for foreign currency");
    it("has a select named code for choosing foreign currency type");
    it("has a submit button to submit the order");
    it("emits an submitOrder event when submitting correct order");
    it("contains same OrderData in the event as the data in form");

    describe("failing", () => {
	it("emits an error event when date format is invalid");
	it("emits an error event when both local and foreign currency are positive");
	it("emits an error event when both local and foreign currency are negative");
    });
});
