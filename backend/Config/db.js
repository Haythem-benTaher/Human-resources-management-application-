const mongoose =require('mongoose');
const db=mongoose.connect('mongodb://localhost:27017').then(()=>{
    console.log('db connected');
}).catch((err)=>{
    console.log('connexion echouéé');
})
module.exports=db