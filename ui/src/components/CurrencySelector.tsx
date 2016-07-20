import * as React from "react";
import { T } from "../types";

interface Props {
    codeSelected: (code: string) => void;
    defaultLabel?: string;
    defaultValue?: string
}

export default class CurrencySelector extends React.Component<Props, {}> {
    handleChange(e: Event) {
        this.props.codeSelected((e.target as HTMLSelectElement).value);
    }

    renderDefaultLabel() {
        if (!this.props.defaultLabel) {
            return null;
        }

        return <option value={this.props.defaultValue}>{this.props.defaultLabel}</option>
    }

    render() {
        let nodes = [] as JSX.Element[];
        for (let code in T) {
            nodes[nodes.length] = <option value={code}>{T[code]}</option>;
        }

        return (
            <select name="currency" onChange={this.handleChange.bind(this)} value={this.props.defaultValue}>
                {this.renderDefaultLabel()}
                {nodes}
            </select>
        );
    }
}
