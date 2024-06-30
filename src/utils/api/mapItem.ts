import { _axios } from "@/utils/axios";

export const createMapItem = async (
	_id: string,
	x: number,
	y: number,
	rotation: 0 | 1 | 2 | 3,
	typeId: string,
	mapId: string
) => {
	return await _axios.post("/map-item/create", { _id, x, y, rotation, typeId, mapId });
};

export const deleteMapItem = async (id: string) => {
	return await _axios.delete("/map-item/delete", { params: { id } });
};

export const linkMapItem = async (sourceId: string, targetId: string) => {
	return await _axios.post("/map-item/link", { sourceId, targetId });
};
