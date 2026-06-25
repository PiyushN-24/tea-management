import { useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Dashboard(){

const navigate=
useNavigate();

const user=
JSON.parse(
localStorage.getItem(
"user"
)||"{}"
);

const[
drink,
setDrink
]=useState(
"tea"
);

const[
qty,
setQty
]=useState(
1
);

async function order(){

try{

await api.post(
"/orders",
{

user_id:
user.id,

beverage:
drink,

quantity:
qty

}
);

alert(
"Order Submitted"
);

}catch(err:any){

alert(

err?.response?.data?.detail
||
"Failed"

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

<div
className="
min-h-screen
bg-gray-100
"
>

<nav
className="
bg-green-700
text-white
p-5
flex
justify-between
"
>

<div>

☕

Tea Portal

</div>

<button
onClick={
logout
}
>

Logout

</button>

</nav>

<div
className="
max-w-xl
mx-auto
mt-10
bg-white
rounded-xl
shadow
p-8
"
>

<h1
className="
text-3xl
mb-6
"
>

Order Beverage

</h1>

<select

value={
drink
}

onChange={
(e)=>
setDrink(
e.target.value
)
}

className="
w-full
border
p-3
mb-4
"

>

<option>

tea

</option>

<option>

coffee

</option>

</select>

<input

type="number"

value={
qty
}

min={1}

onChange={
(e)=>

setQty(

Number(
e.target.value
)

)

}

className="
w-full
border
p-3
mb-6
"

/>

<button

onClick={
order
}

className="
bg-green-600
text-white
w-full
rounded
p-3
"

>

Submit

</button>

<button

className="
mt-4
border
w-full
p-3
"

onClick={()=>

navigate(
"/orders"
)

}

>

My Orders

</button>

</div>

</div>

);

}
