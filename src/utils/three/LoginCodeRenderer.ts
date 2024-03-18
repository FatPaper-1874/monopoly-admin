import { DiceRenderer } from "./DiceRenderer";
import * as THREE from "three";

export class LoginCodeRenderer extends DiceRenderer {
	private codePlane: THREE.Mesh | undefined;

	constructor(el: HTMLCanvasElement, rotate: boolean) {
		super(el, rotate);
		const codePlaneGeometry = new THREE.PlaneGeometry(1.6, 1.6);
		const codePlaneMaterial = new THREE.MeshBasicMaterial({
			opacity: 0,
			transparent: true,
			side: THREE.DoubleSide,
		});
		this.codePlane = new THREE.Mesh(codePlaneGeometry, codePlaneMaterial);
		this.codePlane.position.set(1.0005, 0, 0);
		this.codePlane.rotateY(Math.PI / 2);
		// this.codePlane.lookAt(super.camera.position);

		super.addToScene(this.codePlane);
	}

	public async loadCode(imgUrl: string) {
		if (!this.codePlane) return;
		const textureLoader = new THREE.TextureLoader();
		const texture = await new Promise<THREE.Texture>((resolve, reject) => {
			textureLoader.load(imgUrl, (texture) => {
				resolve(texture);
			});
		});
		//获取到二维码后，通知父类停止转动;

		await super.stopRotate([1]);
		this.codePlane.material = new THREE.MeshBasicMaterial({
			transparent: true,
			map: texture,
			side: THREE.DoubleSide,
		});
	}

	public cleanCode() {
		if (!this.codePlane) return;
		const codePlaneMaterial = new THREE.MeshBasicMaterial({
			opacity: 0,
			transparent: true,
			side: THREE.DoubleSide,
		});
		this.codePlane.material = codePlaneMaterial;
		this.rollAllDice();
	}

	private rollAllDice() {
		this.dices.forEach((dice) => {
			super.startRotate();
		});
	}
}
