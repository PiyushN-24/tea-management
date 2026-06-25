import api from "./client";

export async function getOrders(){

const userId=1;

const res=
await api.get(
`/orders/me?user_id=${userId}`
);

return res.data;

}

