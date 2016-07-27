/// <reference path="../../typings/globals/mocha/index.d.ts" />

import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import CurrencySelector from "../../src/components/CurrencySelector";
import { T } from "../../src/commons";

function check_option_count(wrapper: any, data: { [key: string]: string }) {
    return () => {
        let length = 0;
        for (let key in data) length++;

        expect(wrapper.find("select > option")).to.have.length(length);
        expect(wrapper.find("option")).to.have.length(length);
    };
}

function check_option_value(wrapper: any, data: { [key: string]: string }) {
    return () => {
        for (let code in data) {
            let t = wrapper.find('option[value="' + code + '"]');
            expect(t).to.have.length(1);
            expect(t.text()).to.equal(data[code]);
        }
    };
}

function optionsToDictionary(wrapper: any): { [key: string]: string } {
    let ret = {} as { [key: string]: string };

    wrapper.find("option").forEach((n: any) => {
        ret[n.prop("value")] = n.text();
    });
    return ret;
}

describe("<CurrencySelector />", () => {
    it("is a select", () => {
        let wrapper = shallow(<CurrencySelector codeSelected={(c: string) => { } } />);
        expect(wrapper.is("select")).to.be.true;
    });

    it("emits a codeSelected event once changed", () => {
        let mySpy = sinon.spy();
        let wrapper = shallow(<CurrencySelector codeSelected={mySpy} />);

        wrapper.find("select").simulate("change", { target: { value: "" } });
        expect(mySpy).has.been.calledOnce;
    });

    let t = function() {
        let wrapper = shallow(<CurrencySelector codeSelected={(c: string) => { } } />);
        let actual = optionsToDictionary(wrapper);

        expect(actual).to.deep.equal(T);
    };
    it("defaults to render supported currency types to options", t);
    it("ignores *defaultValue* if *defaultLabel* is not passed", t);

    it("renders currency types and addition undefined=>label to options with only *defaultLabel*", () => {
        let wrapper = shallow(<CurrencySelector codeSelected={(c: string) => { } } defaultLabel="label" />);
        let data = T;
        let key: string;
        data[key] = "label";

        let actual = optionsToDictionary(wrapper);
        expect(actual).to.deep.equal(data);
    });

    it("renders currency types and additionl value=>label to options", () => {
        let wrapper = shallow(<CurrencySelector codeSelected={(c: string) => { } } defaultLabel="label" defaultValue="value" />);
        let data = T;
        data["value"] = "label";

        let actual = optionsToDictionary(wrapper);
        expect(actual).to.deep.equal(data);
    });
});
