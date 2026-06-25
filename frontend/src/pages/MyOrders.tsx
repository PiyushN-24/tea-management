import {
useEffect,
useState
}
from "react";

import {
getOrders
}
from "../api/orders";


export default function MyOrders(){

const [
orders,
setOrders
]=useState<any[]>([]);


useEffect(()=>{

load();

},[]);


async function load(){

const data=
await getOrders();

setOrders(
data
);

}

return(

<div
className="
p-10
"
>

<h1
className="
text-3xl
mb-6
"
>

My Orders

</h1>

<table
className="
w-full
border
"
>

<thead>

<tr>

<th>
ID
</th>

<th>
Drink
</th>

<th>
Qty
</th>

<th>
Date
</th>

</tr>

</thead>

<tbody>

{

orders.map(
(o)=>(
<tr
key={
o.id
}
>

<td>

{o.id}

</td>

<td>

{o.beverage}

</td>

<td>

{o.quantity}

</td>

<td>

{o.order_date}

</td>

</tr>
)
)

}

</tbody>

</table>

</div>

);

}
