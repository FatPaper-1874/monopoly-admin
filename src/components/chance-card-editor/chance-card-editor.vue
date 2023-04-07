<script setup lang="ts">
import router from "@/router/index";
import { createChanceCard, getChanceCardById, updateChanceCard } from "@/utils/api/chanceCard";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ace from "ace-builds";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/mode-typescript";
import "ace-builds/src-min-noconflict/snippets/javascript";
import "ace-builds/src-min-noconflict/snippets/typescript";
import { FormInstance, FormRules } from "element-plus";
import { computed, onBeforeMount, onMounted, reactive, ref, toRaw } from "vue";
import { useRoute } from "vue-router";
import { randomColor } from "../../utils/color";
import ChanceCard from "../sample/chance-card.vue";
import { ChanceCardType } from "@/enums/bace";

const route = useRoute();
const _chanceCardId = route.query.id as string;
const _chanceCardTypes = Array.from(Object.values(ChanceCardType));

let editor: ace.Ace.Editor;

const chanceCardForm = reactive({
	name: "",
	describe: "",
	type: "",
	icon: "",
	color: randomColor(),
	effectCode: "",
});
const chanceCardFormRef = ref<FormInstance>();

const chanceCardFormRules = reactive<FormRules>({
	name: [{ required: true, message: "填写添机会卡的名称", trigger: "blur" }],
	describe: [{ required: true, message: "填写添机会卡的描述", trigger: "blur" }],
	type: [{ required: true, message: "选择机会卡类型", trigger: "blur" }],
	icon: [{ required: true, message: "选择图标", trigger: "blur" }],
	color: [{ required: true, message: "选择颜色", trigger: "blur" }],
	effectCode: [{ required: true, message: "选择大小", trigger: "blur" }],
});

const getEffectCodeArea = () => {
	editor.findAll("//CODING AREA");
	const effectCodeStartRow = editor.selection.getCursor().row + 1;
	editor.findNext();
	const effectCodeEndRow = editor.selection.getCursor().row - 1;
	return [effectCodeStartRow, effectCodeEndRow];
};

const handleCreateOrUpdateChanceCard = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid) => {
		if (valid) {
			const { name, describe, type, color, icon } = {
				...toRaw(chanceCardForm),
			};
			const editorDocument = editor.session.getDocument();

			const [effectCodeStartRow, effectCodeEndRow] = getEffectCodeArea();

			const effectCode = editorDocument.getLines(effectCodeStartRow, effectCodeEndRow).join("\n");

			if (_chanceCardId) {
				const {
					name: new_name,
					describe: new_describe,
					type: new_type,
					color: new_color,
					icon: new_icon,
					effectCode: new_effectCode,
				} = (await updateChanceCard(_chanceCardId, name, describe, type, color, icon, effectCode)) as any;
				setChanceCardInfo(new_name, new_describe, new_type, new_color, new_icon, new_effectCode);
			} else {
				await createChanceCard(name, describe, type, color, icon, effectCode);
				router.replace({ path: "/chance-card" });
			}
		} else {
			console.log("error submit!");
			return false;
		}
	});
};

const loadChanceCardInfo = async () => {
	if (_chanceCardId) {
		const { name, describe, type, color, icon, effectCode } = (await getChanceCardById(_chanceCardId)) as any;
		setChanceCardInfo(name, describe, type, color, icon, effectCode);
	}
};

const setChanceCardInfo = (
	name: string,
	describe: string,
	type: string,
	color: string,
	icon: string,
	effectCode: string
) => {
	chanceCardForm.name = name;
	chanceCardForm.describe = describe;
	chanceCardForm.type = type;
	chanceCardForm.color = color;
	chanceCardForm.icon = icon;
	editor.setValue(
		`interface PropertyInterface {
	//房产信息
	getId: () => string;
	getName: () => string;
	getBuildingLevel: () => number;
	getBuildCost: () => number;
	getSellCost: () => number;
	getCost_lv0: () => number;
	getCost_lv1: () => number;
	getCost_lv2: () => number;
	getOwner: () => { id: string; name: string; color: string; avatar: string } | undefined;
	getPassCost: () => number;

	//设置房产信息
	setOwner: (player: Player) => void;
	buildUp: () => void;
}

interface PlayerInterface {
	//玩家信息
	getUser: () => User;
	getId: () => string;
	getName: () => string;

	//地产相关
	getPropertiesList: () => PropertyInterface[];
	setPropertiesList: (newPropertiesList: Property[]) => void;
	gainProperty: (property: Property) => void;
	loseProperty: (propertyId: string) => void;

	//机会卡相关
	getCardsList: () => ChanceCard[];
	setCardsList: (newChanceCardList: ChanceCard[]) => void;
	gainCard: (card: ChanceCard) => void;
	loseCard: (cardId: string) => void;

	//钱相关
	setMoney: (money: number) => void;
	getMoney: () => number;
	cost: (money: number) => boolean;
	gain: (money: number) => number;

	//游戏相关
	setStop: (stop: number) => void;
	getStop: () => number;
	setPositionIndex: (newIndex: number) => void;
	getPositionIndex: () => number;
}

function effectFunction(sourcePlayer: PlayerInterface, target: PlayerInterface | PlayerInterface[] | PropertyInterface | PropertyInterface[]){
    //CODING AREA
${effectCode}
    //CODING AREA
}`
	);
};

