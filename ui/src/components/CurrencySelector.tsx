import * as React from "react";
import { T } from "../commons";

interface Props {
    codeSelected: (code: string) => void;
    defaultLabel?: string;
    defaultValue?: string;
}

interface State {
    value?: string
}

export default class CurrencySelector extends React.Component<Props, State> {
    private nodes: JSX.Element[];

    constructor(props: Props, context?: any) {
        super(props, context);

        this.state = { value: props.defaultValue };

        let nodes = [] as JSX.Element[];
        for (let code in T) {
            nodes[nodes.length] = <option value={code} key={code}>{T[code]}</option>;
        }
        this.nodes = nodes;
    }

    handleChange = (e: Event) => {
        let v = (e.target as HTMLSelectElement).value;
        this.setState({ value: v });
        this.props.codeSelected(v);
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
            <select name="currency" onChange={this.handleChange} value={this.state.value}>
                {this.renderDefaultLabel()}
                {this.nodes}
            </select>
        );
    }
}
