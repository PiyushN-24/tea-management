import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Dashboard() {

  const navigate = useNavigate();

  const [drink, setDrink] =
    useState("tea");

  const [qty, setQty] =
    useState(1);

  async function order() {

    await api.post(
      "/orders",
      {
        user_id: 1,
        beverage: drink,
        quantity: qty
      }
    );

    alert(
      "Order submitted"
    );
  }

  return (

    <div className="p-10">

      <h1 className="text-3xl mb-6">
        ☕ Tea Dashboard
      </h1>

      <div className="bg-white shadow p-6 rounded w-[400px]">

        <label>
          Drink
        </label>

        <select
          className="border w-full p-2 mt-2"
          onChange={(e) =>
            setDrink(
              e.target.value
            )
          }
        >

          <option>
            tea
          </option>

          <option>
            coffee
          </option>

        </select>

        <label
          className="mt-4 block"
        >
          Quantity
        </label>

        <input
          type="number"
          min={1}
          value={qty}
          className="border p-2 w-full"
          onChange={(e) =>
            setQty(
              Number(
                e.target.value
              )
            )
          }
        />

        <button
          className="
          bg-green-600
          text-white
          mt-6
          w-full
          p-2
          rounded
          "
          onClick={order}
        >
          Order
        </button>

        <button
          className="
          mt-4
          border
          p-2
          w-full
          "
          onClick={() => {
            navigate("/orders");
          }}
        >
          View My Orders
        </button>

      </div>

    </div>

  );

}
