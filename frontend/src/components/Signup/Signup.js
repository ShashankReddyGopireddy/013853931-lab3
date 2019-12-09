import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Navbar from "../Navbar/Navbar";
import { signup } from "../../redux/actions/index";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class signUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: "",
      Password: "",
      FullName: "",
      PhoneNumber: "",
      Address: "",
      ZipCode: "",
      Accounttype: "",
      RestName: "",
      RestAdr: "",
      RestZip: "",
      RestPhone: ""
    };
    this.handleValidation = this.handleValidation.bind(this);
  }

  // validateForm() {
  //   return this.state.Email.length > 0 && this.state.Password.length > 0 && this.state.FullName.length >0;
  // }

  // componentWillMount(){
  //   this.setState({
  //       authFlag : false
  //   })
  // }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    console.log(this.state);
  };

  setUserType(event) {
    console.log(event.target.value);
    var value = event.target.value;
    if (value == "owner") {
      this.setState({
        Accounttype: 2
      });
    } else {
      this.setState({
        Accounttype: 1
      });
    }
    console.log(this.state);
  }

  handleValidation() {
    let formIsValid = true;
    console.log(this.state.Accounttype);

    if (
      this.state.FullName == "" ||
      !this.state.PhoneNumber == "" ||
      !this.state.Email == "" ||
      !this.state.Password == "" ||
      !this.state.ZipCode == "" ||
      !this.state.Address == ""
    ) {
      formIsValid = false;
      alert("All fields are Required");
      console.log("cannot be empty");
    }
    if (this.state.Accounttype === 2) {
      if (
        this.state.RestName == "" ||
        this.state.RestAdr == "" ||
        this.state.RestPhone == "" ||
        this.state.RestZip == ""
      ) {
        formIsValid = false;
        alert("All fields are Required");
        console.log("rest cannot be empty");
      }
    }
    return formIsValid;
  }

  signUp = event => {
    event.preventDefault();
    //if(this.handleValidation()){
    var data = {
      Email: this.state.Email,
      Password: this.state.Password,
      FullName: this.state.FullName,
      PhoneNumber: this.state.PhoneNumber,
      Address: this.state.Address,
      ZipCode: this.state.ZipCode,
      Accounttype: this.state.Accounttype,
      RestName: this.state.RestName,
      RestAdr: this.state.RestAdr,
      RestZip: this.state.RestZip,
      RestPhone: this.state.RestPhone
    };
    console.log(data);

    this.props.signup(data);
    //}
  };

  render() {
    let redirectVar = null;
    console.log("signupstatestore", this.props.signupStateStore.result);
    if (this.props.signupStateStore.result) {
      if (this.props.signupStateStore.result.isNewUserCreated === true) {
        redirectVar = <Redirect to="/login" />;
      }
    }
    let restoDetails = null;
    if (this.state.Accounttype === 2) {
      restoDetails = (
        <div>
          <Form.Group controlId="RestName">
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Control
              autoFocus
              value={this.state.name}
              onChange={this.handleChange}
              type="text"
            />
          </Form.Group>
          <Form.Group controlId="RestAdr">
            <Form.Label>Restaurant Address</Form.Label>
            <Form.Control
              value={this.state.name}
              onChange={this.handleChange}
              type="text"
            />
          </Form.Group>
          <Form.Group controlId="RestZip">
            <Form.Label>Restaurant ZipCode</Form.Label>
            <Form.Control
              value={this.state.name}
              onChange={this.handleChange}
              type="number"
            />
          </Form.Group>
          <Form.Group controlId="RestPhone">
            <Form.Label>Restaurant Phone</Form.Label>
            <Form.Control
              value={this.state.name}
              onChange={this.handleChange}
              type="number"
            />
          </Form.Group>
        </div>
      );
    }

    return (
      <div>
        <Navbar />
        {redirectVar}
        <div className="container fill-graywhite">
          <div className="container content">
            <div className="login-container">
              <div className="Login">
                <div>
                  <h2 align="center">Sign Up now!!</h2>
                </div>
                <form align="center">
                  <div className="form-row">
                    <Form.Group
                      controlId="FullName"
                      className="form-group col-md-6"
                    >
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        autoFocus
                        value={this.state.name}
                        onChange={this.handleChange}
                        type="text"
                      />
                    </Form.Group>
                    <Form.Group
                      controlId="Email"
                      className="form-group col-md-6"
                    >
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                  </div>
                  <div className="form-row">
                    <Form.Group
                      controlId="Password"
                      className="form-group col-md-6"
                    >
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        value={this.state.password}
                        onChange={this.handleChange}
                        type="password"
                      />
                    </Form.Group>
                    <Form.Group
                      controlId="PhoneNumber"
                      className="form-group col-md-6"
                    >
                      <Form.Label>PhoneNumber</Form.Label>
                      <Form.Control
                        value={this.state.name}
                        onChange={this.handleChange}
                        type="number"
                      />
                    </Form.Group>
                  </div>
                  <div className="form-row">
                    <Form.Group
                      controlId="Address"
                      className="form-group col-md-6"
                    >
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        value={this.state.name}
                        onChange={this.handleChange}
                        type="text"
                      />
                    </Form.Group>
                    <Form.Group
                      controlId="ZipCode"
                      className="form-group col-md-6"
                    >
                      <Form.Label>ZipCode</Form.Label>
                      <Form.Control
                        value={this.state.name}
                        onChange={this.handleChange}
                        type="number"
                      />
                    </Form.Group>
                  </div>

                  <div onChange={this.setUserType.bind(this)}>
                    <input type="radio" name="usertype" value="user" /> Buyer
                    &nbsp;
                    <input type="radio" name="usertype" value="owner" /> Owner
                  </div>
                  {restoDetails}
                  <Button
                    className="btn btn-primary"
                    block
                    type="button"
                    onClick={this.signUp}
                  >
                    {" "}
                    Create an account{" "}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  signupStateStore: state.signup
});
export default connect(
  mapStateToProps,
  { signup }
)(signUp);
