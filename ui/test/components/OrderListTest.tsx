/// <reference path="../../typings/globals/mocha/index.d.ts" />

import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import OrderList from "../../src/components/OrderList";
import OrderListEntry from "../../src/components/OrderListEntry";
import OrderListFooter from "../../src/components/OrderListFooter";

describe("<OrderList />", () => {
    let d = "2016/07/22 00:00:00";
    let when = Date.parse(d) / 1000;

    it("contains only one table", () => {
        let wrapper = shallow(<OrderList code="" data={[]} />);
        expect(wrapper.find("table")).to.have.length(1);
    });

    describe("table structure", () => {
        let wrapper = shallow(<OrderList code="" data={[]} />);
        it("contains a valid caption in the table", () => {
            expect(wrapper.find("table > caption")).to.have.length(1);
            expect(wrapper.find("table caption")).to.have.length(1);
        });
        it("has a valid header", () => {
            expect(wrapper.find("table > thead")).to.have.length(1);
            expect(wrapper.find("table thead")).to.have.length(1);
        });
        it("has 5 header columns", () => {
            expect(wrapper.find("table thead th")).to.have.length(5);
        });
        it("has a valid body", () => {
            expect(wrapper.find("table > tbody")).to.have.length(1);
            expect(wrapper.find("table tbody")).to.have.length(1);
        });
        it("has a valid <OrderListFooter />", () => {
            expect(wrapper.find("table > OrderListFooter")).to.have.length(1);
            expect(wrapper.find("table OrderListFooter")).to.have.length(1);
        });
    });

    describe("body", () => {
        it("should be empty when no data", () => {
            let wrapper = shallow(<OrderList code="" data={[]} />);
            expect(wrapper.find("tbody").children()).to.have.length(0);
        });
        it("should contains same number of entries compare to data", () => {
            let code = "USD";
            let data = [
                { when: when + 0, code: code, foreign: 10, local: -10 },
                { when: when + 1, code: code, foreign: 10, local: -10 },
            ];
            let wrapper = shallow(<OrderList code={code} data={data} />);

            expect(wrapper.find("tbody").children()).to.have.length(data.length);
            expect(wrapper.find("tbody").children().every("OrderListEntry")).to.be.true;
        });
    });
});
