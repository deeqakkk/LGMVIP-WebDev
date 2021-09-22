const mongoose=require("mongoose");


mongoose.connect("mongodb://localhost:27017/srmsDB",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})


const studentSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true    },
    class:{
        type:String,
        required:true
    },
    rollNo:{
        type:String,
        required:true,
        unique: true 

    },
    fatherName:{
        type:String,
        required:true
    }, mobileNo:{
        type:String,
        required:true
    },
    hindi:{
        type:Number,
        required:true
    },
    eng:{
        type:Number,
        required:true
    },
    phy:{
        type:Number,
        required:true
    },
   maths:{
        type:Number,
        required:true
    },
    dob:{
       type:String,
       required:true

    }
,
chem:{
    type:Number,
    required:true
}




})



module.exports=mongoose.model("Student",studentSchema)