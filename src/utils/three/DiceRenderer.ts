import { loadModel } from "@/utils/three/model-loader";
import gsap from "gsap";
import * as THREE from "three";

//骰子面的法向量
const DICEFACE = [
	,
	new THREE.Vector3(0, -1, 0),
	new THREE.Vector3(0, 0, -1),
	new THREE.Vector3(-1, 0, 0),
	new THREE.Vector3(1, 0, 0),
	new THREE.Vector3(0, 0, 1),
	new THREE.Vector3(0, 1, 0),
];

export class DiceRenderer {
	protected renderer: THREE.WebGLRenderer;
	protected scene: THREE.Scene;
	// protected camera: THREE.OrthographicCamera;
	protected camera: THREE.PerspectiveCamera;
	protected dices: THREE.Group[] = [];
	protected dicenum: number;
	protected dicegap: number;

	private isRotate: boolean;
	private isEnlarge: boolean;
	private enlargenum: number;

	constructor(
		el: HTMLCanvasElement,
		rotate: boolean,
		dicenum: number = 1,
		dicegap: number = 1,
		enlarge: boolean = true,
		enlargenum: number = 2
	) {
		this.dicenum = dicenum;
		this.dicegap = dicegap;

		this.renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true });
		this.renderer.setClearAlpha(0);
		this.renderer.setSize(el.clientWidth, el.clientHeight);

		this.scene = new THREE.Scene();
		this.scene.background = null;
		this.scene.add(new THREE.AmbientLight(0xffffff, 10));
		// this.camera = new THREE.OrthographicCamera(
		// 	-3,
		// 	3,
		// 	3,
		// 	-3,
		// 	0, // 近裁剪面
		// 	1000 // 远裁剪面
		// );
		this.camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 100);

		this.camera.position.set(3 * enlargenum, 0, 0);
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));

		this.isRotate = rotate;
		this.isEnlarge = enlarge;

		this.enlargenum = enlargenum;

		this.loadDiceModel(dicenum);

		this.renderLoop();
	}

	private rotateModelToFaceCamera(model: THREE.Object3D, targetFaceNormal: THREE.Vector3) {
		return new Promise((resolve, reject) => {
			const cameraDirection = new THREE.Vector3();
			this.camera.getWorldDirection(cameraDirection);

			const rotationAxis = new THREE.Vector3().crossVectors(targetFaceNormal, cameraDirection).normalize();
			const rotationAngle = Math.acos(targetFaceNormal.dot(cameraDirection));

			// 使用 gsap 动画来旋转模型
			gsap.to(model.rotation, {
				x: rotationAxis.x * rotationAngle,
				y: rotationAxis.y * rotationAngle,
				z: rotationAxis.z * rotationAngle,
				duration: 1, // 动画持续时间
				ease: "power2.out", // 缓动函数
				onComplete: () => {
					// 动画完成后，直接设置模型的旋转角度以确保准确性
					model.rotation.set(
						rotationAxis.x * rotationAngle,
						rotationAxis.y * rotationAngle,
						rotationAxis.z * rotationAngle
					);
					resolve("");
				},
			});
		});
	}

	private renderLoop() {
		if (this.isRotate && this.dices.length > 0) {
			this.dices.forEach((dice) => {
				this.rotateDice(dice);
			});
		}
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(this.renderLoop.bind(this));
	}

	public async startRotate() {
		this.dices.forEach((dice) => {
			gsap.to(dice.rotation, { x: Math.PI / 4, y: Math.PI / 4, direction: 1, ease: "power2.out" });
		});
		this.isRotate = true;
		if (this.isEnlarge) gsap.to(this.camera.position, { x: 3 * this.enlargenum, direction: 1, ease: "power2.out" });
	}

	public async stopRotate(faces: number[]) {
		if (faces.length !== this.dices.length) {
			throw new Error("骰子的数量与输入不符!");
		}
		const promiseArr: Promise<any>[] = [];
		faces.forEach((face, index) => {
			if (!this.dices || face < 1 || face > 6) return;
			this.isRotate = false;
			promiseArr.push(this.rotateModelToFaceCamera(this.dices[index], DICEFACE[face] || new THREE.Vector3(0, 1, 0)));
			if (this.isEnlarge) gsap.to(this.camera.position, { x: 2.2 * this.enlargenum, direction: 1, ease: "power2.out" });
		});
		await Promise.all(promiseArr);
	}

	protected addToScene(m: THREE.Object3D) {
		this.scene.add(m);
	}

	private rotateDice(model: THREE.Group) {
		const rotationAxis = new THREE.Vector3(0, 1, 0).normalize();

		// 设置旋转速度
		const rotationSpeed = 0.1;
		model.rotateOnWorldAxis(rotationAxis, rotationSpeed);
	}

	private async loadDiceModel(dicenum: number) {
		const gltf = await loadModel("dice.glb");
		for (let index = 0; index < dicenum; index++) {
			const dice = new THREE.Group();
			dice.copy(gltf.scene);
			this.dices.push(dice);
			this.scene.add(dice);
		}
		if (this.isRotate) this.startRotate();
		this.arrangeModels(this.dices, this.dicegap, 2);
	}

	private arrangeModels(models: THREE.Group[], gap: number, modelWidth: number) {
		// 计算起始位置
		let startZ = (-(models.length - 1) * (gap + modelWidth)) / 2;

		// 设置每个模型的位置
		models.forEach((model) => {
			model.position.z = startZ;
			startZ += modelWidth + gap;
		});
	}
}
