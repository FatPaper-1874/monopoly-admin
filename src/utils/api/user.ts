import axios from "axios";

export const updateUser = async (id: string, username: string, password: string, avatar: string, color: string) => {
	await axios.post("/user/update", { id, username, password, avatar, color });
};

export const createUser = async (username: string, password: string, avatar: string, color: string) => {
	await axios.post("/user/create", { username, password, avatar, color });
};

export const deleteUser = async (id: string) => {
	await axios.delete("/user/delete", { params: { id } });
};

export const getUserList = async (page: number, size: number) => {
	const { total, userList, current } = (await axios.get("/user/list", { params: { page, size } })) as any;
	return { total, userList, current };
};
