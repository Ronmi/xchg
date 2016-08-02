import * as React from "react";
import { OrderData, translate } from "./commons";
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
    alert: (msg: string) => void;
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
    submitPincode = async (pin: string): Promise<void> => {
        try {
	    await this.props.api.Auth(pin);
            this.setState({ authed: true });
	    try {
		await this.codeSelected(this.state.code);
	    } catch (e) {
	    }
	} catch (e) {
            this.props.alert("認證失敗");
	    throw e;
        }
    }
    submitOrder = async (order: OrderData): Promise<void> => {
        let data = this.state.data.slice(0);
        this.addOrder(order)
        try {
	    await this.props.api.Add(order);
	} catch (e) {
            this.setState({ data: data });
	    throw e;
        }
    }
    codeSelected = async (code: string): Promise<void> => {
        return await this.getOrderList(code);
    }

    // helper methods
    addOrder(order: OrderData) {
        if (order.code !== this.state.code && this.state.code !== "") {
            return;
        }

        let data = this.state.data.slice(0);
        data.push(order);
        data.sort(sorter);
        this.setState({ data: data });
    }
    async getOrderList(code: string): Promise<void> {
        if (code == translate(code)) {
            return this.getAllOrderList();
        }

        let data = await this.props.api.List(code);
        data.sort(sorter);
        this.setState({ code: code, data: data });
    }
    async getAllOrderList(): Promise<void> {
        let data = await this.props.api.ListAll();
        data.sort(sorter);
        this.setState({ code: "", data: data });
    }

    handlePinFormatError = () => {
        this.props.alert("PIN 碼格式錯誤，必須是六位數字");
    }
    handleOrderFormatError = () => {
        this.props.alert("格式錯誤，請重新確認");
    }

    render() {
        if (!this.state.authed) {
            return (
                <div>
                    <AuthForm
                        submitPincode={this.submitPincode}
                        formatError={this.handlePinFormatError} />
                </div>
            );
        }

        return (
            <div>
                <OrderForm
                    submitOrder={this.submitOrder}
                    formatError={this.handleOrderFormatError} />
                <div className="list-type">
                    <CurrencySelector
                        codeSelected={this.codeSelected}
                        defaultLabel="全部"
                        defaultValue="ALL" />
                </div>
                <OrderList code={this.state.code} data={this.state.data} />
            </div>
        );
    }
}
