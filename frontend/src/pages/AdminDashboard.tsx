import {
  useEffect,
  useState
} from "react";

import api from "../api/client";

import {
  useNavigate
} from "react-router-dom";


export default function AdminDashboard() {

  const nav =
    useNavigate();

  const [
    rows,
    setRows
  ] = useState<any[]>([]);

  const [
    query,
    setQuery
  ] = useState("");

  const [
    history,
    setHistory
  ] = useState<any[]>([]);

  const [
    weekly,
    setWeekly
  ] = useState({
    tea: 0,
    coffee: 0
  });

  const [
    monthly,
    setMonthly
  ] = useState({
    tea: 0,
    coffee: 0
  });

  const [
    compare,
    setCompare
  ] = useState<any>();

  const [
    day,
    setDay
  ] = useState("");


  useEffect(() => {

    load();

  }, []);


  async function load() {

    const res =
      await api.get(
        "/admin/consumption"
      );

    setRows(
      res.data
    );


    const w =
      await api.get(
        "/admin/weekly"
      );

    setWeekly(
      w.data
    );


    const m =
      await api.get(
        "/admin/monthly"
      );

    setMonthly(
      m.data
    );

  }


  async function search() {

    const res =
      await api.get(

        `/admin/search?query=${query}`

      );

    setHistory(
      res.data
    );

  }


  async function compareDate() {

    const res =

      await api.get(

        `/admin/compare?day=${day}`

      );

    setCompare(
      res.data
    );

  }


  const tea =
    rows.reduce(
      (a, b) =>
        a + b.tea,
      0
    );

  const coffee =
    rows.reduce(
      (a, b) =>
        a + b.coffee,
      0
    );

  const total =
    tea + coffee;


  return (

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

onClick={() => {

nav(
"/admin/users"
)

}}

className="
bg-green-600
text-white
px-5
py-3
rounded-xl
"

>

Create User

</button>


<button

onClick={() => {

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
grid-cols-5
gap-5
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

<Card
title="Weekly"
value={
weekly.tea +
weekly.coffee
}
/>

<Card
title="Monthly"
value={
monthly.tea +
monthly.coffee
}
/>

</div>



<div
className="
px-10
"
>

<div
className="
bg-white
rounded-xl
shadow
p-6
mb-8
"
>

<h2
className="
text-xl
mb-4
"
>

Compare Consumption

</h2>


<div
className="
flex
gap-3
"
>

<input

type="date"

className="
border
p-3
rounded
"

onChange={

(e)=>

setDay(
e.target.value
)

}

/>


<button

className="
bg-green-600
text-white
px-5
rounded
"

onClick={
compareDate
}

>

Compare

</button>

</div>


{

compare && (

<div
className="
mt-6
space-y-2
"
>

<div>

Today:

Tea {
compare.today.tea
}

Coffee {
compare.today.coffee
}

</div>


<div>

Selected:

Tea {
compare.selected.tea
}

Coffee {
compare.selected.coffee
}

</div>

</div>

)

}

</div>

</div>



<div
className="
px-10
"
>

<div
className="
bg-white
rounded-xl
shadow
p-6
mb-6
"
>

<div
className="
flex
gap-3
"
>

<input

placeholder="
Search Name / Email / Employee Code
"

className="
border
flex-1
p-3
rounded
"

onChange={

(e)=>

setQuery(
e.target.value
)

}

/>


<button

className="
bg-green-600
text-white
px-6
rounded
"

onClick={
search
}

>

Search

</button>

</div>

</div>

</div>



<div
className="
px-10
pb-10
space-y-8
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
(
r:any
)=>(

<tr
key={
r.user
}

className="
border-t
"
>

<td className="p-4">

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

<td>

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



<div
className="
bg-white
rounded-xl
shadow
p-6
"
>

<h2
className="
text-2xl
font-bold
"
>

Orders (Last 3 Months)

</h2>


<table
className="
w-full
mt-4
"
>

<thead>

<tr>

<th>

User

</th>

<th>

Emp Code

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

history.map(
(
r:any,
i
)=>(

<tr
key={
i
}

className="
border-t
"
>

<td>

{
r.user
}

</td>

<td>

{
r.employee
}

</td>

<td>

{
r.drink
}

</td>

<td>

{
r.qty
}

</td>

<td>

{
r.date
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

}: any) {

return (

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
text-5xl
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
