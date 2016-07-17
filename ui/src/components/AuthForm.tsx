import * as JSX from "../jsx";
import {VueComponent, Prop} from "vue-typescript";

@VueComponent({
    template: (
        <form v-on_submit="handleSubmit">
	    <fieldset>
	        <legend>使用者認證</legend>
	        <label for="pin">
	            <span>PIN</span>
	            <input name="pin" type="text" v-model="pin" placeholder="6 碼數字"/>
	        </label>
	        <button type="submit">送出</button>
	    </fieldset>
	</form>
    )
})
class AuthForm extends Vue {
    pin: string = "";

    handleSubmit(e: Event) {
        e.preventDefault();

        if (! /^[0-9]{6}$/.test(this.pin)) {
            // 爛透惹
            alert("PIN 碼必須是 6 位數字");
            return
        }

        this.$dispatch("pinEntered", this.pin);
    }
}
