import axios from "axios";

export const getRoleList = async (page: number, size: number) => {
    const {total, roleList, current} = (await axios.get("/role/list", {params: {page, size}})) as any;
    return {total, roleList, current};
};

export const preUpload = async (formData: FormData) => {
    const {fileName} = (await axios.post("/role/pre-upload", formData, {headers: {"Content-Type": "multipart/form-data"}})) as any;
    return fileName;
}

export const createRole = async (
    formData: FormData
) => {
    const res = (await axios.post("/role/create", formData, {headers: {"Content-Type": "multipart/form-data"}}));
    return res;
};

export const updateRole = async (
    formData: FormData
) => {
    const res = (await axios.post("/role/update", formData, {headers: {"Content-Type": "multipart/form-data"}}));
    return res;
};

export const deleteModel = async (id: string) => {
    await axios.delete("/role/delete", { params: { id } });
};