import * as React from "react";
import { OrderData, translate, formatNumber } from "../types";

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
                <td className="time">{this.convertTime(this.props.data.when)}</td>
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
    }
    formatTime(t: number): string {
        if (t < 10) {
            return "0" + t;
        }
        return String(t);
    }
    convertTime(t: number): string {
        let d = new Date(t * 1000);
        let ret = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
        ret += " " + this.formatTime(d.getHours());
        ret += ":" + this.formatTime(d.getMinutes());
        ret += ":" + this.formatTime(d.getSeconds());
        return ret;
    }

}
