export interface OrderData {
    when: number;
    local: number;
    foreign: number;
    code: string;
}

// supported foreign currency code and translations
export const T = {
    "JPY": "日圓",
    "USD": "美元",
    "EUR": "歐元",
    "AUD": "澳幣"
} as { [prop: string]: string };

export function translate(code: string): string {
    let ret: string;
    try {
        ret = T[code];
    } catch (e) {
        return code;
    }

    if (!ret) {
        return code;
    }
    return ret;
}

export function formatNumber(val: number, size: number): string {
    if (isNaN(Math.abs(val))) {
        val = 0;
    }
    size = Math.floor(Math.abs(size));
    let x = Math.pow(10, size);
    let str = Math.round(Math.abs(val) * x) + "";

    while (str.length < size) {
        str = "0" + str;
    }

    let l = str.length;
    let before = str.substr(0, l - size);
    let after = str.substr(l - size, size);

    if (before.length === 0) {
        before = "0";
    }
    if (val < 0) {
        before = "-" + before;
    }

    return before + "." + after;
}

function formatTime(t: number): string {
    if (t < 10) {
        return "0" + t;
    }
    return String(t);
}
export function convertTime(t: number): string {
    let d = new Date(t * 1000);
    let ret = d.getFullYear() + "/" + formatTime(d.getMonth() + 1) + "/" + formatTime(d.getDate());
    ret += " " + formatTime(d.getHours());
    ret += ":" + formatTime(d.getMinutes());
    ret += ":" + formatTime(d.getSeconds());
    return ret;
}
