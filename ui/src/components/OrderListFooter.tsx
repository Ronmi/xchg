import * as React from "react";
import { OrderData, translate, formatNumber } from "../types";

interface Props {
    code: string;
    data: OrderData[];
}

interface summary {
    total: number;
    rate: number;
}

export default class OrderListFooter extends React.Component<Props, {}> {
    render() {
        let s = this.rate();
        if (s.total === 0 || s.rate === 0) {
            return null;
        }
        return (
            <tfoot>
                <tr>
                    <td colspan="5">持有量及平均匯率: {formatNumber(s.total, 2)} / {formatNumber(s.rate, 4)}</td>
                </tr>
            </tfoot>
        );
    }

    rate(): summary {
        // 全部列表時總持有量和持有平均匯率是沒有意義的
        if (this.props.code === translate(this.props.code)) {
            return { total: 0, rate: 0 };
        }

        let total = 0;
        let rate = 0;

        for (let o of this.props.data) {
            if (o.local < 0) {
                // 只計算買外幣的部份，因為外幣脫手時不會影響持有平均匯率
                rate = (total * rate - o.local) / (total + o.foreign);
            }

            total += o.foreign;

            // 持有量歸零的時候平均成本也應該歸零
            if (total <= 0) {
                rate = 0;
            }
        }

        return { total: total, rate: rate };
    }
}
