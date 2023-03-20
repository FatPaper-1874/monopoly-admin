import axios from "axios";

export const createItemTypes = async (name: string, color: string, size: number, modelId: string, mapId: string) => {
	return await axios.post("/item-type/create", { name, color, size, modelId, mapId });
};
