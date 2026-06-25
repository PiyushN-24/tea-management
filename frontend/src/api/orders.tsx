import api from "./client";

export async function getOrders(){

const user=
JSON.parse(
localStorage.getItem(
"user"
)||"{}"
);

const res=
await api.get(
`/orders/me?user_id=${user.id}`
);

return res.data;

}
