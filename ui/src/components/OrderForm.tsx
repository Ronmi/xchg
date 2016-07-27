import * as React from "react";
import { OrderData, translate, convertTime } from "../commons";
import CurrencySelector from "./CurrencySelector";

interface State {
    when?: string;
    local?: number;
    foreign?: number;
    code?: string;
}

interface Props {
    submitOrder: (order: OrderData) => void;
    formatError?: () => void;
}

export default class OrderForm extends React.Component<Props, State> {
    constructor(props?: Props, context?: any) {
        super(props, context);
        this.state = {
            when: "",
            local: 0,
            foreign: 0,
            code: ""
        };
    }

    setWhen = (e: Event) => {
        this.setState({ when: (e.target as HTMLInputElement).value });
    }
    setLocal = (e: Event) => {
        this.setState({ local: Number((e.target as HTMLInputElement).value) });
    }
    setForeign = (e: Event) => {
        this.setState({ foreign: Number((e.target as HTMLInputElement).value) });
    }
    setCode = (code: string) => {
        this.setState({ code: code });
    }
    updateTime = () => {
	this.setState({when: convertTime((new Date()).getTime()/1000)});
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <fieldset>
                    <legend>新增</legend>
                    <label htmlFor="date">
                        <span>交易時間 <span onClick={this.updateTime}>(NOW)</span></span>
                        <input name="when" type="datetime" onChange={this.setWhen} value={this.state.when} placeholder="年/月/日 時:分:秒"/>
                    </label>
                    <label htmlFor="local">
                        <span>成本(買入為負)</span>
                        <input name="local" type="number" step="0.01" onChange={this.setLocal} />
                    </label>
                    <div className="foreign">
                        <label htmlFor="foreign">
                            <span>金額(買入為正)</span>
                            <input name="foreign" type="number" step="0.01" onChange={this.setForeign} />
                        </label>
                        <label htmlFor="currency">
                            <span>幣別</span>
                            <CurrencySelector codeSelected={this.setCode} defaultLabel="請選擇" />
                        </label>
                    </div>
                    <button type="submit">送出</button>
                </fieldset>
            </form>
        );
    }

    validateForm(): OrderData {
        let d = Date.parse(this.state.when);
        if (isNaN(d)) {
            return null;
        }

        let v = this.state.local * this.state.foreign;
        if (v >= 0) {
            return null;
        }

        if (translate(this.state.code) === this.state.code) {
            return null;
        }

        return {
            when: Math.floor(d / 1000),
            local: this.state.local,
            foreign: this.state.foreign,
            code: this.state.code
        };
    }

    handleSubmit = (e: Event) => {
        e.preventDefault();
        let data = this.validateForm();
        if (data === null) {
            this.props.formatError();
            return;
        }

        this.props.submitOrder(data);
    }
}
