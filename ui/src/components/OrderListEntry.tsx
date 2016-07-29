import * as React from "react";
import { OrderData, translate, formatNumber, convertTime } from "../commons";

interface Props {
    data: OrderData;
}

export default class OrderListEntry extends React.Component<Props, {}> {
    render() {
        let foreign = this.isNegClass(this.props.data.foreign);
        if (foreign !== "") {
            foreign += " ";
        }
        foreign += "foreign";
        let local = this.isNegClass(this.props.data.local);
        if (local !== "") {
            local += " ";
        }
        local += "local";
        let rate = -this.props.data.local / this.props.data.foreign;

        return (
            <tr>
                <td className="time">{convertTime(this.props.data.when)}</td>
                <td className="currency">{translate(this.props.data.code)}</td>
                <td className={foreign}>{formatNumber(this.props.data.foreign, 2)}</td>
                <td className={local}>{this.props.data.local}</td>
                <td className="rate">{formatNumber(rate, 4)}</td>
            </tr>
        );
    }

    isNegClass(val: number): string {
        if (val < 0) {
            return "negative";
        }
	return "";
    }
}
