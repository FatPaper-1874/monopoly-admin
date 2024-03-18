import * as THREE from 'three'
import {RoleModel} from "@/views/manage/role-manage/components/utils/RoleModel";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export class RolePreviewer {
    private renderer;
    private scene;
    private camera;
    private orbitControls;

    private rolesReady = false;

    private role: RoleModel | undefined;

    constructor(canvas: HTMLCanvasElement) {
        this.renderer = new THREE.WebGLRenderer({canvas});
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
        this.camera.position.set(1, 1, 2);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0))

        this.orbitControls = new OrbitControls(this.camera, canvas);

        this.scene.background = new THREE.Color(0x000000);
        this.scene.add(new THREE.AmbientLight(0xffffff, 1))
        this.scene.add(new THREE.AxesHelper(1))
        this.renderLoop();
        window.onresize = () => {
            // 重置渲染器输出画布canvas尺寸
            this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
            // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
            // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
            this.camera.updateProjectionMatrix();
        }
    }

    public async loadRoleModel(baseUrl: string, roleName: string) {
        this.role && this.scene.remove(this.role.model);
        const role = new RoleModel(1, baseUrl, roleName);
        const roleModel = await role.load();
        this.role = role;
        this.addModel(roleModel);
        this.rolesReady = true
        return this.role;
    }

    public clear() {
        this.scene.clear();
        this.role = undefined;
    }

    private renderLoop() {
        this.orbitControls.update();
        if (this.rolesReady && this.role) {
            this.role.update();
        }
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.renderLoop.bind(this));
    }

    public addModel(model: THREE.Object3D) {
        this.scene.add(model);
    }
}