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

    // custom event handlers
    submitPincode(pin: string) {
	this.props.api.Auth(pin).then(
	    () => {
		this.setState({authed: true});
		this.codeSelected(this.state.code);
	    },
	    () => {
		this.props.errHandler("認證失敗");
	    }
	);
    }
    submitOrder(order: OrderData) {
        let data = this.state.data;
        this.addOrder(order)
	this.props.api.Add(order).then(
	    () => { /* do nothing */ },
	    () => {
		this.setState({ data: data });
	    }
	);
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

	this.props.api.List(code).then(
	    (data: OrderData[]) => {
		data.sort(sorter);
		this.setState({ code: code, data: data });
	    }
	);
    }
    getAllOrderList() {
	this.props.api.ListAll().then(
	    (data: OrderData[]) => {
		data.sort(sorter);
		this.setState({ code: "", data: data });
	    }
	);
    }

    render() {
        if (!this.state.authed) {
            return (
		<AuthForm
		    submitPincode={this.submitPincode.bind(this)}
		    error={this.props.errHandler} />
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
