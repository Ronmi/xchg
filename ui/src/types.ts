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

    return ret;
}
