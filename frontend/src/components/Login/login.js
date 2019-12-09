import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import logo from "../../images/login-page.jpg";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import rootUrl from "../config/settings";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address format")
    .required("Email is required"),
  password: Yup.string().required("Password is required")
});

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      authFlag: "false"
    };

    this.submitLogin = this.submitLogin.bind(this);
  }

  submitLogin = details => {
    console.log("Inside submit login", details);
    const data = {
      userEmail: details.email,
      userPassword: details.password
    };
    //set the with credentials to true
    // axios.defaults.withCredentials = true;
    //make a post request with the user data
    await this.props.client.query({
      query : checkUEmail,
      variables: {
          userEmail:userEmail,
          password : password
      }
  })
  .then(async (response)=>{
      console.log("res",response)
      console.log(response.data)
      if(response.data.User.status==200){
          await this.setState({
              logsuccess:true  
          })

          localStorage.setItem('logsuccess',true)
      }
      else if(response.data.User.status==400 || response.data.User.status==401 ){
      await this.setState({
              logsuccess:false  
          })

          localStorage.setItem('logsuccess',false)
          alert("invalid credentials")
      }
  
    
  }).catch((err)=>{
      alert("in error")
      console.log(err)
  })
      .catch(error => {
        console.log("In error");
        this.setState({
          authFlag: "false"
        });
        console.log(error);
        alert("User credentials not valid. Please try again!");
      });
  };

  render() {
    // console.log("test cookie",cookie.load('username-localhost-8888'))
    let redirectVar = null;
    if (cookie.load("cookie")) {
      // if(this.state.authFlag===true){

      if (localStorage.getItem("accountType") === "2") {
        redirectVar = <Redirect to="/ownerhome" />;
      } else if (localStorage.getItem("accountType") === "1") {
        console.log("hello");
        redirectVar = <Redirect to="/userhome" />;
      }
    }
    return (
      <div className="container-fluid">
        {redirectVar}
        <div className="row align-items-center h-100 ">
          <div className="col-md-6-fluid">
            <img
              src="https://media-cdn.grubhub.com/image/upload/c_scale,w_1650/q_50,dpr_auto,f_auto,fl_lossy,c_crop,e_vibrance:20,g_center,h_900,w_800/v1534256595/Onboarding/Burger.jpg"
              alt=""
              className="img-responsive fit-image"
            />
          </div>
          <div className="col-md-4 mx-auto">
            <div className="card shadow p-3 mb-5 rounded">
              <div className="card-body text-left">
                <h4 className="text-black text-left font-weight-bold">
                  Sign in with your Grubhub <br />
                  account
                </h4>
                <br />
                <Formik
                  initialValues={this.state}
                  validationSchema={LoginSchema}
                  onSubmit={(values, actions) => {
                    this.submitLogin(values);
                    actions.setSubmitting(false);
                  }}
                >
                  {({ touched, errors, isSubmitting }) => (
                    <Form>
                      <div className="form-group text-left">
                        <label htmlFor="email">Email</label>
                        <Field
                          type="email"
                          name="email"
                          // autofocus="true"
                          className={`form-control ${
                            touched.email && errors.email ? "is-invalid" : ""
                          }`}
                        />
                        <ErrorMessage
                          component="div"
                          name="email"
                          align="text-left"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="form-group text-left">
                        <label htmlFor="password">Password</label>
                        <Field
                          type="password"
                          name="password"
                          className={`form-control ${
                            touched.password && errors.password
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <ErrorMessage
                          component="div"
                          name="password"
                          className="invalid-feedback"
                        />
                      </div>
                      <br />
                      <button
                        type="submit"
                        // id="signin"
                        className="btn btn-success btn-block text-white font-weight-bold"
                        // disabled={!isSubmitting}
                      >
                        {/* {isSubmitting ? "Please wait..." : "Sign in"} */}
                        Sign in
                      </button>
                    </Form>
                  )}
                </Formik>
                <br />
                Don't have an account?&nbsp;&nbsp;
                <Link to="/customersignup">Create your customer account!</Link>
                <br />
                Want to partner with us?&nbsp;
                <Link to="/ownersignup">Create your owner account!</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  logsuccess: state.loginState.logsuccess,
  response: state.loginState.response,
  stuname: state.loginState.stuname
})

export default withApollo(LoginForm);
