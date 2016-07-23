import * as React from "react";
import { OrderData, translate } from "./types";
import AuthForm from "./components/AuthForm";
import OrderForm from "./components/OrderForm";
import CurrencySelector from "./components/CurrencySelector";
import OrderList from "./components/OrderList";

function sorter(a: OrderData, b: OrderData): number {
    return a.when - b.when;
}


interface State {
    token?: string;
    code?: string;
    data?: OrderData[];
}

export default class App extends React.Component<{}, State> {
    constructor(props?: any, context?: any) {
        super(props, context);
        this.state = {
            token: "",
            code: "",
            data: []
        };
    }

    // custom event handlers
    submitPincode(pin: string) {
        $.post({
            url: "/api/auth",
            data: JSON.stringify({ pin: pin }),
            processData: false,
            contentType: "text/plain",
            dataType: "json"
        }).done((token: string) => {
            this.setState({ token: token });
            this.codeSelected(this.state.code);
        });
    }
    submitOrder(order: OrderData) {
        let data = this.state.data;
        this.addOrder(order)
        $.post({
            url: "/api/add",
            data: JSON.stringify({ data: order, token: this.state.token }),
            processData: false,
            contentType: "text/plain; charset=UTF-8",
            dataType: "json"
        }).fail(() => {
            this.setState({ data: data });
        });
    }
    codeSelected(code: string) {
        this.getOrderList(code);
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
    getOrderList(code: string) {
        if (code == translate(code)) {
            this.getAllOrderList();
            return;
        }

        $.post({
            url: "/api/list",
            data: JSON.stringify({ code: code, token: this.state.token }),
            processData: false,
            contentType: "text/plain",
            dataType: "json"
        }).done((data: OrderData[]) => {
            data.sort(sorter);
            this.setState({ code: code, data: data });
        });
    }
    getAllOrderList() {
        $.post({
            url: "/api/listall",
            data: JSON.stringify({ token: this.state.token }),
            contentType: "text/plain",
            dataType: "json"
        }).done((data: OrderData[]) => {
            data.sort(sorter);
            this.setState({ code: "", data: data });
        });
    }

    render() {
        if (this.state.token === "") {
            return (<AuthForm submitPincode={this.submitPincode.bind(this)} error={alert} />);
        }

        return (
            <div>
                <OrderForm submitOrder={this.submitOrder.bind(this)} error={alert} />
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
