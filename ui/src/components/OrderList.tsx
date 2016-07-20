import * as React from "react";
import { OrderData, translate } from "../types";
import OrderListEntry from "./OrderListEntry";
import OrderListFooter from "./OrderListFooter";

interface Props {
    code: string,
    data: OrderData[];
}

export default class OrderList extends React.Component<Props, {}> {
    render() {
        let nodes = this.props.data.map(function(val: OrderData) {
            return <OrderListEntry data={val} />;
        });

        return (
            <div class="list">
                <table cellspacing="0">
                    <caption>{translate(this.props.code)}交易記錄</caption>
                    <thead>
                        <tr>
                            <th>交易時間</th>
                            <th>幣別</th>
                            <th>金額</th>
                            <th>成本</th>
                            <th>匯率</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nodes}
                    </tbody>
                    <OrderListFooter code={this.props.code} data={this.props.data} />
                </table>
            </div>
        );
    }
}
