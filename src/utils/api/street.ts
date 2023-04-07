import axios from "axios";
export const createStreet = async (name: string, increase: number, mapId: string) => {
	await axios.post("/street/create", { name, increase, mapId });
};
