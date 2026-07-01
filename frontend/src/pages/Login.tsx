import { useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate =
    useNavigate();

  const [
    email,
    setEmail
  ] = useState("");

  const [
    password,
    setPassword
  ] = useState("");

  const [
    show,
    setShow
  ] =
  useState(
    false
  );


  async function login() {

    try {

      const res =
        await api.post(
          "/auth/login",
          {
            email,
            password
          }
        );

      localStorage.setItem(

        "user",

        JSON.stringify(
          res.data
        )

      );

      alert(
        "Login successful"
      );


      if (

        res.data.role ===
        "admin"

      ) {

        navigate(
          "/admin"
        );

      }

      else {

        navigate(
          "/dashboard"
        );

      }

    }

    catch {

      alert(
        "login failed"
      );

    }

  }


  return (

<div className="min-h-screen flex justify-center items-center bg-gray-100">

<div className="bg-white p-8 rounded shadow w-96">

<h1 className="text-3xl mb-6">

☕ Tea Management

</h1>


<input

className="
border
w-full
p-2
mb-4
"

placeholder="Email"

value={
email
}

onChange={

(e)=>

setEmail(
e.target.value
)

}

/>


<input

type={

show
?

"text"

:

"password"

}

className="
border
w-full
p-2
mb-3
"

placeholder="Password"

value={
password
}

onChange={

(e)=>

setPassword(
e.target.value
)

}

/>


<label
className="
flex
items-center
gap-2
mb-4
text-sm
text-gray-600
"
>

<input

type="checkbox"

checked={
show
}

onChange={() => {

setShow(
!show
)

}}

>

</input>

Show Password

</label>


<button

onClick={
login
}

className="
bg-green-600
text-white
w-full
p-2
rounded
"

>

Login

</button>

</div>

</div>

);

}
