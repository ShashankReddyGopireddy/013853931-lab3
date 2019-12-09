import React, { Component } from "react";
import rootUrl from "../config/settings";
import { Redirect } from "react-router-dom";
import ItemCard from "./itemCard";
import Navbar from "../Navbar/navbar";
import axios from "axios";
import "./restHome.css";
import RestCuisines from "./restCuisines";
import swal from "sweetalert";

// var images = require.context('../../../../backend/uploads/', true);

class RestaurantHome extends Component {
  constructor() {
    super();
    this.state = {
      itemsByRestaurant: "",
      itemsByrestCuisine: "",
      itemUniqueTypes: "",
      itemQuantity: ""
    };
  }
  componentDidMount() {
    if (localStorage.getItem("itemsByRestaurant")) {
      let itemsByRestaurant = localStorage.getItem("itemsByRestaurant");
      let sessionItemDetails = JSON.parse(itemsByRestaurant);
      let lookup = {};
      let items = sessionItemDetails;
      let result = [];

      for (let item, i = 0; (item = items[i++]); ) {
        let itemtype = item.itemType;

        if (!(itemtype in lookup)) {
          lookup[itemtype] = 1;
          result.push(itemtype);
        }
      }
      console.log(sessionItemDetails.length);

      result.sort();
      console.log(result);
      let parseQuantity = '{"Quantity":[]}';
      for (let item, i = 0; (item = items[i++]); ) {
        let itemNameQ = item.itemName;

        parseQuantity = JSON.parse(parseQuantity);
        parseQuantity.Quantity.push({ itemName: itemNameQ, itemQuantity: 0 });
        parseQuantity = JSON.stringify(parseQuantity);
      }
      console.log(typeof parseQuantity);
      this.setState({
        itemsByRestaurant: sessionItemDetails,
        itemUniqueTypes: result,
        itemQuantity: parseQuantity
      });
    }
  }

  itemByItemType = itemType => {
    //e.preventDefault()
    console.log("in itemByItemType method");
    console.log(itemType);

    let itemsByRest = this.state.itemsByRestaurant;
    let itemsType = '{"requiredType":[]}';
    for (let i = 0; i < itemsByRest.length; i++) {
      let itemNameQ = itemsByRest[i];

      itemsType = JSON.parse(itemsType);

      if (itemNameQ.itemType === itemType) {
        itemsType.requiredType.push(itemNameQ);
      }
      itemsType = JSON.stringify(itemsType);
    }
    // itemsType = JSON.parse(itemsType);
    console.log(typeof itemsType);

    localStorage.setItem("itemSections", itemsType);

    this.setState({
      itemsByrestCuisine: itemsType
    });
  };

  togglePopup = (itemPrice, itemId, restId, itemQuantity, itemName) => {
    console.log("in togglePopup with Id: ");
    console.log(itemQuantity);
    let itemTotal = itemPrice * itemQuantity;
    const data = {
      //  itemId: item_id,
      itemName: itemName,
      itemId: itemId,
      restId: restId,
      itemQuantity: itemQuantity,
      itemTotal: itemTotal,
      userEmail: localStorage.getItem("userEmail")
    };
    console.log(data);
    if (itemQuantity > 0) {
      axios
        .post(rootUrl + "/cart/addToCart", data)
        .then(response => {
          console.log(response);
          if (response.status === 200) {
            swal("Success!", "Item Added to cart!", "success");
          } else {
            console.log("Didn't fetch items data");
          }
        })
        .catch(err => {
          if (err) {
            if (err.response.status === 406) {
              console.log("Error messagw", err.response.status);
              swal(err.response.data);
            } else {
              swal("Database connection failed. please try again later");
            }
          }
        });
    } else {
      alert("Quantity should me more than 0");
    }
  };

  handleIncrement = itemName => {
    let indItemQuantity = JSON.parse(this.state.itemQuantity);
    for (let i = 0; i < indItemQuantity.Quantity.length; i++) {
      if (indItemQuantity.Quantity[i].itemName == itemName) {
        indItemQuantity.Quantity[i].itemQuantity += 1;
      }
    }
    let stringitemQuant = JSON.stringify(indItemQuantity);
    this.setState({
      itemQuantity: stringitemQuant
    });
    console.log(this.state.itemQuantity);
  };

  handleDecrement = itemName => {
    let indItemQuantity = JSON.parse(this.state.itemQuantity);
    for (let i = 0; i < indItemQuantity.Quantity.length; i++) {
      if (indItemQuantity.Quantity[i].itemName == itemName) {
        if (indItemQuantity.Quantity[i].itemQuantity > 0)
          indItemQuantity.Quantity[i].itemQuantity -= 1;
      }
    }
    let stringitemQuant = JSON.stringify(indItemQuantity);
    this.setState({
      itemQuantity: stringitemQuant
    });
    console.log(this.state.itemQuantity);
  };

  render() {
    let redirectVar = null;
    let itemDetails = null;

    if (!this.state.itemsByRestaurant) {
      redirectVar = <Redirect to="/searchresults" />;
    }
    let i = -1;
    let route = null;
    if (this.state.itemsByrestCuisine) {
      route = JSON.parse(this.state.itemsByrestCuisine);
      route = route.requiredType;
      localStorage.removeItem("itemSections");
    } else if (this.state.itemsByRestaurant) {
      route = this.state.itemsByRestaurant;
    }
    console.log(route);

    if (route) {
      itemDetails = route.map((item, index) => {
        let quant = JSON.parse(this.state.itemQuantity);

        i = i + 1;
        return (
          <ItemCard
            key={item.itemId}
            itemIndividual={item}
            quantity={quant}
            handleDecrement={this.handleDecrement.bind(this)}
            handleIncrement={this.handleIncrement.bind(this)}
            togglePopup={this.togglePopup.bind(this)}
          />
        );
      });
      let itemPanel = this.state.itemUniqueTypes.map((itemtype, ind) => {
        return (
          <RestCuisines
            //key={cuisine.cuisineId}
            itemTypeIndividual={itemtype}
            itemByItemType={this.itemByItemType.bind(this)}
          />
        );
      });
      let {
        restName,
        restImage,
        restAddress,
        restPhone
      } = this.state.itemsByRestaurant[0];
      if (restImage === "" || restImage === null) {
        restImage = "restaurant.jpg";
      }
      let unknown = rootUrl + "/profile/download-file/" + restImage;
      // let resimg = new Image();
      // resimg = unknown;

      return (
        <div>
          {redirectVar}
          <Navbar />
          <div className="container" id="container">
            <img
              src="data:image/jpeg;base64,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"
              id="restHomeImage"
              alt="..."
            />
            <div>
              <div className="rest-home-details" id="rest-home-details">
                <h2 className="rest-title" id="rest-title">
                  {restName}
                </h2>
                <span>
                  <p className="text-left" id="text-left">
                    {restAddress}
                  </p>
                  <p className="text-phone" id="text-left">
                    {" "}
                    Phone: {restPhone}
                  </p>
                </span>
              </div>
            </div>
            <div className="item-type-Left" id="left-items">
              <div className="list-group">{itemPanel}</div>
            </div>
            <div id="right-items" className="rest-item-Right">
              <div className="card-group">{itemDetails}</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Navbar />
          <h3>No Items found. </h3>
        </div>
      );
    }
  }
}

export default RestaurantHome;
