import * as React from "react";

interface Props {
    submitPincode: (pin: string) => void; // callback
    formatError: () => void;
}

interface State {
    pin: string;
}

export default class AuthForm extends React.Component<Props, State> {
    constructor(props?: Props, context?: any) {
        super(props, context);
        this.state = { pin: "" };
    }

    private input: HTMLInputElement;
    private setInput = (e: HTMLInputElement) => {
	this.input = e;
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <fieldset>
                    <legend>使用者認證</legend>
                    <label htmlFor="pin">
                        <span>PIN</span>
                        <input ref={this.setInput} name="pin" type="text" onChange={this.handleChange} placeholder="6 碼數字" />
                    </label>
                    <button type="submit">送出</button>
                </fieldset>
            </form>
        );
    }

    componentDidMount() {
        this.input.focus();
    }

    handleChange = (e: Event) => {
        this.setState({ pin: (e.target as HTMLInputElement).value });
    }

    handleSubmit = (e: Event) => {
        e.preventDefault();

        if (! /^[0-9]{6}$/.test(this.state.pin)) {
            this.props.formatError();
            return
        }

        this.props.submitPincode(this.state.pin);
    }
}
