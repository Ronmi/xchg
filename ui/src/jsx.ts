export interface Props {
    [key: string]: any;
}

export function createElement(tag: string, props: Props, ...content: string[]): string {
    let ret = "<" + tag;
    let tail = "/>";

    for (let p in props) {
        let name = p;
        if (p.substr(0, 7) === "v-bind_") {
            name = ":" + p.substring(7);
        } else if (p.substr(0, 5) === "v-on_") {
            name = "@" + p.substring(5);
        }

        ret += " " + name;
        if (props[p] !== true) {
            ret += `="` + props[p] + `"`;
        }
    }

    if (content.length > 0) {
        let tmp = content.join("");
        if (tmp !== "") {
            tail = ">" + tmp + "</" + tag + ">";
        }
    }

    return ret + tail;
}
