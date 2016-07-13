import {OrderData, T} from "./types";
import "./orderlist.ts";

Vue.filter('floatFormat', (val:number, size:number): string => {
    size = Math.floor(Math.abs(size));
    let x = Math.pow(10, size);
    let str = Math.round(val * x) + '';

    while (str.length < size) {
	str = '0' + str;
    }

    let l = str.length;
    if (l == size) {
	return '0.' + str;
    }

    return str.substr(0, l-size) + '.' + str.substr(l-size, size);
});

Vue.filter("translate", (code:string):string => {
    return T[code];
});

let vm = new Vue({
    el: "#app",
    data:{
 	T: T,
	form: <OrderData>{
	    when: '',
	    local: 0,
	    foreign: 0,
	    code: 'USD'
	},
	orders: [] as OrderData[]
    },
    methods: {
	getOrders: function() {
	    $.getJSON("/api/listall", {}, (data:any, status:string, xhr:JQueryXHR) => {
		console.log(this);
		this.$data.orders = data as OrderData[];
	    })
	}
    },
    ready: function() {
	this.getOrders();
    }
});
