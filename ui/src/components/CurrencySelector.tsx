import * as React from "react";
import { T } from "../types";

interface Props {
    codeSelected: (code: string) => void;
    defaultLabel?: string;
    defaultValue?: string
}

export default class CurrencySelector extends React.Component<Props, {}> {
    private nodes: JSX.Element[];

    constructor(props: Props, context?: any) {
	super(props, context);

	let nodes = [] as JSX.Element[];
        for (let code in T) {
            nodes[nodes.length] = <option value={code} key={code}>{T[code]}</option>;
        }
	this.nodes = nodes;
    }

    handleChange = (e: Event) => {
        this.props.codeSelected((e.target as HTMLSelectElement).value);
    }

    renderDefaultLabel() {
        if (!this.props.defaultLabel) {
            return null;
        }

        return (
            <option value={this.props.defaultValue} key={this.props.defaultValue}>
                {this.props.defaultLabel}
            </option>
        );
    }

    render() {
        return (
            <select name="currency" onChange={this.handleChange} value={this.props.defaultValue}>
                {this.renderDefaultLabel()}
                {this.nodes}
            </select>
        );
    }
}
