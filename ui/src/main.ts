import { OrderData, T } from "./types";
import "./components/OrderList";
import "./jsxdef";

Vue.filter("floatFormat", (val: number, size: number): string => {
    size = Math.floor(Math.abs(size));
    let x = Math.pow(10, size);
    let str = Math.round(val * x) + "";

    while (str.length < size) {
        str = "0" + str;
    }

    let l = str.length;
    if (l === size) {
        return "0." + str;
    }

    return str.substr(0, l - size) + "." + str.substr(l - size, size);
});

Vue.filter("translate", (code: string): string => {
    return T[code];
});

let vm = new Vue({
    el: "#app",
    data: {
        T: T,
        form: {
            when: "",
            local: 0,
            foreign: 0,
            code: "USD"
        },
        orders: [] as OrderData[],
        orderType: ""
    },
    methods: {
        sortOrders: function() {
            this.orders.sort(function(a: OrderData, b: OrderData) {
                return a.when - b.when;
            });
        },
        getOrders: function() {
            if (this.orderType === "") {
                this.getAllOrders();
                return;
            }

            $.post({
                url: "/api/list",
                data: JSON.stringify({ code: this.orderType }),
                processData: false,
                contentType: "text/plain",
                dataType: "json"
            }).done((data: any) => {
                console.log(data);
                this.$data.orders = data as OrderData[];
                this.sortOrders();
            });
        },
        getAllOrders: function() {
            let vm = this;
            $.getJSON("/api/listall", {}, (data: any, status: string, xhr: JQueryXHR) => {
                this.orders = data as OrderData[];
                vm.sortOrders();
            });
        },
        validateForm: function(): OrderData {
            let d: number;
            try {
                d = Date.parse(this.form.when);
            } catch (e) {
                return null;
            }
            console.log(this.form.when + " is " + d);

            let v = this.form.local * this.form.foreign;
            if (v >= 0) {
                return null;
            }

            if (!T[this.form.code]) {
                return null;
            }

            return {
                when: Math.floor(d / 1000),
                local: Number(this.form.local),
                foreign: Number(this.form.foreign),
                code: this.form.code
            };
        },
        addOrder: function() {
            let data = this.validateForm();
            if (data == null) {
                alert("格式錯誤"); // alert, 爛透惹ㄦ
                return;
            }
            let vm = this;
            $.post({
                url: "/api/add",
                data: JSON.stringify(data),
                processData: false,
                contentType: "text/plain; charset=UTF-8",
                dataType: "json"
            }).done(() => {
                if (vm.orderType === data.code) {
                    vm.orders.push(data);
                    vm.sortOrders();
                }
            });
        }
    },
    ready: function() {
        this.getOrders();
    }
});
