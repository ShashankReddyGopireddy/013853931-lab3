import axios from "axios";
import { rootUrl } from '../../components/config/settings';
export const AUTH_LOGIN = "AUTH_LOGIN";
export const SIGNUP = "SIGNUP";
export const AUTH_LOGIN_USER_PRESENT = "AUTH_LOGIN_USER_PRESENT";


//target action
export function submitLogin(data) {
    return function (dispatch) {
        console.log('Inside Action:', data);
        // axios.defaults.withCredentials = true;
        axios.post(rootUrl + '/login', data)
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    //   localStorage.setItem("token", response.data.Token);
                    console.log("useremail", data.Email)
                    localStorage.setItem('email', data.Email);
                    console.log(localStorage.getItem('email'))
                    var resultData = {
                        UserName: response.data.UserName,
                        // Accounttype : response.data.Accounttype,
                        isAuthenticated: true
                    }
                    console.log('Result in action: ', resultData)
                    dispatch({
                        type: AUTH_LOGIN,
                        payload: resultData
                    });

                }
                // else{
                //         // if (err.response.status === 401) {
                //          let resultData = {
                //              isAuthenticated : false
                //          }
                //             // console.log(err);
                //             // console.log('inside res status', err);
                //              dispatch({
                //                  type: AUTH_LOGIN,
                //                  payload: resultData
                //              });                        
                //          //}
                // }                            
            })
            .catch((err) => {
                // if (err.response.status === 401) {
                var resultData = {
                    isAuthenticated: false
                }
                console.log(err);
                console.log('inside res status', err);
                dispatch({
                    type: AUTH_LOGIN,
                    payload: resultData
                });
                //}
            });
    }
}

export function signup(data) {
    return function (dispatch) {
        console.log('Inside Signup');
        // axios.defaults.withCredentials = true;
        axios.post(rootUrl + '/signup', data)
            .then(response => {
                console.log('response', response.data);
                if (response.status.code === 200) {
                    var result = {
                        isNewUserCreated: true
                    }

                    dispatch({
                        type: SIGNUP,
                        payload: result
                    });
                }
                if (response.status === 210) {
                    console.log('User already present:');
                    dispatch({
                        type: AUTH_LOGIN_USER_PRESENT
                    });
                }
            })
            .catch((err) => {
                console.log('Error Occured!');
                var result = {
                    errorRedirect: true
                }

                dispatch({
                    type: SIGNUP,
                    payload: result
                });
            });

    }
}