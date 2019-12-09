import { combineReducers } from 'redux';
import  LoginReducer from './loginReducer';
import SignupReducer from './SignupReducer';
import profileReducer from './profileReducer';
const rootReducer = combineReducers({
    login: LoginReducer,
    signup: SignupReducer,
    profile: profileReducer,
    // form: formReducer
});

export default rootReducer;