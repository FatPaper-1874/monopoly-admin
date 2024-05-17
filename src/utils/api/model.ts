import {_axios} from "@/utils/axios";

export const getModelList = async (page: number, size: number) => {
	const { total, modelList, current } = (await _axios.get("/model/list", { params: { page, size } })) as any;
	return { total, modelList, current };
};

export const deleteModel = async (id: string) => {
	await _axios.delete("/model/delete", { params: { id } });
};
