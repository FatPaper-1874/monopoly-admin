import {ThreeBase} from "@/utils/three/ThreeBase";
import * as THREE from 'three'
import {RoleModel} from "@/views/manage/role-manage/components/utils/RoleModel";
import {__MONOPOLYSERVER__} from "@/global.config";

export class RoleListCardPreviewer extends ThreeBase {
    private role: RoleModel | undefined;

    constructor(canvas: HTMLCanvasElement, fileName: string) {
        super(canvas)
        const light = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(light);
        this.scene.background = new THREE.Color(0xffffff)
        this.camera.position.set(0, 0.4, 0.7);
        this.camera.lookAt(new THREE.Vector3(0, 0.4, 0))
        this.loadRole(fileName);
        this.renderLoop();
    }

    protected renderLoop() {
        this.role && this.role.update();
        super.renderLoop();
    }

    public async loadRole(fileName: string) {
        this.role = new RoleModel(1, `${__MONOPOLYSERVER__}/static/roles/`, fileName);
        const model = await this.role.load();
        this.scene.add(model);
        this.role.doAnimation('hi', true)
    }
}