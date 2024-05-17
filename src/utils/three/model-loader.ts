import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ItemType } from "@/utils/interfaces";
import { __MONOPOLYSERVER__ } from "../../../global.config";

const gltfLoader = new GLTFLoader();

export const loadItemTypeModules = async (itemTypeList: ItemType[]): Promise<{ name: string; glft: GLTF }[]> => {
	const promiseArr: Promise<{ name: string; glft: GLTF }>[] = new Array<Promise<{ name: string; glft: GLTF }>>();
	itemTypeList.forEach((itemType) => {
		const promise = new Promise<{ name: string; glft: GLTF }>((resolve, reject) => {
			gltfLoader.load(
				`http://${itemType.model.fileUrl}`,
				(glft: GLTF) => {
					resolve({ name: itemType.name, glft: glft });
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
