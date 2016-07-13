
interface OrderData {
    when: string;
    local: number;
    foreign: number;
    code: string;
}

// supported foreign currency code and translations
const T = {
    "JPY": "日圓",
    "USD": "美元",
    "EUR": "歐元",
    "AUD": "澳幣"
}

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
	    when: '2016-07-13 01:23:45',
	    local: -3300,
	    foreign: 100,
	    code: 'USD'
	},
	orders: [
	    {
		when: '2016-07-13 01:23:45',
		local: -3300,
		foreign: 100,
		code: 'USD'
	    },
	    {
		when: '2016-07-13 01:23:46',
		local: 3300,
		foreign: -100,
		code: 'USD'
	    },
	    {
		when: '2016-07-13 01:23:47',
		local: -315,
		foreign: 1000,
		code: 'JPY'
	    },
	]
    },
    methods: {
	isNegClass: (val:number):string => {
	    if (val < 0) {
		return 'negative';
	    }
	}
    }
});
