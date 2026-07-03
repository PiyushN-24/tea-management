import { useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [drink, setDrink] = useState("tea");

  const [qty, setQty] = useState(1);

  const [location, setLocation] = useState("Giripeth");

  async function order() {

    try {

      await api.post(
        "/orders",
        {
          user_id: user.id,
          beverage: drink,
          quantity: qty,
          location: location
        }
      );

      alert("Order Submitted");

    } catch (err: any) {

      alert(
        err?.response?.data?.detail ||
        "Failed"
      );

    }

  }

  function logout() {

    localStorage.removeItem("user");

    navigate("/");

  }

  return (

    <div className="min-h-screen bg-gray-100">

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

          ☕ Tea Portal

        </div>

        <button onClick={logout}>

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

        <label
          className="
            block
            mb-2
            font-semibold
          "
        >

          Today's Location

        </label>

        <select

          value={location}

          onChange={(e) =>
            setLocation(e.target.value)
          }

          className="
            w-full
            border
            p-3
            rounded
            mb-5
          "

        >

          <option value="Giripeth">

            Giripeth

          </option>

          <option value="Gupta House">

            Gupta House

          </option>

          <option value="Joshi Office">

            Joshi Office

          </option>

          <option value="Pune Office">

            Pune Office

          </option>

        </select>

        <label
          className="
            block
            mb-2
            font-semibold
          "
        >

          Beverage

        </label>

        <select

          value={drink}

          onChange={(e) =>
            setDrink(e.target.value)
          }

          className="
            w-full
            border
            p-3
            rounded
            mb-4
          "

        >

          <option value="tea">

            Tea

          </option>

          <option value="coffee">

            Coffee

          </option>

        </select>

        <label
          className="
            block
            mb-2
            font-semibold
          "
        >

          Quantity

        </label>

        <input

          type="number"

          value={qty}

          min={1}

          onChange={(e) =>
            setQty(Number(e.target.value))
          }

          className="
            w-full
            border
            p-3
            rounded
            mb-6
          "

        />

        <button

          onClick={order}

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
            rounded
          "

          onClick={() =>
            navigate("/orders")
          }

        >

          My Orders

        </button>

        <button

          className="
            mt-3
            border
            w-full
            p-3
            rounded
          "

          onClick={() => {

            navigate("/reset");

          }}

        >

          Reset Password

        </button>

      </div>

    </div>

  );

}

