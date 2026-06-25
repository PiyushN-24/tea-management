import api from "./client";

export async function getConsumption(){

const res=
await api.get(
"/admin/consumption"
);

return res.data;

}