//代码编辑器相关
onMounted(async () => {
	const codeEditorElement = document.querySelector("#code-editor") as HTMLDivElement;
	editor = ace.edit(codeEditorElement);
	editor.setFontSize(14);
	editor.session.setMode("ace/mode/typescript");
	editor.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: true,
	});
	editor.setValue(`interface PropertyInterface {
	//房产信息
	getId: () => string;
	getName: () => string;
	getBuildingLevel: () => number;
	getBuildCost: () => number;
	getSellCost: () => number;
	getCost_lv0: () => number;
	getCost_lv1: () => number;
	getCost_lv2: () => number;
	getOwner: () => { id: string; name: string; color: string; avatar: string } | undefined;
	getPassCost: () => number;

	//设置房产信息
	setOwner: (player: Player) => void;
	buildUp: () => void;
}

interface PlayerInterface {
	//玩家信息
	getUser: () => User;
	getId: () => string;
	getName: () => string;

	//地产相关
	getPropertiesList: () => PropertyInterface[];
	setPropertiesList: (newPropertiesList: Property[]) => void;
	gainProperty: (property: Property) => void;
	loseProperty: (propertyId: string) => void;

	//机会卡相关
	getCardsList: () => ChanceCard[];
	setCardsList: (newChanceCardList: ChanceCard[]) => void;
	gainCard: (card: ChanceCard) => void;
	loseCard: (cardId: string) => void;

	//钱相关
	setMoney: (money: number) => void;
	getMoney: () => number;
	cost: (money: number) => boolean;
	gain: (money: number) => number;

	//游戏相关
	setStop: (stop: number) => void;
	getStop: () => number;
	setPositionIndex: (newIndex: number) => void;
	getPositionIndex: () => number;
}

function effectFunction(sourcePlayer: PlayerInterface, target: PlayerInterface | PlayerInterface[] | PropertyInterface | PropertyInterface[]){
    //CODING AREA

    //CODING AREA
}`);
	loadChanceCardInfo();
});
</script>

<template>
	<div class="chance-card-editor">
		<div class="left-container">
			<div class="chance-card-preview">
				<chance-card
					:name="chanceCardForm.name"
					:describe="chanceCardForm.describe"
					:icon="chanceCardForm.icon"
					:color="chanceCardForm.color"
				></chance-card>
			</div>
			<div class="chance-card-form-container">
				<el-form
					label-position="left"
					label-width="100px"
					ref="chanceCardFormRef"
					:rules="chanceCardFormRules"
					:model="chanceCardForm"
				>
					<el-form-item label="机会卡名称" prop="name">
						<el-input v-model="chanceCardForm.name" placeholder=""></el-input>
					</el-form-item>

					<el-form-item label="机会卡描述" prop="describe">
						<el-input type="textarea" v-model="chanceCardForm.describe" placeholder=""></el-input>
					</el-form-item>

					<el-form-item label="机会卡类型" prop="type">
						<el-select v-model="chanceCardForm.type">
							<el-option
								v-for="_typeName in _chanceCardTypes"
								:value="_typeName"
								:label="_typeName"
								:key="_typeName"
							></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="机会卡图标" prop="icon">
						<el-input v-model="chanceCardForm.icon" placeholder=""></el-input>
					</el-form-item>

					<el-form-item label="机会卡颜色" prop="color">
						<el-color-picker color-format="rgb" v-model="chanceCardForm.color" placeholder=""></el-color-picker>
					</el-form-item>

					<el-form-item>
						<el-button @click="handleCreateOrUpdateChanceCard(chanceCardFormRef)" type="primary">{{
							_chanceCardId ? "保存机会卡" : "添加机会卡"
						}}</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>

		<div class="right-container">
			<div class="explain-area">
				<FontAwesomeIcon icon="warning" />
				<span>
					以下区域编写的代码将会在游戏后端运行时读取并运行，代码上方为定义的接口区域，请在注释为"CODING AREA"
					的区域内编写代码，不能修改上方的接口以及外围的函数定义。
				</span>
			</div>
			<div class="editor-area">
				<div id="code-editor"></div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.chance-card-editor {
	width: 100%;
	height: 100%;
	display: flex;

	& > .left-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	& > .right-container {
		flex: 1;
		margin-left: 20px;
		border-radius: 10px;
		padding: 20px;
		box-shadow: var(--el-box-shadow-light);
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
}

.chance-card-preview {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	margin-bottom: 50px;
}
.chance-card-form-container {
	border-radius: 10px;
	padding: 20px;
	box-shadow: var(--el-box-shadow-light);
	background-color: #ffffff;
}

.explain-area {
	user-select: none;
	padding: 8px 16px;
	color: var(--el-color-danger-dark-2);
	background-color: var(--el-color-danger-light-7);
	border-radius: 4px;
	border-left: 5px solid var(--el-color-danger);
	margin-bottom: 20px;
}
.editor-area {
	flex: 1;
}
#code-editor {
	width: 100%;
	height: 100%;
}
</style>
