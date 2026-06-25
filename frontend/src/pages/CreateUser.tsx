import {
useState
}
from "react";

import api
from "../api/client";

export default function CreateUser(){

const[
form,
setForm
]=useState({

name:"",
email:"",
password:"",
role:"user"

});

async function save(){

await api.post(

"/admin/users",

form

);

alert(
"created"
);

}

return(

<div
className="
p-10
"
>

<h1>

Create User

</h1>

<input

placeholder="Name"

className="
border
block
mb-3
"

onChange={(e)=>

setForm({

...form,

name:
e.target.value

})

}

/>

<input

placeholder="Email"

className="
border
block
mb-3
"

onChange={(e)=>

setForm({

...form,

email:
e.target.value

})

}

/>

<input

placeholder="Password"

className="
border
block
mb-3
"

onChange={(e)=>

setForm({

...form,

password:
e.target.value

})

}

/>

<select

onChange={(e)=>

setForm({

...form,

role:
e.target.value

})

}

>

<option>

user

</option>

<option>

admin

</option>

</select>

<button

onClick={save}

className="
bg-green-600
text-white
mt-4
p-2
"

>

Create

</button>

</div>

);

}
