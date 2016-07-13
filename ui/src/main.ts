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
	form: {
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
		this.$data.orders = data as OrderData[];
	    })
	},
	addOrder: function() {
	    let data = {
		when: Math.floor((new Date(this.form.when)).getTime()/1000), // convert to timestamp
		local: Number(this.form.local),
		foreign: Number(this.form.foreign),
		code: this.form.code
	    } as OrderData;
	    let vm = this;
	    $.post({
		url: "/api/add",
		data: JSON.stringify(data),
		processData: false,
		contentType: "text/plain; charset=UTF-8",
		dataType: "json"
	    }).done(() => {
		vm.orders.push(data);
	    });
	}
    },
    ready: function() {
	this.getOrders();
    }
});
