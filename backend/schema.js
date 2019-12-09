const graphql = require('graphql');
const _ = require('lodash');
var user=require('../backend/models/users');
var restaurant=require('../backend/models/restaurants');
var item=require('../backend/models/items');
var bcrypt = require('bcryptjs');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLDate
} = graphql;
const userType= new GraphQLObjectType({
    name:'userType',
    fields:()=>({
        userName:{
            type: GraphQLString

        },
        userEmail:{
            type: GraphQLString

        },
        userPassword:{
            type: GraphQLString

        },
        userPhone:{
            type: GraphQLString
            
        },
        userAddress:{
            type: GraphQLString

        },
        userZip:{
            type: GraphQLString

        },
        accountType:{
            type: GraphQLString

        }
    })
})
const SectionType=new GraphQLObjectType({
    name:'SectionType',
    fields:()=>({
        restId:{
            type: GraphQLString

        },
        section:{
            type: GraphQLString

        },
        itemName:{
            type: GraphQLString

        },
        itemType:{
            type: GraphQLString

        },
        itemDesc:{
            type: GraphQLString

        },
        itemPrice:{
            type: GraphQLString

        }


    })
})
// const ItemType=new GraphQLObjectType({
//     name:'ItemType',
//     fields:()=>({
//         itemName:{
//             type: GraphQLString

//         },
//         itemType:{
//             type: GraphQLString

//         },
//         itemDesc:{
//             type: GraphQLString

//         },
//         itemPrice:{
//             type: GraphQLString

//         }

//     })
// })
const restType=new GraphQLObjectType({
    name:'restType',
    fields:()=>({
        userEmail:{
            type: GraphQLString

        },
        restName:{
            type: GraphQLString

        },
        restZip:{
            type: GraphQLString

        },
        restPhone:{
            type: GraphQLString

        },
        restDesc:{
            type: GraphQLString

        },
        restId:{
            type: GraphQLString

        }
    })
})
const detailType=new GraphQLObjectType({
    name:'detailType',
    fields:()=>({
        data:{
            type: userType

        },
        status:{
            type:GraphQLInt


        }
    })
})
const ProfileType = new GraphQLObjectType({
    name: 'ProfileType',
    fields: () => ({
        result:{
            type: new GraphQLList(userType)
        },
        status:{
            type:GraphQLInt

        }
    })
})

const restdetType=new GraphQLObjectType({
    name:'restdetType',
    fields:()=>({
        data:{
type:restType
        },
        status:{
            type:GraphQLInt
        }
    })
})
var loginVar
var Profileresult
var Section

