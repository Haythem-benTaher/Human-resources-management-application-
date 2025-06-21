const { response } = require("express")
const UserData = require("../models/Usermodel")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')




//register
const signup = (req, res, next) => {
    const saltRounds = 10;
    
    bcrypt.hash(req.body.password, saltRounds, (err, hashedpass) => {
      if (err) {
        return res.status(500).json({ error: 'Error hashing password' });
      }
  
      let User = new UserData({
        name: req.body.name,
        password: hashedpass,
        email: req.body.email,
        phone: req.body.phone,
        competance: req.body.competance,
        birthdate: req.body.birthdate,
        address: req.body.address,
        description: req.body.description
      });
  
      if (req.file) {
        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        User.image = imageUrl;
      }
  
      User.save()
        .then(savedUser => {  // Use 'savedUser' to refer to the saved user data
          const token = jwt.sign({ email: savedUser.email }, 'verySecretValue', { expiresIn: '1h' });
          return res.status(200).json({
            message: 'Signup successful',
            token,
            user: savedUser // Return the saved user data
          });
        })
        .catch(error => {
          res.status(500).json({ message: 'An error has occurred', error });
        });
    });
  };
  

//login
const login = (req, res, next) => {
    const { email, password } = req.body;

    UserData.findOne({ $or: [{ email: email }, { phone: email }] })
        .then(user => {
            if (user) {
                // User found, now check the password
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        // Internal Server Error
                        return res.status(500).json({
                            message: 'An error occurred while comparing passwords.',
                            error: err
                        });
                    }
                    if (result) {
                        // Password matches, generate a token
                        const token = jwt.sign({ email: user.email }, 'verySecretValue', { expiresIn: '80h' });
                        return res.status(200).json({
                            message: 'Login successful',
                            token,
                            user
                        });
                    } else {
                        // Password does not match
                        return res.status(401).json({
                            message: 'Password does not match'
                        });
                    }
                });
            } else {
                // No user found
                return res.status(404).json({
                    message: 'No user found with the provided email or phone number'
                });
            }
        })
        .catch(err => {
            // Internal Server Error
            return res.status(500).json({
                message: 'An error occurred while processing the request.',
                error: err
            });
        });
};


//show all users
const consulter = (req , res , next ) =>{
    UserData.find()
    .then(response => {
        res.json({response})
    })
    .catch(error => {
        res.json({message : 'an error has Occured'})
    })
}
//consult user by id
const consulterID = (req , res , next) =>{
    const UserID = req.body.UserID
    UserData.findById(UserID)
    .then(response=>{
        res.json({response})
    })
    .catch(error =>{
        res.json({message : 'an error has Occured'})
    })
}
//add user
   /* const ajouter = (req , res , next  )=>{
        let User = new UserData({
            name : req.body.name,
            password : req.body.password,
            email : req.body.email,
            phone: req.body.phone,
            competance : req.body.competance,
            birthdate : req.body.birthdate,
            address : req.body.address,
            description : req.body.description
        })
        if(req.file){
            User.image = req.file.path
        }
        User.save()
        .then(response =>{
            res.json({message: 'User added successfully'})
        })
        .catch(response =>{
            res.json({ message : 'an error has occured'})
        })
        
        
    }*/


//update
const modifier = (req, res, next) => {
    const UserID = req.body.UserID;
    // console.log('Received UserID:', UserID);  
    if (!UserID) {
        return res.status(400).json({ message: 'UserID is required' });
    }

    const updatedData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        competance: req.body.competance,
        birthdate: req.body.birthdate,
        address: req.body.address,
        description: req.body.description,
    };

    if (req.file) {
        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        updatedData.image = imageUrl;
    }

    UserData.findByIdAndUpdate(UserID, { $set: updatedData }, { new: true })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User updated successfully', data: updatedUser });
        })
        .catch(error => {
            console.error('Error during update:', error);
            res.status(500).json({ message: 'An error has occurred', error: error.message });
        });
};
//delete

const supprimer = (req , res , next) => {
    //console.log('Request Body:', req.body); 

    let UserID = req.body.userID;

    console.log('UserID to delete:', UserID);
    UserData.findByIdAndDelete(UserID)
      .then(result => {
        res.status(200).json({ message: 'User deleted successfully' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'An error has occurred' });
      });
    
    
}

module.exports = {
    consulter, consulterID, modifier, supprimer , signup ,login
}