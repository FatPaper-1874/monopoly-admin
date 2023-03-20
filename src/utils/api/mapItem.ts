import axios from "axios";

export const createMapItem = async (_id: string, x: number, y: number, typeId: string, mapId: string) => {
	return await axios.post("/map-item/create", { _id, x, y, typeId, mapId });
};

export const deleteMapItem = async (id: string) => {
	return await axios.delete("/map-item/delete", { params: { id } });
};