const RootQuery=new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        User:{
            type: userType,
            args:{
                userEmail:{type:GraphQLString},
                userPassword:{type:GraphQLString}
            },
            resolve(parent,args){
                return new Promise((resolve, reject) => {
                    user.findOne({
                     userEmail:args.userEmail
                    },function(err,result)
                    {
                        if (err) {
                            console.log("eroror ")
                            loginVar = err
                        } else if(result){
                            console.log(result)
                            if(bcrypt.compareSync(args.password, result.password)){
                                console.log("res",result)
                            loginVar = {
                                data:result,
                                status:200,
                                
                            };
                            }
                            else {
                                console.log("in error 1")
                                loginVar={
                                    status:400
                                }
                            }
                        }
                        else{
                    
                        
                            loginVar={
                                status:401
                            }
                        }
                        resolve(loginVar);

                    }
                    )
                })
                

            },
            Rest:{
                type:restType,
                args:{
                    userEmail:{type:GraphQLString},
                    userPassword:{type:GraphQLString}
                },
                resolve(parent,args){
                return new Promise((resolve, reject) => {
                restaurant.findOne({
                    userEmail:args.userEmail
                },function(err,result){
                    if (err) {
                        console.log("eroror ")
                        loginVar = err
                    } else if(result){
                        console.log(result)
                        if (bcrypt.compareSync(args.password, result.password)) {
                           console.log("res",result)
                            loginVar = {
                                data:result,
                                status:200,
                                
                            };
                        }else {
                            console.log("in error 1")
                            loginVar={
                                status:400
                            }}
                           

                    }
                    else{
                        loginVar={
                            status:401
                        }
                        resolve(loginVar);

                    }
                }
                )
                })
                }
            },
            getProfile:{
                type: ProfileType,
                args:{
                    loginid:{type:GraphQLString},
                    accountType:{type:GraphQLString}
                },
                resolve(parent, args) {
                    return new Promise((resolve, reject) => {
                        if(args.accountType=='1'){
                            user.find({userId:args.loginid},(err,results)=>{
                                if (results) {
                
                                    console.log("in user",results)
                                    Profileresult = {
                                        result:results,
                                        status:200
                                    }
                                    resolve(Profileresult)
                                }
                                else{
                                    console.log("null")
                                   
                                }
                            })
                        }else{
                            restaurant.find({restId:args.loginid},(err,results)=>{
                                if(results){
                                    console.log("in user",results)
                                    Profileresult = {
                                        result:results,
                                        status:200
                                }
                                resolve(Profileresult)
                            }
                            else{
                                console.log("null")

                            }
                            })
                        }

                    })

                }


            },
            Sectionlist:{
                type:SectionType,
                args:{
                    restId:{type:GraphQLString},

                },resolve(parent,args){
                    return new Promise((resolve, reject) => {
                        items.find({
                            restId:args.restId
                        },function(err,result){
                            if(err){
                        
                                console.log(err);
                                Section=err
                            }
                            else if(results){
                                Section = {
                                    data:result,
                                    status:200,
                                    
                                };
                            }else {
                                console.log("in error 1")
                                Section={
                                    status:401
                                }
                                resolve(Section);}
                                
                        })
                    })

                }
            }
        }

    }

})
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
addUser:{
    type: userType,
    args:{
        userEmail:{type:GraphQLString},
        userPassword:{type:GraphQLString}
    },
    resolve(parent, args){
        const saltRounds = 10;
        bcrypt.hash(args.password, saltRounds, function (err,   hash){
            var userSchema=new user({
                userEmail:args.userEmail,
                userPassword:hash,
                userName:'',
                userZip:'',
                userAddress:'',
                userPhone:'',
                userImage:'',
                accountType:'',
                cart:[],
                orders:[]
            })
            user.findOne({
                userEmail:args.userEmail
            },function(err,buyer){
                if(buyer){
                    console.log("user already exits")
                }
                else{
                    console.log("in error")
                            userSchema.save().then(result =>{
                                console.log(result);
                                return result
                              })
                              .catch(err =>console.log(err));
                }
            })

        })


    }


},
addOwner:{
    type:restType,
    args:{
        userEmail:{type:GraphQLString},
        restId:{type:GraphQLString}
    },
    resolve(parent,args){
var ownerSchema= new restaurant({
    userEmail:args.userEmail,
    restId:args.restId,
    restName:'',
    restPhone:'',
    restType:'',
    restZip:'',
    restDesc:'',
    restImage:'',
    orders:''
})
restaurant.findOne({
    userEmail:args.userEmail

},function(err,owner){
    if(owner){
        console.log('user exists')
    }
    else{
        console.log('in error')
        ownerSchema.save().then(result =>{
            console.log(result);
            return result
          })
          .catch(err =>console.log(err));

    }
})        
    }
},
addSection:{
    type:SectionType,
    args:{
        restId:{type:GraphQLString}
    },
    resolve(parent,args){
        var sectionSchema =new item({
            itemName:'',
            itemDesc:'',
            itemPrice:'',
            itemType:'',
            cuisineName:'',
            section:''
        })
        item.findOne({
            restId:args.restId
        },function(err,it){
            if(it){
console.log('')
            }else{
                sectionSchema.save().then(result=>{
                    console.log(result)
                })
                .catch(err =>console.log(err));

            }
        })
    }
}

    }


})
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
