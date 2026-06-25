import {
useEffect,
useState
} from "react";

import api from "../api/client";

import {
useNavigate
} from "react-router-dom";

export default function AdminDashboard(){

const nav=
useNavigate();

const[
rows,
setRows
]=useState<any[]>([]);

useEffect(()=>{

load();

},[]);

async function load(){

const res=
await api.get(
"/admin/consumption"
);

setRows(
res.data
);

}

const tea=
rows.reduce(
(a,b)=>a+b.tea,
0
);

const coffee=
rows.reduce(
(a,b)=>a+b.coffee,
0
);

const total=
tea+coffee;

return(

<div className="min-h-screen bg-slate-100">

<header
className="
bg-white
border-b
px-10
py-5
flex
justify-between
items-center
"
>

<div>

<h1
className="
text-4xl
font-bold
text-slate-800
"
>

☕ Tea Admin

</h1>

<p
className="
text-gray-500
"
>

Daily Consumption Dashboard

</p>

</div>

<div
className="
flex
gap-3
"
>

<button

onClick={()=>{

nav(
"/admin/users"
)

}}

className="
bg-green-600
hover:bg-green-700
text-white
px-5
py-3
rounded-xl
"

>

Create User

</button>

<button

onClick={()=>{

localStorage.clear();

nav(
"/"
);

}}

className="
bg-red-500
text-white
px-5
py-3
rounded-xl
"

>

Logout

</button>

</div>

</header>

<div
className="
grid
grid-cols-3
gap-6
p-10
"
>

<Card
title="Tea"
value={tea}
/>

<Card
title="Coffee"
value={coffee}
/>

<Card
title="Total"
value={total}
/>

</div>

<div
className="
px-10
pb-10
"
>

<div
className="
bg-white
rounded-2xl
shadow
overflow-hidden
"
>

<div
className="
p-6
text-2xl
font-bold
"
>

User Consumption

</div>

<table
className="
w-full
"
>

<thead>

<tr
className="
bg-slate-100
"
>

<th className="p-4">

User

</th>

<th>

Tea

</th>

<th>

Coffee

</th>

<th>

Total

</th>

</tr>

</thead>

<tbody>

{

rows.map(
(r:any)=>(

<tr
key={
r.user
}

className="
border-t
hover:bg-gray-50
"
>

<td
className="
p-4
font-medium
"
>

{
r.user
}

</td>

<td>

{
r.tea
}

</td>

<td>

{
r.coffee
}

</td>

<td
className="
font-bold
"
>

{
r.total
}

</td>

</tr>

)

)

}

</tbody>

</table>

</div>

</div>

</div>

);

}

function Card({

title,
value

}:any){

return(

<div
className="
bg-white
rounded-2xl
shadow
p-8
"
>

<div
className="
text-gray-500
"
>

{
title
}

</div>

<div
className="
text-6xl
font-bold
mt-4
"
>

{
value
}

</div>

</div>

);

}
