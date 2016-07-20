/// <reference path="../../typings/globals/mocha/index.d.ts" />

import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import OrderListEntry from "../../src/components/OrderListEntry";
import { translate } from "../../src/types";

describe("<OrderListEntry />", () => {
    const date = "2016/07/21 00:00:00";
    let d = new Date(date);
    let data = {when: d.getTime()/1000, local: -3300, foreign: 100, code: "USD"};
    let wrapper = shallow(<OrderListEntry data={data} />);

    it("has a tr with 5 td.", () => {
        expect(wrapper.find("tr")).to.have.length(1);
        expect(wrapper.find("td")).to.have.length(5);
        expect(wrapper.find("tr td")).to.have.length(5);
    });

    describe("time column", () => {
        let t = wrapper.find("td.time");

        it("exists.", () => {
            expect(t).to.have.length(1);
        });
        it("contains correct time.", () => {
            expect(t.text()).to.equal(date);
        });
    });

    describe("currency name", () => {
        let t = wrapper.find("td.currency");

        it("exists.", () => {
            expect(t).to.have.length(1);
        });
        it("contains correct translation.", () => {
            expect(t.text()).to.equal(translate(data.code));
        });
    });

    describe("foreign currency column", () => {
        let t = wrapper.find("td.foreign");

        it("exists.", () => {
            expect(t).to.have.length(1);
        });
        it("contains correct number.", () => {
            expect(t.text()).to.equal("100.00");
        });
    });

    describe("local currency column", () => {
        let t = wrapper.find("td.local");

        it("exists.", () => {
            expect(t).to.have.length(1);
        });
        it("contains correct number.", () => {
            expect(t.text()).to.equal("-3300");
        });
        it("denotes a negative number.", () => {
            expect(t.hasClass("negative")).to.be.true;
        });
    });

    describe("exchange rate column", () => {
        let t = wrapper.find("td.rate");

        it("exists.", () => {
            expect(t).to.have.length(1);
        });
        it("contains correct exchange rate.", () => {
            expect(t.text()).to.equal("33.0000");
        });
    });
});
