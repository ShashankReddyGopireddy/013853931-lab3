import React, { Component } from "react";
// import {Link} from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import '../../App.css';
import rootUrl from "../config/settings";
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
// import cookie from 'react-cookies';
// import {Redirect} from 'react-router';



const phoneRegExp = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
const zipRegEx = /^[0-9]{5}(?:-[0-9]{4})?$/

const SignUpSchema = Yup.object().shape({
    userName: Yup.string()
        .required("Name is required"),
    email: Yup.string()
        .email("Invalid email address format")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be 8 characters at minimum")
        .required("Password is required"),
    userPhone: Yup.string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .required("Phone number is required"),
    userAddress: Yup.string()
        .required("Address is required"),
    userZip: Yup.string()
        .matches(zipRegEx, "Zip code is not valid")
        .required("ZIP code is required")
})
var colors = {
    color: "balck"
}

class UserProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: "Sample",
            userEmail: "sample@abc.com",
            password: '********',
            userAdr: "Sample Address",
            userPhone: "5555555555",
            userZip: "99999",
            profileImage: "",
            profileImagePreview: undefined

            // restName: "xyz",
            // restAdr:"Sample Resto Address",
            // restZip: "55555",
            // restPhone: "9999999999",
        }
        this.editProfile = this.editProfile.bind(this)
        this.savechanges = this.savechanges.bind(this)
        this.handleChange = this.handleChange.bind(this);
    }


    componentDidMount() {
        console.log("Inside get profile after component did mount");
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        const data = {
            userEmail: localStorage.getItem('userEmail')
        }
        axios.post(rootUrl + '/profile/getprofile', data)
            .then(response => {
                console.log("inside success")
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("response", response.data)
                    this.setState({
                        userEmail: response.data.userEmail,
                        userName: response.data.userName,
                        password: response.data.userPassword,
                        userPhone: response.data.userPhone,
                        userAdr: response.data.userAddress,
                        userZip: response.data.userZip,
                        profileImage: response.data.userImage
                    });
                    console.log("state updated", this.state)
                    // if (response.data.userImage) {
                    console.log("Profile image name", response.data.userImage);
                    if (response.data.userImage) {
                        this.setState({
                            profileImagePreview: rootUrl + "/profile/download-file/" + response.data.userImage
                        })
                    }
                    // }
                    //Download image
                    // axios.get('http://localhost:3001/profile/download-file/' + response.data.userImage)
                    //     .then(response => {
                    //         // let imagePreview = 'data:image/jpg;base64, ' + response.data;
                    //         this.setState({
                    //             profileImagePreview: response.data
                    //         })

                    //     });
                }
            })
            .catch(error => {
                console.log("In error");
                console.log(error);
                // alert("User credentials not valid. Please try again!");
            })
    }

    //handle change of profile image
    handleChange = (e) => {
        const target = e.target;
        const name = target.name;

        if (name === "ProfileImage") {
            console.log(target.files);
            var profilePhoto = target.files[0];
            var data = new FormData();
            data.append('photos', profilePhoto);
            axios.defaults.withCredentials = true;
            axios.post(rootUrl + '/profile/upload-file', data)
                .then(response => {
                    if (response.status === 200) {
                        console.log('Profile Photo Name: ', profilePhoto.name);
                        this.setState({
                            profileImage: profilePhoto.name,
                            profileImagePreview: rootUrl + "/profile/download-file/" + profilePhoto.name
                        })
                        //Download image
                        // axios.post('http://localhost:3001/profile/download-file/' + profilePhoto.name)
                        //     .then(response => {
                        //         let imagePreview = 'data:image/jpg;base64, ' + response.data;
                        //         this.setState({
                        //             profileImage: profilePhoto.name,
                        //             profileImagePreview: imagePreview
                        //         })

                        //     }).catch((err) =>{
                        //         console.log(err)
                        //         alert("Error at change event image!!")
                        //     });
                    }
                });
        }
    }

    editProfile() {
        var frm = document.getElementById('profile-form');
        for (var i = 0; i < frm.length; i++) {
            frm.elements[i].disabled = false;
            // console.log(frm.elements[i])
        }
        // document.getElementById('userName').disabled = false;
        document.getElementById('userName').focus()
        document.getElementById('password').style.display = "block";
        // document.getElementById('btn-edit-profile').style.display="none";
        document.getElementById('btn-submit-profile').style.visibility = "visible";
        document.getElementById('btn-cancel-profile').style.visibility = "visible";
        document.getElementById('btn-edit').style.visibility = "hidden";
    }


    submitProfile = (details) => {
        console.log("Inside profile update", details);
        const data = {
            userPassword: details.password,
            userName: details.userName,
            userPhone: details.userPhone,
            userAddress: details.userAddress,
            userZip: details.userZip,
            userImage: this.state.profileImage,
            userEmail: localStorage.getItem('userEmail')
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.put(rootUrl + '/profile/updateprofile', data)
            .then(response => {
                console.log("inside success")
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("success", response)    
                    // alert("success")
                    // console.log(response)
                }
            })
            .catch(error => {
                console.log("In error");
                console.log(error);
                alert("Update failed! Please try again")
            })
        this.savechanges()
    }

    savechanges() {
        var frm = document.getElementById('profile-form');
           for (var i = 0; i < frm.length; i++) {
            console.log(frm.elements[i])
            frm.elements[i].disabled = true;
        }
        // document.getElementById('userName').focus()
        document.getElementById('password').style.display = "none";
        // document.getElementById('btn-edit-profile').style.display="none";
        document.getElementById('btn-submit-profile').style.visibility = "hidden";
        document.getElementById('btn-cancel-profile').style.visibility = "hidden";
        document.getElementById('btn-edit').style.visibility = "visible";
    }


    render() {
        let redirectVar = null;
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }
        console.log("profile image preview", this.state.profileImagePreview)
        let profileImageData = <img src="https://img.freepik.com/free-icon/user-filled-person-shape_318-74922.jpg?size=338c&ext=jpg" alt="logo" />
        if (this.state.profileImagePreview) {
            profileImageData = <img src={this.state.profileImagePreview} alt="logo" />
        }

        return (
            <div className="row">
                {redirectVar}
                <div className="col-md-7">
                    <span className="font-weight-bold">Your account</span>
                    {/* <button className="btn btn-link" id="btn-edit" onClick={this.edit}>Edit</button> */}
                    &nbsp;&nbsp;&nbsp;
                <a className="nav-link-inline" id="btn-edit" style={colors} href="#edit" onClick={this.editProfile}>Edit</a>
                    <Formik
                        enableReinitialize
                        initialValues={
                            {
                                email: this.state.userEmail,
                                userName: this.state.userName,
                                password: this.state.password,
                                userPhone: this.state.userPhone,
                                userAddress: this.state.userAdr,
                                userZip: this.state.userZip
                            }}
                        validationSchema={SignUpSchema}
                        onSubmit={(values, actions) => {
                            this.submitProfile(values);
                            actions.setSubmitting(false);
                        }}
                    >
                        {({ touched, errors, isSubmitting }) => (
                            <Form id="profile-form">
                                <div className="form-group text-left col-sm-5">
                                    <br />
                                    <label htmlFor="userName">Name</label>
                                    <Field
                                        type="text"
                                        name="userName"
                                        id="userName"
                                        //   onChange={this.userNameChangeHandler}
                                        //   value={this.state.userName}
                                        disabled
                                        //   autofocus="true"
                                        className={`form-control ${
                                            touched.userName && errors.userName ? "is-invalid" : ""
                                            }`}
                                    />
                                    <ErrorMessage
                                        component="div"
                                        name="userName"
                                        align="text-left"
                                        className="invalid-feedback"
                                    />
                                </div>

                                <div className="form-group text-left col-sm-5" id="password">
                                    <label htmlFor="password">Password</label>
                                    <Field
                                        type="password"
                                        name="password"
                                        // onChange={this.passwordChangeHandler}
                                        // value={this.state.password}
                                        disabled
                                        className={`form-control ${
                                            touched.password && errors.password ? "is-invalid" : ""
                                            }`}
                                    />
                                    <ErrorMessage
                                        component="div"
                                        name="password"
                                        className="invalid-feedback"
                                    />
                                </div>

                                <div className="form-group text-left col-sm-5">
                                    <label htmlFor="email">Email</label>
                                    <Field
                                        type="email"
                                        name="email"
                                        //   onChange={this.userEmailChangeHandler}
                                        //   value={this.state.userEmail}
                                        disabled
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

                                <div className="form-group text-left col-sm-5">
                                    <label htmlFor="userPhone">Phone number</label>
                                    <Field
                                        type="text"
                                        name="userPhone"
                                        //   onChange={this.userPhoneChangeHandler}
                                        //   value={this.state.userPhone}
                                        disabled
                                        //   autofocus="true"
                                        className={`form-control ${
                                            touched.userPhone && errors.userPhone ? "is-invalid" : ""
                                            }`}
                                    />
                                    <ErrorMessage
                                        component="div"
                                        name="userPhone"
                                        align="text-left"
                                        className="invalid-feedback"
                                    />
                                </div>

                                <div className="form-group text-left col-sm-5" id="userAddress">
                                    <label htmlFor="userAddress">Address</label>
                                    <Field
                                        type="text"
                                        name="userAddress"
                                        //   onChange={this.userAdrChangeHandler}
                                        //   value={this.state.userAdr}
                                        disabled
                                        //   autofocus="true"
                                        className={`form-control ${
                                            touched.userAddress && errors.userAddress ? "is-invalid" : ""
                                            }`}
                                    />
                                    <ErrorMessage
                                        component="div"
                                        name="userAddress"
                                        align="text-left"
                                        className="invalid-feedback"
                                    />
                                </div>

                                <div className="form-group text-left col-sm-5" id="userZip">
                                    <label htmlFor="userZip">ZIP Code</label>
                                    <Field
                                        type="text"
                                        name="userZip"
                                        //   onChange={this.userZipChangeHandler}
                                        //   value={this.state.userZip}
                                        disabled
                                        //   autofocus="true"
                                        className={`form-control ${
                                            touched.userZip && errors.userZip ? "is-invalid" : ""
                                            }`}
                                    />
                                    <ErrorMessage
                                        component="div"
                                        name="userZip"
                                        align="text-left"
                                        className="invalid-feedback"
                                    />
                                </div>

                                <br />
                                <div className="form-group">
                                    <label htmlFor="ProfileImage"><strong>Profile Image : </strong></label><br />
                                    <input type="file" name="ProfileImage" id="ProfileImage" className="btn btn-sm photo-upload-btn" onChange={this.handleChange} />
                                </div>
                                <div className="formholder">
                                    <span>
                                        <button className="btn btn-primary" type="submit" id="btn-submit-profile">Update Profile</button>
                                        &nbsp; <a href="/account" className="btn btn-outline-primary font-weight-bold" id="btn-cancel-profile" name="cancel">Cancel</a>
                                    </span>
                                </div>
                            </Form>

                        )}
                    </Formik>

                </div>
                <div className="col-md-5 center-content profile-heading">
                    {profileImageData}
                </div>
            </div>
        )
    }
}

export default UserProfile