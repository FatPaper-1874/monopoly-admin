import axios from "axios";

export const apiLogin = async (username: string, password: string) => {
	const res = await axios.post("/login", {
		username,
		password,
	}) as any;
	console.log(res);
	
	localStorage.setItem("token", "Bearer " + res.token);
	return res.status === 200 ? true : false;
};
