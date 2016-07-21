/// <reference path="../../typings/globals/mocha/index.d.ts" />

import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import OrderListFooter from "../../src/components/OrderListFooter";

describe("<OrderListFooter />", () => {
    let code = "USD";
    let when = Math.floor((new Date("2016/07/21 00:00:00")).getTime()/1000);
    let data = [{when: when+0, code: code, foreign: 100, local: -3300}];

    describe("structure", () => {
	let wrapper = shallow(<OrderListFooter code={code} data={data} />);
	it("is a table footer.", () => {
	    expect(wrapper.is("tfoot")).to.be.true; 
	});
	it("has only one big column.", () => {
	    let td = wrapper.find("tfoot tr td");
	    expect(td).to.have.length(1);
	    expect(td.prop("colSpan")).to.equal("5");
	});
    });

    describe("visibility", () => {
	it("hides when code is invalid.", () => {
	    let data = [{when: when+0, code: "QAQ", foreign: 100, local: -3300}];
	    let wrapper = shallow(<OrderListFooter code="QAQ" data={data} />);
	    expect(wrapper.is("tfoot")).to.be.false;
	});
	it("hides when no data.", () => {
	    let wrapper = shallow(<OrderListFooter code="USD" data={[]} />);
	    expect(wrapper.is("tfoot")).to.be.false;
	});
	it("hides when you sell all your foreign currency.", () => {
	    let data = [
		{when: when+0, code: code, foreign: 100, local: -3300},
		{when: when+1, code: code, foreign: -100, local: 3300},
	    ];
	    let wrapper = shallow(<OrderListFooter code={code} data={[]} />);
	    expect(wrapper.is("tfoot")).to.be.false;
	});
    });

    describe("rate computing", () => {
	it("computes correctly with only buy records.", () => {
	    let data = [
		{when: when+0, code: code, foreign: 100, local: -3300},
		{when: when+1, code: code, foreign: 100, local: -3200},
	    ];
	    let c = shallow(<OrderListFooter code={code} data={data} />).instance() as OrderListFooter;
	    let summary = c.rate();
	    expect(summary.total).to.equal(200);
	    expect(summary.rate).to.equal(32.5);
	});
	it("computes correctly with both buy and sell records.", () => {
	    let data = [
		{when: when+0, code: code, foreign: 100, local: -3300},
		{when: when+1, code: code, foreign: 100, local: -3200},
		{when: when+2, code: code, foreign: -100, local: 3400},
		{when: when+3, code: code, foreign: 100, local: -3200},
	    ];
	    let c = shallow(<OrderListFooter code={code} data={data} />).instance() as OrderListFooter;
	    let summary = c.rate();
	    expect(summary.total).to.equal(200);
	    expect(summary.rate).to.equal(32.25);
	});
	it("becomes 0 if you sell all currency.", () => {
	    let data = [
		{when: when+0, code: code, foreign: 100, local: -3300},
		{when: when+2, code: code, foreign: -100, local: 3400},
	    ];
	    let c = shallow(<OrderListFooter code={code} data={data} />).instance() as OrderListFooter;
	    let summary = c.rate();
	    expect(summary.total).to.equal(0);
	    expect(summary.rate).to.equal(0);
	});
	it("ignores old rates after sell all currency.", () => {
	    let data = [
		{when: when+0, code: code, foreign: 100, local: -3300},
		{when: when+2, code: code, foreign: -100, local: 3400},
		{when: when+3, code: code, foreign: 100, local: -3200},
	    ];
	    let c = shallow(<OrderListFooter code={code} data={data} />).instance() as OrderListFooter;
	    let summary = c.rate();
	    expect(summary.total).to.equal(100);
	    expect(summary.rate).to.equal(32);
	});
    });
});
