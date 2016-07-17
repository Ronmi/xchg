import { OrderData, T } from "../types";
import * as JSX from "../jsx";
import {VueComponent, Prop} from "vue-typescript";

export interface OrderFormData {
    when: string;
    local: number;
    foreign: number;
    code: string;
}

@VueComponent({
    template: (
        <form v-on_submit="handleSubmit">
	    <fieldset>
	        <legend>新增</legend>
	        <label for="date">
	            <span>交易時間</span>
	            <input name="date" type="datetime" v-model="formData.when" placeholder="年/月/日 時:分:秒"/>
	        </label>
	        <label for="local">
	            <span>成本(買入為負)</span>
	            <input name="local" type="number" step="0.01" v-model="formData.local"/>
	        </label>
	        <div class="foreign">
	            <label for="foreign">
		        <span>金額(買入為正)</span>
		        <input name="foreign" type="number" step="0.01" v-model="formData.foreign"/>
	            </label>
	            <label for="currency">
		        <span>幣別</span>
		        <select name="currency" v-model="formData.code">
		            <template v-for="(code, name) in T">
		                <option v-bind_value="code">{`{{name}}`}</option>
		            </template>
		        </select>
	            </label>
	        </div>
	        <button type="submit">送出</button>
	    </fieldset>
	</form>
    )
})
class OrderForm extends Vue {
    formData:OrderFormData = {
        when: "",
        local: 0,
        foreign: 0,
        code: "USD"
    }

    T = T;

    validateForm(): OrderData {
        let d: number;
        try {
            d = Date.parse(this.formData.when);
        } catch (e) {
            return null;
        }

        let v = this.formData.local * this.formData.foreign;
        if (v >= 0) {
            return null;
        }

        if (!T[this.formData.code]) {
            return null;
        }

        return {
            when: Math.floor(d / 1000),
            local: Number(this.formData.local),
            foreign: Number(this.formData.foreign),
            code: this.formData.code
        };
    }

    handleSubmit(e:Event) {
        e.preventDefault();
        let data = this.validateForm();
        if (data == null) {
            alert("格式錯誤"); // alert, 爛透惹ㄦ
            return;
        }

        this.$dispatch("orderEntered", data);
    }
}
