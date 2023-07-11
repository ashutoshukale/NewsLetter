//jshint esversion:6
const express=require("express")
const https=require("https");   
const bodyParser=require("body-parser");
require("dotenv").config(); 

const app=express();


app.use(bodyParser.urlencoded({extended:true}));
// Used to host static local files such as local css or local images on the server
app.use(express.static("public"))

app.set('view engine', 'ejs');


app.get("/", function(req,res){
    res.render("signup");
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

    const url="https://us8.api.mailchimp.com/3.0/lists/909ac6c9ff";

    const api=process.env.APIKEY;
    
    const options={
        method:"POST",
        auth:"Ashutosh:"+api
    }

    const request=https.request(url, options,function(response){
        response.on("data",function(data){
            const resp=JSON.parse(data);
            if(response.statusCode==200){
            if(resp.errors.length==0){
                res.render("success");
            }
            else{
                if(resp.errors[0].error_code=="ERROR_CONTACT_EXISTS"){
                res.render("exist");
                }   
            }
        }
            else{
                res.render("failure");
            }
        })        
    });
    request.write(jsonData);
    request.end();
});


app.post("/failure",function(req,res){
    res.redirect("/");
})




app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on Port 3000");
})  

