const mongoose= require("mongoose");

const dbUrl= "mongodb+srv://Sumanth:sumanth@1006@cluster0-samvk.mongodb.net/test?retryWrites=true&w=majority"

const connectDB = async () => {
    try{
         await mongoose.connect(dbUrl,{
             useNewUrlParser: true,
             useUnifiedTopology: true
         })
         console.log("Mongo DB Connected");
    }
    catch(err){
        console.log(err.message);
        process.exit(1);
    }
}

module.exports= connectDB;