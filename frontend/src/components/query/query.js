import { gql } from 'apollo-boost';
const customersignup=gql`
query addUser($userEmail:String,$userPassword:String){
    User(userEmail:$userEmail,userPassword:$userPassword){
        status
    }
}

`;
const ownersignup=gql`
query addOwner($userEmail:String,$userPassword:String){
    addOwner(userEmail:$userEmail,restId:$restId){
        status
    }
}

`;
const checkUEmail = gql`
    query User($userEmail:String, $password:String,$stufac:String){
        User(userEmail:$userEmail,password:$password,stufac:,$stufac){
        status
        data{
            username
            userEmail
        }
      

    }
  }
`;
const getProfile = gql`
query getProfile($loginid:String){
    getProfile(loginid:$loginid){
    result{
        userName
        userEmail
        restName
        userZip
        userAddress
        userPhone
        restAddress
        restPhone
        restDesc
        accountType
    }
        status
    
    }
}

`;
const createsection=gql`
query createsection($restId:String){
    createsection(restId:$restId){
        results{
            itemName
            itemDesc
            itemPrice
            itemType
            cuisineName
        }
    }
}
`;

export{ownersignup,customersignup,getProfile,checkUEmail}