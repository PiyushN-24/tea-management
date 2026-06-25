import {
useEffect,
useState
} from "react";

import {
useNavigate
} from "react-router-dom";

import api from "../api/client";

export default function AdminDashboard(){

const navigate=
useNavigate();

const [
users,
setUsers
]=useState<any[]>([]);

const [
summary,
setSummary
]=useState({
tea:0,
coffee:0
});

useEffect(()=>{

load();

},[]);

async function load(){

try{

const consumption=
await api.get(
"/admin/consumption"
);

setUsers(
consumption.data
);

const totals=
await api.get(
"/admin/summary"
);

setSummary(
totals.data
);

}catch(e){

console.log(
e
);

}

}

function logout(){

localStorage.removeItem(
"user"
);

navigate(
"/"
);

}

return(

<div className="p-10">

<div className="flex justify-between">

<h1 className="text-3xl">

☕ Admin Dashboard

</h1>

<div className="space-x-2">

<button

className="
bg-blue-600
text-white
px-4
py-2
"

onClick={()=>{

navigate(
"/admin/users"
)

}}

>

Create User

</button>

<button

className="
bg-red-500
text-white
px-4
py-2
"

onClick={
logout
}

>

Logout

</button>

</div>

</div>

<div
className="
grid
grid-cols-3
gap-4
mt-8
"
>

<div
className="
shadow
p-6
rounded
"
>

Tea

<h2
className="
text-3xl
"
>

{
summary.tea
}

</h2>

</div>

<div
className="
shadow
p-6
rounded
"
>

Coffee

<h2
className="
text-3xl
"
>

{
summary.coffee
}

</h2>

</div>

<div
className="
shadow
p-6
rounded
"
>

Total

<h2
className="
text-3xl
"
>

{
summary.tea+
summary.coffee
}

</h2>

</div>

</div>

<div
className="
mt-10
"
>

<h2
className="
text-2xl
mb-4
"
>

User Consumption

</h2>

<table
className="
w-full
border
"
>

<thead>

<tr>

<th>User</th>

<th>Tea</th>

<th>Coffee</th>

<th>Total</th>

</tr>

</thead>

<tbody>

{

users.map(
(u:any)=>(

<tr
key={
u.user
}
>

<td>

{
u.user
}

</td>

<td>

{
u.tea
}

</td>

<td>

{
u.coffee
}

</td>

<td>

{
u.total
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

);

}
