const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("node:https")

const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

// sending the user the sign up page using the app.get() method

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
})

// collecting the user data(first name, last name and email address) and then posting the data to mailchimp using their API. 


app.post("/",function name(req,res) {
    // using body-parser to collect the data in the html form.
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    
    // checking if the input fields are empty and then redirecting the user to the failed.html page
    if (!firstName, !lastName, !email) {
        res.redirect("/failure.html")
        return;
    }

    // collecting the user data in form of a javascript object according to mailchimp format

    const data = {
        members:[
            {
                email_address: email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName

                }
            }
        ]
    }

    // converting the clientData object into a string using JSON.stringify and storing it inside a variable called jsonData
    const url = "https://us21.api.mailchimp.com/3.0/lists/cfaae0c16e"
    const jsonData = JSON.stringify(data)

    // next is to post the JSON(data) to the mailchimp site by using the https.request method that contains (url, options, callback funtion())

    const options = {
        method:"POST",
        // Headers:{
        //     Authorization:"auth fa3476a3533fd8a46b888399c8a5ac34-us21"
        // },
        auth: "west:fa3476a3533fd8a46b888399c8a5ac34-us21",
        // body:jsonData
    }


    const request = https.request(url, options,function (response) {
        response.on("data", (data)=>{
            const clientData = JSON.parse(data)
            console.log(clientData)
            console.log(response);
           if (response.statusCode === 200) {
            res.redirect('/success.html')
           }else{
            res.redirect('/failure.html')
           }
        })
    } )

    request.write(jsonData)
    request.end();






    /* now using the request module (from the node https module) we can post these data to the external server (mailchimp).
     the request module has the following syntax: request(url, option, callback Function()=>{} I am using the options object to hold the url(mailchimp API endpoint), authorization key (mailchimp API-key), method (POST) which specifies by telling our servers to post these data to the mailchimp servers and lastly the body(which is the stringify version of the clientData object)*/
    

    // request(options, (err, response)=>{
        
    //     if (err) {
    //         res.redirect("/failure.html")
    //         console.log(err)
    //     }
    //     else if (response.statusCode === 200) {
    //      res.redirect("/success.html")   
    //     }
    //     else {
    //         res.redirect("/failure.html")
    //     }
    // })
  
    
})


const port = process.env.PORT || 3000;
 
app.listen(port, console.log(`Server is running on ${port}`))


// APIKEY: fa3476a3533fd8a46b888399c8a5ac34-us21

// listID cfaae0c16e

// server key: us21

// URL: https://us21.admin.mailchimp.com/