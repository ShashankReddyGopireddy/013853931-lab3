import axios from "axios";
import { rootUrl } from '../../components/config/settings';
export const GET_PROFILE = "GET_PROFILE";
export const UPDATE_PROFILE = "UPDATE_PROFILE";


export function getProfile(values, callback) {
    console.log("values", values)

    const request = axios.post(rootUrl + '/get-profile', values);
    return (dispatch) => {
        request.then((res) => {

            dispatch(
                {
                    type: GET_PROFILE,
                    payload: res.data
                });
            callback(res);
        }
        );

    };
}

export function updateProfile(values, callback) {

    const request = axios
        .put(rootUrl + '/update-profile', values);
    return (dispatch) => {
        request.then((res) => {

            dispatch(
                {
                    type: UPDATE_PROFILE,
                    payload: res.data
                });
            callback(res);
        }
        );

    };
}