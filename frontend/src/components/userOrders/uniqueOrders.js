import React, { Component } from "react";
import OrderItems from "./orderItems";
import "./pastOrders.css";

class UniqueOrders extends Component {
  render() {
    let order = this.props.orderIndividual;
    console.log("this.props.itemindividual", order);

    let orderTotal = 0;
    let newstatus = "";
    // let orderId = this.props.orderIndividual.orderId
    let orderitems = "";
    orderitems = order.items.map((items, index) => {
      orderTotal += items.itemTotal;

      let status = order.orderStatus;
      newstatus = "status: " + status;

      console.log("items in mapping: ", items);
      return <OrderItems key={order._id} itemsInOrder={items} />;
    });

    return (
      <div>
        <div className="past-orders border-secondary mb-3" id="past-orders">
          <h5 className="card-header w-75 text-left">
            orderId: &nbsp;&nbsp;&nbsp;&nbsp; {newstatus}
          </h5>
          <div className="card-body ">
            {orderitems}
            <p className="text-danger  text-left">Total: ${orderTotal}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default UniqueOrders;
