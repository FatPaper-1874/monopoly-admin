import axios from "axios";

export const createItemTypes = async (
	name: string,
	color: string,
	size: number,
	modelId: string,
	mapId: string = ""
) => {
	return await axios.post("/item-type/create", { name, color, size, modelId, mapId });
};

export const createEventItemType = async (
	name: string,
	color: string,
	size: number,
	modelId: string,
	effectCode: string = ""
) => {
	return await axios.post("/item-type/create-event", { name, color, size, modelId, effectCode });
};

export const updateItemTypes = async (
	id: string,
	name: string,
	color: string,
	size: number,
	modelId: string,
	effectCode: string
) => {
	return await axios.post("/item-type/update", { id, name, color, size, modelId, effectCode });
};

export const deleteItemType = async (id: string) => {
	return await axios.delete("/item-type/delete", { params: { id } });
};

export const getItemTypeById = async (id: string) => {
	return (await axios.get("/item-type/info", { params: { id } })) as any;
};

export const getEvenItemtypesList = async (page: number, size: number) => {
	const { total, eventItemtypesList, current } = (await axios.get("/item-type/list", {
		params: { page, size },
	})) as any;
	return { total, eventItemtypesList, current };
};
