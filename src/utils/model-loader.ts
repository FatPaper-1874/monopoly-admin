import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ItemType } from "./interfaces";
import { _BASEURL_ } from "@/bace";

export const loadItemTypeModules = async (itemTypeList: ItemType[]): Promise<{ name: string; glft: GLTF }[]> => {
	const promiseArr: Promise<{ name: string; glft: GLTF }>[] = new Array<Promise<{ name: string; glft: GLTF }>>();
	const gltfLoader = new GLTFLoader();
	itemTypeList.forEach((itemType) => {
		const promise = new Promise<{ name: string; glft: GLTF }>((resolve, reject) => {
			gltfLoader.load(
				`${_BASEURL_}/static/models/${itemType.model.fileName}`,
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
