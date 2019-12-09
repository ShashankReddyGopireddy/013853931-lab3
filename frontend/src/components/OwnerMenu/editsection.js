import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import NavBar from "../Navbar/navbar";
import rootUrl from "../config/settings";
import swal from 'sweetalert'


const updateSectionSchema = Yup.object().shape({
    itemType: Yup.string()
        .required("Item Name is required")
})

class EditSection extends Component {
    constructor(props) {
        super(props)
        console.log(props.location.section)
        this.state = {
            itemType: props.location.section.itemType
        }
        this.editSection = this.editSection.bind(this)
    }


    editSection = (details) => {
        // console.log("Inside edit items",details);
        const data = {
            itemType: details.itemType,
            itemType1: this.state.itemType,
            userEmail: localStorage.getItem('userEmail')
            //    itemImage:"",
            //    itemImagePreview:""
        }
        console.log("Inside edit items", data);
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.put(rootUrl + '/restaurant/updateSection', data)
            .then(response => {
                console.log("inside success")
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("success", response)
                    swal("success!","Updated successfully","success")
                    // console.log(response)
                }
            })
            .catch(error => {
                console.log("In error");
                console.log(error);
                swal("failed","Update failed! Please try again","error")
            })
    }

    render() {

        return (
            <div>
                <NavBar />
                <div className="col-md-7">

                    <span className="font-weight-bold">Edit Section</span>
                    {/* <button className="btn btn-link" id="btn-edit" onClick={this.edit}>Edit</button> */}
                    <Formik
                        enableReinitialize
                        initialValues={
                            {
                                itemType: this.state.itemType,
                            }}
                        validationSchema={updateSectionSchema}
                        onSubmit={(values, actions) => {
                            this.editSection(values);
                            actions.setSubmitting(false);
                        }}
                    >
                        {({ touched, errors, isSubmitting }) => (
                            <Form id="profile-form">
                                <div className="form-group text-left col-sm-5">
                                    <br />
                                    <label htmlFor="itemType">Section name</label>
                                    <Field
                                        type="text"
                                        name="itemType"
                                        id="itemType"
                                        //   onChange={this.userNameChangeHandler}
                                        //   value={this.state.userName}
                                        //   autofocus="true"
                                        className={`form-control ${
                                            touched.itemType && errors.itemType ? "is-invalid" : ""
                                            }`}
                                    />
                                    <ErrorMessage
                                        component="div"
                                        name="itemType"
                                        align="text-left"
                                        className="invalid-feedback"
                                    />
                                </div>
                                <br />
                                <div className="formholder">
                                    <span>
                                        <button className="btn btn-primary" type="submit" id="btn-editItem">Save</button>
                                        {/* &nbsp; <a href="/account" className="btn btn-outline-primary font-weight-bold" id="btn-cancel-profile" name="cancel">Cancel</a> */}
                                    </span>
                                </div>
                                {/* <div className="form-group">
                    <label htmlFor="ProfileImage"><strong>Profile Image : </strong></label><br />
                    <input type="file" name="ProfileImage" id="ProfileImage" className="btn btn-sm photo-upload-btn" onChange={this.handleChange}/>
                </div>   */}
                            </Form>

                        )}
                    </Formik>
                </div>
            </div>

        )
    }
}

export default EditSection;