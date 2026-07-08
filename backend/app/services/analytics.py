from sqlalchemy import func
from datetime import date,timedelta

def summary(db,start,end):

return (

    db.query(
        Order.beverage,
        func.sum(
            Order.quantity
        )
    )
    .filter(Order.order_date >= start)
    .filter(Order.order_date <= end)
    .group_by(Order.beverage)
    .all()
)

get_today_summary()
get_weekly_summary()
get_monthly_summary()
compare_dates()
consumption_by_location()
top_consumers()
daily_trend()
