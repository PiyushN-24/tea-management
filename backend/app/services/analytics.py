from sqlalchemy import func
from datetime import date,timedelta

def summary(

db,

start,

end

):

return (

db.query(

Order.beverage,

func.sum(
Order.quantity
)

)

.filter(

Order.order_date
>=
start

)

.filter(

Order.order_date
<=
end

)

.group_by(

Order.beverage

)

.all()

)
