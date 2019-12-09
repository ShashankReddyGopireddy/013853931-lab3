import React, { Component, PureComponent } from "react";
import Navbar from "../Navbar/navbar";
import RestCard from "./restCards";
import LeftPanel from "./leftPanel";
import axios from "axios";
import { Redirect } from "react-router-dom";
import rootUrl from "../config/settings";
import cookie from "react-cookies";
import "./cardstyles.css";

class searchResults extends Component {
  constructor() {
    super();
    this.state = {
      restSearchResults: "",
      restCuisineResults: "",
      uniquecuisines: "",
      update: false,
      cuisineres: ""
    };
  }

  async componentDidMount() {
    if (localStorage.getItem("restaurantResults")) {
      let restResultsBySearch = localStorage.getItem("restaurantResults");
      let restDetails = JSON.parse(restResultsBySearch);
      this.setState({
        restSearchResults: restDetails
      });
      console.log(restDetails);
    }
    let cuisineDetails = JSON.parse(localStorage.getItem("restaurantResults"));
    let lookup = {};
    let items = cuisineDetails;
    let result = [];

    for (let item, i = 0; (item = items[i++]); ) {
      let itemtype = item.cuisineName;

      if (!(itemtype in lookup)) {
        lookup[itemtype] = 1;
        result.push(itemtype);
      }
    }
    console.log(result);
    result.sort();
    await this.setState({
      uniquecuisines: result
    });

    console.log("unique", this.state.uniquecuisines);

    if (this.state.cuisineres) {
      let restResultsBySearch = this.state.cuisineres;
      // let restDetails = JSON.parse(restResultsBySearch);
      this.setState({
        restCuisineResults: restResultsBySearch
      });
    }
  }

  visitRestaurant = restId => {
    console.log("in VisitRestaurant method");
    console.log(restId);

    const data = {
      restId: restId,
      userEmail: localStorage.getItem("userEmail")
    };
    axios
      .post(rootUrl + "/restaurant/itemsByRestaurant", data)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          let itemDetails = JSON.stringify(response.data);

          console.log("hshhhs", response.data);

          localStorage.setItem("itemsByRestaurant", itemDetails);
          console.log("itemDetails:" + typeof itemDetails);
          this.props.history.push("/resthome");
        } else {
          console.log("Didn't fetch items data");
        }
      });
  };
  visitCuisine = async cuisineName => {
    alert("hi");
    //e.preventDefault()
    console.log("in VisitCuisine method");
    console.log(cuisineName);

    //console.log(copyResults[id])
    let itemName = localStorage.getItem("itemName");
    const data = {
      cuisineName: cuisineName,
      itemName: itemName,
      userEmail: localStorage.getItem("userEmail")
    };
    console.log(data);
    let resultdet = [];
    if (cuisineName) {
      this.state.restSearchResults.map((cusineres, ind) => {
        if (cusineres.cuisineName == cuisineName) {
          resultdet.push(cusineres);
        }
      });

      console.log("results", resultdet);
      this.setState({
        cuisineres: resultdet
      });

      // localStorage.setItem("restCuisineDetails", results);
      // window.location.reload();

      // axios
      //   .post(rootUrl + "/restaurant/restaurantsbyItemCuisine", data)
      //   .then(response => {
      //     console.log(response);
      //     if (response.status === 200) {
      //       let restCuisineDetails = JSON.stringify(response.data);
      //       console.log(response.data);

      //       localStorage.setItem("restCuisineDetails", restCuisineDetails);
      //       console.log("itemDetails:" + restCuisineDetails);
      //       window.location.reload();
      //       // this.props.history.push('/searchresults')
      //     } else {
      //       console.log("Didn't fetch items data");
      //     }
      //   });
    } else {
      alert("Please try again");
    }
  };

  render() {
    let redirectVar = null;
    if (localStorage.getItem("accountType") !== "1") {
      redirectVar = <Redirect to="/login" />;
    }

    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }
    let route = null;

    if (this.state.restSearchResults) {
      route = this.state.restSearchResults;
    }
    console.log("route", route);

    console.log(
      "cusine resssssssssssss",
      this.state.cuisineres,
      this.state.restCuisineResults
    );
    if (this.state.cuisineres) {
      route = this.state.cuisineres;
      localStorage.removeItem("restCuisineDetails");
    }
    console.log("route", route);
    if (route) {
      let restCards = route.map((restaurant, index) => {
        return (
          <RestCard
            key={restaurant.restId}
            restIndividual={restaurant}
            visitRest={this.visitRestaurant.bind(this)}
          />
        );
      });

      let cuisinePanel = this.state.uniquecuisines.map((cuisine, ind) => {
        return (
          <LeftPanel
            key={cuisine}
            cuisineIndividual={cuisine}
            visitCuisine={this.visitCuisine.bind(this)}
          />
        );
      });
      return (
        <div>
          {/* {redirectVar} */}
          <Navbar />
          <div>
            <div className="restLeft" id="left">
              <div className="list-group">{cuisinePanel}</div>
            </div>
            <div id="right">
              <div id="search-results-text">
                <p style={{ marginLeft: "-900px" }}>Your Search Results....</p>
              </div>
              <div className="card-group">{restCards}</div>
            </div>
          </div>
        </div>
      );
    }
    // let restCards = this.state.people.map(person => {
    //     return (
    //         <RestCard key={person.id} removePerson={this.removePerson.bind(this)} person={person} />
    //     )
    // })
    else {
      return (
        <div>
          <Navbar />
          {/* {redirectVar} */}
          <h3>No Items found. </h3>
        </div>
      );
    }
  }
}

export default searchResults;
