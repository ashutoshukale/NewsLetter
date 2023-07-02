//jshint esversion:6
const express=require("express")
const https=require("https");
const bodyParser=require("body-parser");
require("dotenv").config(); 

const app=express();

// Used to host static local files such as local css or local images on the server
app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
    const Fname=req.body.FirstName;
    const Lname=req.body.LastName;
    const email=(req.body.Email);
    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                   FNAME: Fname,
                   LNAME: Lname  
                }
            }
        ]
    }
    const jsonData=JSON.stringify(data);
    
    const url="https://us8.api.mailchimp.com/3.0/lists/d3c9528e9b";
    
    const api=process.env.APIKEY;

    console.log(api)
    
    const options={
        method:"POST",
        auth:("Ashutosh:" + api)
    }

    const request=https.request(url,options,function(response){
        
        if(response.statusCode==200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data))
        })
    });
    request.write(jsonData);
    request.end()
    
    // res.sendFile(__dirname+"/signup.html");
});


app.post("/failure",function(req,res){
    res.redirect("/")
})


app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on Port 3000");
})  

