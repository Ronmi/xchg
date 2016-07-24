/// <reference path="../typings/globals/es6-shim/index.d.ts" />

import * as React from "react";
import { OrderData, translate } from "./types";
import AuthForm from "./components/AuthForm";
import OrderForm from "./components/OrderForm";
import CurrencySelector from "./components/CurrencySelector";
import OrderList from "./components/OrderList";
import API from "./API"

function sorter(a: OrderData, b: OrderData): number {
    return a.when - b.when;
}

interface Props {
    api: API;
    errHandler: (msg: string) => void;
}

interface State {
    authed?: boolean;
    code?: string;
    data?: OrderData[];
}

export default class App extends React.Component<Props, State> {
    constructor(props?: any, context?: any) {
        super(props, context);
        this.state = {
            authed: false,
            code: "",
            data: []
        };
    }

    // custom event handlers, returns promise so we can test on it
    submitPincode(pin: string): Promise<void> {
        return new Promise<void>((res, rej) => {
            this.props.api.Auth(pin).then(
                () => {
                    this.setState({ authed: true });
                    this.codeSelected(this.state.code).then(() => { res(); }, () => { res(); });
                },
                () => {
                    this.props.errHandler("認證失敗");
                    rej();
                }
            );
        });
    }
    submitOrder(order: OrderData): Promise<void> {
        let data = this.state.data;
        this.addOrder(order)
        return new Promise<void>((res, rej) => {
            this.props.api.Add(order).then(
                () => { res(); },
                () => {
                    this.setState({ data: data });
                    rej();
                }
            );
        });
    }
    codeSelected(code: string): Promise<void> {
        return this.getOrderList(code);
    }

    // helper methods
    addOrder(order: OrderData) {
        if (order.code !== this.state.code) {
            return;
        }

        let data = this.state.data;
        data.push(order);
        data.sort(sorter);
        this.setState({ data: data });
    }
    getOrderList(code: string): Promise<void> {
        if (code == translate(code)) {
            return this.getAllOrderList();
        }

        return new Promise<void>((res, rej) => {
            this.props.api.List(code).then(
                (data: OrderData[]) => {
                    data.sort(sorter);
                    this.setState({ code: code, data: data });
                    res();
                },
                () => { rej(); }
            );
        });
    }
    getAllOrderList(): Promise<void> {
        return new Promise<void>((res, rej) => {
            this.props.api.ListAll().then(
                (data: OrderData[]) => {
                    data.sort(sorter);
                    this.setState({ code: "", data: data });
                    res();
                },
                () => { rej(); }
            );
        });
    }

    render() {
        if (!this.state.authed) {
            return (
                <div>
                    <AuthForm
                        submitPincode={this.submitPincode.bind(this)}
                        error={this.props.errHandler} />
                </div>
            );
        }

        return (
            <div>
                <OrderForm
                    submitOrder={this.submitOrder.bind(this)}
                    error={this.props.errHandler} />
                <div className="list-type">
                    <CurrencySelector
                        codeSelected={this.codeSelected.bind(this)}
                        defaultLabel="全部"
                        defaultValue="ALL" />
                </div>
                <OrderList code={this.state.code} data={this.state.data} />
            </div>
        );
    }
}
