import {_axios} from "@/utils/axios";

export const createChanceCard = async (
	name: string,
	describe: string,
	type: string,
	color: string,
	icon: string,
	effectCode: string
) => {
	await _axios.post("/chance-card/create", { name, describe, type, color, icon, effectCode });
};

export const updateChanceCard = async (
	id: string,
	name: string,
	describe: string,
	type: string,
	color: string,
	icon: string,
	effectCode: string
) => {
	return await _axios.post("/chance-card/update", { id, name, describe, type, color, icon, effectCode });
};

export const getChanceCardById = async (id: string) => {
	return await _axios.get("/chance-card/info", { params: { id } });
};

export const getChanceCardsList = async (page: number, size: number) => {
	const { total, chanceCardsList, current } = (await _axios.get("/chance-card/list", { params: { page, size } })) as any;
	return { total, chanceCardsList, current };
};

export const deleteChanceCard = async (id: string) => {
	return await _axios.delete("/chance-card/delete", { params: { id } });
};

export const updateChanceCardInMap = async (chanceCardIdList: string[], mapId: string) => {
	await _axios.post("/chance-card/bind-map", { chanceCardIdList, mapId });
};
