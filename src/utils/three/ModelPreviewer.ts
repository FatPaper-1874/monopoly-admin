import { __MONOPOLYSERVER__ } from "@/global.config";
import { AmbientLight, Box3, Color, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class ModelPreviewer {
	private canvas: HTMLCanvasElement;
	private renderer: WebGLRenderer;
	private scene: Scene;
	private camera: PerspectiveCamera;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.renderer = new WebGLRenderer({ canvas, antialias: true });
		this.scene = new Scene();
		this.scene.background = new Color(0xeeeeee);
		this.camera = new PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
		this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

		const light = new AmbientLight(0xffffff, 1.5); // soft white light
		this.scene.add(light);
		this.renderer.render(this.scene, this.camera);
	}

	public async loadModel(modelFileName: string, rotatable: boolean) {
		this.scene.clear();
		if (!modelFileName) {
			this.renderer.render(this.scene, this.camera);
			return;
		}
		const loader = new GLTFLoader();
		const gltf = await loader.loadAsync(`${__MONOPOLYSERVER__}/static/models/${modelFileName}`);

		const light = new AmbientLight(0xffffff, 1.5); // soft white light
		this.scene.add(light);

		const model = gltf.scene;
		this.scene.add(model);
		const box = new Box3().setFromObject(model);
		const center = box.getCenter(new Vector3());
		const distance = box.getSize(new Vector3()).length() + 1;
		this.camera.position.copy(center);
		this.camera.position.x += distance;
		this.camera.position.y += distance;
		this.camera.position.z += distance;
		this.camera.lookAt(center);

		this.renderer.render(this.scene, this.camera);

		if (rotatable) {
			const _this = this;

			let requestAnimationFrameId = -1;

			function rotate() {
				requestAnimationFrameId = requestAnimationFrame(rotate);
				model.rotateY(Math.PI / 180);
				_this.renderer.render(_this.scene, _this.camera);
			}

			this.canvas.addEventListener("mouseenter", () => {
				rotate();
			});

			this.canvas.addEventListener("mouseleave", () => {
				cancelAnimationFrame(requestAnimationFrameId);
			});
		}
	}

	public clear() {
		this.scene.clear();
		this.renderer.render(this.scene, this.camera);
	}

	public distory() {
		this.scene.clear();
		this.renderer.clear();
		this.renderer.dispose();
		this.renderer.forceContextLoss();
	}
}
