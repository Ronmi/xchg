/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />

import * as React from "react";
import { shallow } from "enzyme";
import AuthForm from "../../src/components/AuthForm";

// use global chai since karma-chai-sinon registers to global scope
let expect = chai.expect;

describe("<AuthForm />", () => {
    let wrapper = shallow(<AuthForm submitPincode={() => {}} formatError={() => {}} />);
    it("is a form", () => {
	expect(wrapper.is("form")).to.be.true;
    });
    it("has a input named pin for pin code", () => {
	expect(wrapper.find('input[name="pin"]')).to.have.length(1);
    });
    it("has a submit button", () => {
	expect(wrapper.find('button[type="submit"]')).to.have.length(1);
    });
    it("emits submitPincode event when submitting 6 digit", () => {
	let s = sinon.spy();
	let wrapper = shallow(<AuthForm submitPincode={s} formatError={() => {}} />);
	wrapper.find('input[name="pin"]').simulate("change", {target: {value: 123456}});
	wrapper.find("form").simulate("submit", {preventDefault: function(){}});

	expect(s).to.be.calledOnce;
    });
    it("emits only error event when submitting wrong format", () => {
	let s = sinon.spy();
	let e = sinon.spy();
	let wrapper = shallow(<AuthForm submitPincode={s} formatError={e} />);
	wrapper.find('input[name="pin"]').simulate("change", {target: {value: 1234567}});
	wrapper.find("form").simulate("submit", {preventDefault: function(){}});

	expect(s).not.to.be.called;
	expect(e).to.be.calledOnce;
    });
});
