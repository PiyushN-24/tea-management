import {
  useState
}
from "react";

import {
  useNavigate
}
from "react-router-dom";

import api
from "../api/client";


export default function CreateUser() {

  const nav =
    useNavigate();

  const [
    form,
    setForm
  ] = useState({

    name: "",

    employee_code: "",

    email: "",

    password: "",

    role: "user"

  });


  async function save() {

    await api.post(
      "/admin/users",
      form
    );

    alert(
      "User Created"
    );

    nav(
      "/admin"
    );

  }


  return (

    <div
      className="
      min-h-screen
      bg-gray-100
      "
    >

      <div
        className="
        max-w-xl
        mx-auto
        mt-10
        bg-white
        shadow
        rounded-xl
        p-8
        "
      >

        <h1
          className="
          text-3xl
          mb-6
          "
        >

          Create User

        </h1>


        {

          [

            "name",

            "employee_code",

            "email",

            "password"

          ]

          .map(

            (

              f

            ) => (

              <input

                key={
                  f
                }

                placeholder={
                  f
                }

                className="
                border
                w-full
                mb-4
                p-3
                "

                onChange={

                  (

                    e

                  ) =>

                    setForm({

                      ...form,

                      [f]:
                      e.target.value

                    })

                }

              />

            )

          )

        }


        <select

          className="
          w-full
          p-3
          border
          "

          onChange={

            (

              e

            ) =>

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


        <div
          className="
          flex
          gap-3
          mt-6
          "
        >

          <button

            className="
            flex-1
            border
            p-3
            rounded
            "

            onClick={() =>

              nav(
                "/admin"
              )

            }

          >

            Back

          </button>


          <button

            className="
            flex-1
            bg-green-600
            text-white
            p-3
            rounded
            "

            onClick={
              save
            }

          >

            Create

          </button>

        </div>

      </div>

    </div>

  );

}
