import React, { Component } from "react";
import Navbar from "../Navbar/navbar";
import swal from "sweetalert";
import rootUrl from "../config/settings";
import axios from "axios";
import CartCard from "./cartCard";
import cookie from "react-cookies";
import "./cartCardcss.css";
import { Redirect } from "react-router";

class Cart extends Component {
  constructor() {
    super();
    this.state = {
      cartItems: "",
      cartTotal: ""
    };
  }
  componentDidMount = () => {
    const data = {
      userEmail: localStorage.getItem("userEmail")
    };
    axios.post(rootUrl + "/cart/showCart", data).then(response => {
      console.log(response);
      if (response.status === 200) {
        console.log(response.data);
        console.log("data received");
        let itemsInCart = JSON.stringify(response.data);
        this.setState({
          cartItems: itemsInCart
        });
      } else {
        console.log("Didn't fetch items data");
      }
    });
  };

  placeOrder = () => {
    const data = {
      userEmail: localStorage.getItem("userEmail")
    };
    axios.post(rootUrl + "/orders/orderItems", data).then(response => {
      console.log(response);
      if (response.status === 200) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        swal("Success", "Your order has been placed", "success");

        // this.props.history.push('/searchresults')
      } else {
        console.log("Didn't fetch items data");
      }
    });
  };
  deleteFromCart = i => {
    console.log(i);
    const data = {
      i: i,

      userEmail: localStorage.getItem("userEmail")
    };
    axios.post(rootUrl + "/cart/deleteCartItem", data).then(response => {
      console.log(response);
      if (response.status === 200) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        swal("Success", "Item Deleted from Cart", "success");

        // this.props.history.push('/searchresults')
      } else {
        console.log("Didn't fetch items data");
      }
    });
  };
  render() {
    let redirectVar;
    if (localStorage.getItem("accountType") !== "1") {
      redirectVar = <Redirect to="/login" />;
    }

    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }
    let cart = "";
    let route = "";
    if (this.state.cartItems) {
      route = JSON.parse(this.state.cartItems);
    }
    let cartTotal = 0;
    if (route) {
      cart = route.map((cartItem, index) => {
        cartTotal += cartItem.itemTotal;
        return (
          <CartCard
            key={cartItem.i}
            itemIndividual={cartItem}
            deleteFromCart={this.deleteFromCart.bind(this)}
          />
        );
      });
      let message = "";
      if (cartTotal === 0) {
        message = "Your Cart is empty. Please add food to cart to place order.";
      }
      return (
        <div>
          {redirectVar}
          <Navbar />
          <div>
            {cart}
            {message}
            <span id="placeorder">
              <p id="carttotal">Your cart total : ${cartTotal}</p>
              <button onClick={this.placeOrder} className="btn btn-success">
                Place Order
              </button>
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h5>Your cart is Emply. Add items to cart to purchase...</h5>
        </div>
      );
    }
  }
}

export default Cart;
