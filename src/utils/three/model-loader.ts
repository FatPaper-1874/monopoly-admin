import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { ItemType } from "@/interfaces/interfaces";

export const loadItemTypeModules = async (itemTypeList: ItemType[]): Promise<{ id: string; glft: GLTF }[]> => {
	const promiseArr: Promise<{ id: string; glft: GLTF }>[] = new Array<Promise<{ id: string; glft: GLTF }>>();
	const gltfLoader = new GLTFLoader();
	const draco = new DRACOLoader();
	draco.setDecoderPath('./draco/');
	gltfLoader.setDRACOLoader(draco);
	itemTypeList.forEach((itemType) => {
		const promise = new Promise<{ id: string; glft: GLTF }>((resolve, reject) => {
			gltfLoader.load(
				`http://${itemType.model.fileUrl}`,
				(glft: GLTF) => {
					glft.userData = { typeId: itemType.id };
					resolve({ id: itemType.id, glft: glft });
				},
				undefined,
				(error) => {
					reject(error);
				}
			);
		});
		promiseArr.push(promise);
	});
	return await Promise.all(promiseArr);
};

