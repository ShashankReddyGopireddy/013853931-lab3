import { gql } from 'apollo-boost';
const signupbuyermutation = gql`
mutation addUser($userEmail:String,$userPassword:String){
    addUser(userEmail:$userEmail,userPassword:$userPassword){
        status
    }
}
`;
const signupownermutation=gql`
mutation addOwner($userEmail:String,$userPassword:String){
    addOwner(userEmail:$userEmail,restId:$restId){
        status
    }
}
`;
const addsectionmutation=gql`
mutation Sectionlist($restId:String){
    Sectionlist(restId:$restId){
        status
    }
}
`;
export {signupbuyermutation,signupownermutation,addsectionmutation};