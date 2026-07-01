import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function ResetPassword(){

const nav=useNavigate();

const user=
JSON.parse(
localStorage.getItem(
"user"
)||"{}"
);

const[
oldPassword,
setOldPassword
]=useState("");

const[
newPassword,
setNewPassword
]=useState("");

const[
confirm,
setConfirm
]=useState("");

async function save(){

if(
newPassword!==confirm
){

alert(
"Passwords mismatch"
);

return;

}

try{

await api.put(

"/auth/reset-password",

null,

{

params:{

email:user.email,

old:oldPassword,

new:newPassword

}

}

);

alert(
"Password Updated"
);

nav(
"/dashboard"
);

}catch{

alert(
"Update Failed"
);

}

}

return(

<div className="min-h-screen bg-gray-100">

<div className="max-w-md mx-auto mt-20 bg-white shadow rounded p-8">

<h1 className="text-2xl mb-6">

Reset Password

</h1>

<input
type="password"
placeholder="Current Password"
className="border p-3 w-full mb-4"
onChange={(e)=>
setOldPassword(
e.target.value
)}
/>

<input
type="password"
placeholder="New Password"
className="border p-3 w-full mb-4"
onChange={(e)=>
setNewPassword(
e.target.value
)}
/>

<input
type="password"
placeholder="Confirm Password"
className="border p-3 w-full mb-6"
onChange={(e)=>
setConfirm(
e.target.value
)}
/>

<div className="flex gap-3">

<button
className="border flex-1 p-3"
onClick={()=>{

nav(
"/dashboard"
);

}}
>

Back

</button>

<button
className="bg-green-600 text-white flex-1 p-3"
onClick={save}
>

Save

</button>

</div>

</div>

</div>

);

}
