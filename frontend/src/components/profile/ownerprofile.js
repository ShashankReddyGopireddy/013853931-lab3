import React, { Component } from "react";
// import {Link} from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import rootUrl from "../config/settings";
// import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';


const phoneRegExp = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
const zipRegEx = /^[0-9]{5}(?:-[0-9]{4})?$/

const ProfileSchema = Yup.object().shape({
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
});

const RestaurantSchema = Yup.object().shape({
    restName: Yup.string()
        .required("Restaurant name is required"),
    restDesc: Yup.string()
        .required("Restaurant description is required"),
    restPhone: Yup.string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .required("Restaurant phone number is required"),
    restAddress: Yup.string()
        .required("Restaurant Address is required"),
    restZip: Yup.string()
        .matches(zipRegEx, "Zip code is not valid")
        .required("Restaurant ZIP code is required")
});

class OwnerProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: "Sample owner",
            userEmail: "owner@abc.com",
            password: '********',
            userPhone: "5555555555",
            profileImage: "",
            profileImagePreview: undefined,

            restName: "Sample Restaurant",
            restDesc: "No description",
            restAdr: "Sample Resto Address",
            restZip: "55555",
            restPhone: "9999999999",
            restImage: "",
            restImagePreview: undefined
        }
        this.editProfile = this.editProfile.bind(this)
        this.editRestaurant = this.editRestaurant.bind(this)
        this.savechanges = this.savechanges.bind(this)
        this.handleChange = this.handleChange.bind(this);
    }
    updateProfile=async(e)=>{
        let userEmail=localStorage.getItem('userEmail')
        let userName= localStorage.getItem('userName')
        let userPhone=localStorage.getItem('userPhone')
        let userAddress=localStorage.getItem('userAddress')
        let userZip=localStorage.getItem('userZip')
        let restName=localStorage.getItem('restName')

        let restDesc=localStorage.getItem('restDesc')
        let restPhone=localStorage.getItem('restPhone')
        let restZip=localStorage.getItem('restZip')
        let restAddress=localStorage.getItem('restAddress')
await this.props.profileUpdate(userEmail,userName,userPhone,userAddress,userZip,restName,restDesc,restPhone,restZip,restAddress)
if(this.props.out==200){
    await alert("update success")

  } 

    }
    async componentDidMount(){
        var token = localStorage.getItem('token')
  
        const dataq={
         
          userEmail:localStorage.getItem('userEmail'),
        }
    
        await this.props.client.query({
          query : getProfile,
          variables: {
              userEmail : localStorage.getItem('userEmail'),
          }
      })
      .then(async (response)=>{
  console.log("res",response)
  if(response.data.getProfile){
  this.setState({
            profile:response.data.getProfile.result
        })
      }
      })
    }

    // componentDidMount() {
    //     console.log("Inside get profile after component did mount");
        
    //     axios.defaults.withCredentials = true;
    //     const data = {
    //         userEmail: localStorage.getItem('userEmail')
    //     }
    //     axios.post(rootUrl + '/profile/getprofile', data)
    //         .then(response => {
    //             console.log("inside success")
    //             console.log("Status Code : ", response.status);
    //             if (response.status === 200) {
    //                 console.log("response", response.data)
    //                 this.setState({
    //                     userEmail: response.data[0].userEmail,
    //                     userName: response.data[0].userName,
    //                     userPhone: response.data[0].userPhone,
    //                     password: response.data[0].userPassword,
    //                     profileImage: response.data[0].userImage,
                        
    //                     restName: response.data[1].restName,
    //                     restDesc: response.data[1].restDesc,
    //                     restAdr: response.data[1].restAddress,
    //                     restZip: response.data[1].restZip,
    //                     restPhone: response.data[1].restPhone,
    //                     restImage: response.data[1].restImage
    //                 });
    //                 console.log("state updated", this.state)
    //                 console.log("Profile image name", response.data[0].userImage);
    //                 if (response.data[0].userImage) {
    //                     this.setState({
    //                         profileImagePreview: rootUrl + '/profile/download-file/' + response.data[0].userImage

    //                     })
    //                 }
    //                 if (response.data[1].restImage) {
    //                     this.setState({
    //                         restImagePreview: rootUrl + '/profile/download-file/' + response.data[1].restImage

    //                     })
    //                 }
                   
    //             }

                
    //         })
    //         .catch(error => {
    //             console.log("In error");
                
    //             console.log(error);
                
    //         })
    // }


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
                            profileImagePreview: rootUrl + '/profile/download-file/' + profilePhoto.name
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

    //handle change of restaurant image
    handleChangeRest = (e) => {
        const target = e.target;
        const name = target.name;

        if (name === "RestImage") {
            console.log(target.files);
            var profilePhoto = target.files[0];
            var data = new FormData();
            data.append('photos', profilePhoto);
            axios.defaults.withCredentials = true;
            axios.post(rootUrl + '/profile/upload-file', data)
                .then(response => {
                    if (response.status === 200) {
                        console.log('Rest Photo Name: ', profilePhoto.name);
                        this.setState({
                            restImage: profilePhoto.name,
                            restImagePreview: rootUrl + '/profile/download-file/' + profilePhoto.name
                        })
                        //Download image
                        // axios.post('http://localhost:3001/profile/download-file/' + profilePhoto.name)
                        //     .then(response => {
                        //         let imagePreview = 'data:image/jpg;base64, ' + response.data;
                        //         this.setState({
                        //             restImage: profilePhoto.name,
                        //             restImagePreview: imagePreview
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
        console.log("inside edit fomr", frm.length)
        for (var i = 0; i < frm.length; i++) {
            frm.elements[i].disabled = false;
            console.log(frm.elements[i])
        }
        // document.getElementById('userName').disabled = false;
        document.getElementById('userName').focus()
        document.getElementById('password').style.display = "block";
        // document.getElementById('btn-edit-profile').style.display="none";
        // document.getElementById('btn-submit-profile').style.visibility="visible";
        document.getElementById('btn-submit-profile').style.visibility = "visible";
        document.getElementById('btn-edit-restaurant').style.visibility = "hidden";
        document.getElementById('btn-cancel-profile').style.visibility = "visible";
        document.getElementById('btn-edit').style.visibility = "hidden";
    }

    editRestaurant() {
        var frm = document.getElementById('restaurant-form');
        for (var i = 0; i < frm.length; i++) {
            frm.elements[i].disabled = false;
            console.log(frm.elements[i])
        }
        // document.getElementById('userName').disabled = false;
        document.getElementById('restName').focus();
        document.getElementById('btn-edit-restaurant').style.visibility = "hidden";
        document.getElementById('btn-submit-restaurant').style.visibility = "visible";
        document.getElementById('btn-cancel-restaurant').style.visibility = "visible";
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

    submitRestaurant = (details) => {
        console.log("Inside restaurant submit", details);
        console.log("rest image", this.state.restImage)
        const data = {
            restName: details.restName,
            restDesc: details.restDesc,
            restAddress: details.restAddress,
            restZip: details.restZip,
            restPhone: details.restPhone,
            restImage: this.state.restImage,
            userEmail: localStorage.getItem('userEmail')
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.put(rootUrl + '/restaurant/updaterestdetails', data)
            .then(response => {
                console.log("inside success")
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("success", response)
                    alert("success")
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
        var frm = document.getElementById('restaurant-form');
        for (var i = 0; i < frm.length; i++) {
            // console.log(frm.elements[i])
            frm.elements[i].disabled = true;
        }
        var frm1 = document.getElementById('profile-form');
        for (var j = 0; j < frm1.length; j++) {
            // console.log(frm1.elements[j])
            frm1.elements[j].disabled = true;
        }
        // document.getElementById('userName').focus()
        document.getElementById('password').style.display = "none";
        // document.getElementById('btn-edit-profile').style.display="none";
        document.getElementById('btn-edit-restaurant').style.visibility = "visible";
        document.getElementById('btn-submit-profile').style.visibility = "hidden";
        document.getElementById('btn-cancel-profile').style.visibility = "hidden";
        document.getElementById('btn-edit').style.visibility = "visible";
        document.getElementById('btn-edit-restaurant').style.visibility = "visible";
        document.getElementById('btn-submit-restaurant').style.visibility = "hidden";
        document.getElementById('btn-cancel-restaurant').style.visibility = "hidden";
        document.getElementById('btn-edit').style.visibility = "visible";
    }

    render() {
        let profileImageData = <img src="https://img.freepik.com/free-icon/user-filled-person-shape_318-74922.jpg?size=338c&ext=jpg" alt="logo" />
        if (this.state.profileImagePreview) {
            profileImageData = <img src={this.state.profileImagePreview} alt="logo" />
        }
        let restImageData = <img src="https://mk0tarestaurantt3wcn.kinstacdn.com/wp-content/uploads/2018/01/premiumforrestaurants_0.jpg" alt="logo" />
        if (this.state.restImagePreview) {
            restImageData = <img src={this.state.restImagePreview} alt="logo" />
        }
        let redirectVar = null;
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }
        return (
            <div className="row">
                {redirectVar}
                <div className="col-md-7">
                    <span className="font-weight-bold">Your account</span>
                    &nbsp;&nbsp;&nbsp;
        <a className="nav-link-inline" id="btn-edit" href="#edit" onClick={this.editProfile}>Edit</a>
                    <Formik
                        enableReinitialize
                        initialValues={
                            {
                                email: this.state.userEmail,
                                userName: this.state.userName,
                                password: this.state.password,
                                userPhone: this.state.userPhone,
                                userAddress: "default",
                                userZip: '00000'
                            }}
                        validationSchema={ProfileSchema}
                        onSubmit={(values, actions) => {
                            this.submitProfile(values)
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
                                {/* &nbsp; */}
                            </Form>

                        )}
                    </Formik>


                    <span className="font-weight-bold">Restaurant details</span>
                    &nbsp;&nbsp;&nbsp;
        <a className="nav-link-inline" id="btn-edit-restaurant" href="#edit" onClick={this.editRestaurant}>Edit</a>
                    <br /><br />
                    <Formik
                        enableReinitialize
                        initialValues={
                            {
                                restAddress: this.state.restAdr,
                                restDesc: this.state.restDesc,
                                restName: this.state.restName,
                                restPhone: this.state.restPhone,
                                restZip: this.state.restZip
                            }}
                        validationSchema={RestaurantSchema}
                        onSubmit={(values, actions) => {
                            this.submitRestaurant(values)
                            actions.setSubmitting(false);
                        }}
                    >
                        {({ touched, errors, isSubmitting }) => (

                            <Form id="restaurant-form">
                                <div className="form-group text-left col-sm-5">
                                    <label htmlFor="restName">Restaurant Name</label>
                                    <Field
                                        type="text"
                                        name="restName"
                                        //   autofocus="true"
                                        id="restName"
                                        disabled
                                        className={`form-control ${
                                            touched.restName && errors.restName ? "is-invalid" : ""
                                            }`}
                                    />
                                    <ErrorMessage
                                        component="div"
                                        name="restName"
                                        align="text-left"
                                        className="invalid-feedback"
                                    />
                                </div>

                                <div className="form-group text-left col-sm-5">
                                    <label htmlFor="restDesc">Restaurant Description</label>
                                    <Field
                                        type="text"
                                        name="restDesc"
                                        //   autofocus="true"
                                        id="restDesc"
                                        disabled
                                        className={`form-control ${
                                            touched.restDesc && errors.restDesc ? "is-invalid" : ""
                                            }`}
                                    />
                                    <ErrorMessage
                                        component="div"
                                        name="restDesc"
                                        align="text-left"
                                        className="invalid-feedback"
                                    />
                                </div>

                                <div className="form-group text-left col-sm-5">
                                    <label htmlFor="restPhone">Restaurant Phone number</label>
                                    <Field
                                        type="test"
                                        name="restPhone"
                                        //   autofocus="true"
                                        disabled
                                        className={`form-control ${
                                            touched.restPhone && errors.restPhone ? "is-invalid" : ""
                                            }`}
                                    />
                                    <ErrorMessage
                                        component="div"
                                        name="restPhone"
                                        align="text-left"
                                        className="invalid-feedback"
                                    />
                                </div>

                                <div className="form-group text-left col-sm-5">
                                    <label htmlFor="restAddress">Restaurant Address</label>
                                    <Field
                                        type="text"
                                        name="restAddress"
                                        //   autofocus="true"
                                        disabled
                                        className={`form-control ${
                                            touched.restAddress && errors.restAddress ? "is-invalid" : ""
                                            }`}
                                    />
                                    <ErrorMessage
                                        component="div"
                                        name="restAddress"
                                        align="text-left"
                                        className="invalid-feedback"
                                    />
                                </div>

                                <div className="form-group text-left col-sm-5">
                                    <label htmlFor="restZip">Restaurant ZIP Code</label>
                                    <Field
                                        type="text"
                                        name="restZip"
                                        //   autofocus="true"
                                        disabled
                                        className={`form-control ${
                                            touched.restZip && errors.restZip ? "is-invalid" : ""
                                            }`}
                                    />
                                    <ErrorMessage
                                        component="div"
                                        name="restZip"
                                        align="text-left"
                                        className="invalid-feedback"
                                    />
                                </div>
                                <br />

                                <div className="form-group">
                                    <label htmlFor="RestImage"><strong>Restaurant Image : </strong></label><br />
                                    <input type="file" name="RestImage" id="restImage" className="btn btn-sm photo-upload-btn" onChange={this.handleChangeRest} />
                                </div>

                                <div className="formholder">
                                    <span>
                                        <button className="btn btn-primary" type="submit" id="btn-submit-restaurant">Update</button>
                                        &nbsp; <a href="/account" className="btn btn-outline-primary font-weight-bold" id="btn-cancel-restaurant" name="cancel">Cancel</a>
                                    </span>
                                </div>


                            </Form>

                        )}
                    </Formik>
                </div>
                <div className="col-md-5 center-content profile-heading">
                    ProfileImage<br /><br />
                    {profileImageData}<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    Restaurant Image<br /><br />
                    {restImageData}
                </div>
                {/* <div className="center-content profile-heading">
        {restImageData}
    </div> */}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    out: state.profileupdate.out

  })

export default withApollo(OwnerProfile);