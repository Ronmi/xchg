import { OrderData, T } from "./types";

const template = `
<div class="list">
  <table cellspacing="0">
    <caption>{{translate(orderType)}}交易記錄</caption>
    <thead>
      <tr>
        <th>交易時間</th>
        <th>幣別</th>
        <th>金額</th>
        <th>成本</th>
        <th>匯率</th>
      </tr>
    </thead>
    <tbody v-cloak>
      <tr v-for="order of orders" track-by="when" transition="fade">
        <td class="time">{{convertTime(order.when)}}</td>
        <td class="currency">{{order.code | translate}}</td>
        <td class="foreign" :class="isNegClass(order.foreign)">{{order.foreign | floatFormat 2}}</td>
        <td class="local" :class="isNegClass(order.local)">{{order.local | floatFormat 2}}</td>
        <td class="rate">{{-(order.local/order.foreign) | floatFormat 4}}</td>
      </tr>
    </tbody>
    <tfoot v-show="rate[0] > 0 && rate[1] > 0">
      <tr>
        <td colspan="5">持有量及平均匯率: {{rate[0]}} / {{rate[1] | floatFormat 4}}</td>
      </tr>
    </tfoot>
  </table>
</div>
`;

Vue.component("order-list", {
    template: template,
    props: ["orderType", "orders"],
    computed: {
        rate: function(): number[] {
            // 全部列表時總持有量和持有平均匯率是沒有意義的
            if (this.orderType === "") {
                return [0, 0];
            }

            let total = 0;
            let rate = 0;

            for (let o of this.orders) {
                if (o.local < 0) {
                    // 只計算買外幣的部份，因為外幣脫手時不會影響持有平均匯率
                    rate = (total * rate - o.local) / (total + o.foreign);
                }

                total += o.foreign;
            }

            return [total, rate];
        }
    },
    methods: {
        translate: function(code: string): string {
            if (code === "") {
                return "";
            }

            return T[code];
        },
        isNegClass: function(val: number): string {
            if (val < 0) {
                return "negative";
            }
        },
        formatTime: function(t: number): string {
            if (t < 10) {
                return "0" + t;
            }
            return String(t);
        },
        convertTime: function(t: number): string {
            let d = new Date(t * 1000);
            let ret = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
            ret += " " + this.formatTime(d.getHours());
            ret += ":" + this.formatTime(d.getMinutes());
            ret += ":" + this.formatTime(d.getSeconds());
            return ret;
        }
    }
});
