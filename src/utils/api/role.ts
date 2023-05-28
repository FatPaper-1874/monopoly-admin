import axios from "axios";

export const getRoleList = async (page: number, size: number) => {
	const { total, roleList, current } = (await axios.get("/role/list", { params: { page, size } })) as any;
	return { total, roleList, current };
};
