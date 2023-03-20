import axios from "axios";
import { ModelItem } from "../interfaces";

export const getModelList = async (page: number, size: number) => {
	const { total, modelList, current } = (await axios.get("/model/list", { params: { page, size } })) as any;
	return { total, modelList, current };
};

export const deleteModel = async (id: string) => {
	await axios.delete("/model/delete", { params: { id } });
};
