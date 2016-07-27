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
}
