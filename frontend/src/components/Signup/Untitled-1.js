<div className="container fill-graywhite">
    <div className="container content">
        <div className="login-container">
            <form>
                <div>
                    <p>Sign up for Grubhub</p>
                </div>

                <h3>Please provide your details:</h3>

                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputEmail4">Email</label>
                        <input onChange={this.emailHandler} name="userEmail" type="email" className="form-control" id="inputEmail4" placeholder="Email" required />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="inputPassword4">Password</label>
                        <input onChange={this.passwordHandler} name="userPassword" type="password" className="form-control" id="inputPassword4" placeholder="Password" required />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="inputAddress">Your Full name:</label>
                    <input onChange={this.fullNameHandler} name="userFullname" type="text" className="form-control" id="inputAddress" placeholder="Ex: Mary Smith" required />
                </div>
                <div className="form-group">
                    <label htmlFor="inputAddress2">Address</label>
                    <input onChange={this.addressHandler} name="userAddress" type="text" className="form-control" id="inputAddress2" placeholder="1234 Main St, Apt, studio, or floor" required />
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputNumber">Phone Number</label>
                        <input onChange={this.phoneNumberHandler} name="userPhone" type="text" pattern="[0-9]{10}" className="form-control" id="inputNumber" required />
                    </div>

                    <div className="form-group col-md-2">
                        <label htmlFor="inputZip">Zip</label>
                        <input onChange={this.zipCodeHandler} name="userZip" type="number" className="form-control" id="inputZip" required />
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="gridCheck" required />
                        <label className="form-check-label" htmlFor="gridCheck">
                            I Accept the terms and conditions
                                </label>
                    </div>
                </div>
                <div className="formholder">
                    <button className="btn btn-primary" onClick={this.signup}>Sign UP</button>
                    <p>Already have an account? <a href="/login">Login</a></p>
                </div>
                {isSignupSuccess && <div>Success.</div>}
                {signupError && <div>{signupError.message}</div>}
                {}
            </form>
        </div>
    </div>
</div>





handleValidation() {
    let formIsValid = true;
    if (!this.state.userFullname || !this.state.userPhone || !this.state.userEmail || !this.state.userPassword || !this.state.userZip || !this.state.userAddress) {
        formIsValid = false;
        alert("All fields are Required");
        console.log("User name cannot be empty");
    }
    return formIsValid;
};