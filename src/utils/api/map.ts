import axios from "axios";

export const createMap = async (name: string) => {
	const res = await axios.post("/map/create", {
		name,
	});
	return res;
};

export const getMapById = async (id: string) => {
	const res = await axios.get("/map/info", { params: { id } });
	return res;
};

export const getItemTypesListByMapId = async (id: string) => {
	const res = await axios.get("/map/item-type", { params: { id } });
	return res;
};

export const getMapItemsListByMapId = async (id: string) => {
	const res = await axios.get("/map/map-item", { params: { id } });
	return res;
};

export const getMapsList = async (page: number, size: number) => {
	const { total, mapsList, current } = (await axios.get("/map/list", { params: { page, size } })) as any;
	return { total, mapsList, current };
};

export const deleteMap = async (id: string) => {
	return await axios.delete("/map/delete", { params: { id } });
};
