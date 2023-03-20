import {
	AmbientLight,
	AxesHelper,
	DirectionalLight,
	HemisphereLight,
	PerspectiveCamera,
	Scene,
	Vector3,
	WebGLRenderer,
	Group,
	Object3D,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GameMap, MapItem, ItemType } from "./interfaces";
import { loadItemTypeModules } from "./model-loader";

export class ThreeBuilder {
	private renderer: WebGLRenderer;
	private scene: Scene;
	private camera: PerspectiveCamera;
	private mapContainer: Group;
	private models: { [key: string]: Group };
	private mapItemList: Object3D[];

	constructor(canvas: HTMLCanvasElement) {
		this.renderer = new WebGLRenderer({ canvas });
		this.scene = new Scene();
		this.camera = new PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
		this.mapContainer = new Group();
		this.models = {};
		this.mapItemList = [];

		this.scene.add(this.mapContainer);

		this.camera.position.set(15, 30, 10);
		this.camera.rotateY(100);

		//创建坐标系参考
		const axesHelper = new AxesHelper(5);
		this.scene.add(axesHelper);

		//创建灯光
		const light = new AmbientLight(0xffffff, 1.2); // soft white light
		this.scene.add(light);

		// 创建轨道控制器
		const controls = new OrbitControls(this.camera, canvas);
		controls.target.set(15, 0, 9.95);

		const loop = () => {
			requestAnimationFrame(loop);

			controls.update();

			this.renderer.render(this.scene, this.camera);
		};

		loop();
	}

	public async loadModels(itemTypeList: ItemType[]) {
		const modelList = await loadItemTypeModules(itemTypeList.map((itemType) => itemType));
		const tempModelOBJ: { [key: string]: Group } = {};
		modelList.forEach((model) => {
			tempModelOBJ[model.name] = model.glft.scene;
		});
		console.log(tempModelOBJ);
		
		this.models = tempModelOBJ;
	}

	public async loadMapItems(mapItemList: MapItem[]) {
		// console.log(mapData);
		// console.log(this.modules);
		mapItemList.forEach((item) => {
			const tempModule = this.models[item.type.name].clone();
			console.log(tempModule);
			tempModule.scale.set(0.5, 0.5, 0.5);
			tempModule.position.set(item.x + item.type.size / 2, 0, item.y + item.type.size / 2);
			this.mapContainer.add(tempModule);
		});
	}

	public async reloadMapItems(mapItemList: MapItem[]) {
		this.mapContainer.clear();
		await this.loadMapItems(mapItemList);
	}
}
