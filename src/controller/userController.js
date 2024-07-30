const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
const userSchema= require('../model/user');

const signin=async(req,res)=>{
   var {name,password,email} = req.body;
    var emailcheck = await userSchema.findOne({email: email});
const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
    if(emailcheck){
        res.status(409).json({message:"Email already exists" ,email: email});
    }else{
        

        var user=new userSchema({
            name: name,
            email: email,
            password: hashedPassword
        })
        user.save()
        .then(()=>
            {
                res.status(200).json({message:"user saved successfully"});
            }).catch(err =>{
                console.error(err);
                res.status(400).json({ error: 'Validation error', details: err.errors ,userdata:{
                    name: name,
                    email: email,
                    password: password
                }});
            })

    }

}

const login=async(req,res)=>{

    const { email, password } = req.query;
    console.log("email: " + email+"\n password: " + password)
    var emailcheck = await userSchema.findOne({email: email});

    if(emailcheck){
        if( await bcrypt.compare(password, emailcheck.password)){
            res.status(200).json({message:"Login successfully",name: emailcheck.name})
        }
        else{
            res.status(401).json({message:"Wrong Password"})
        }

    }else{
        res.status(401).json({message:"user does not found"})
    }

}

module.exports = { signin ,login};
