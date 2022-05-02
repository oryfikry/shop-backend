require('dotenv').config();
const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

// app.use(bodyParser.json()) for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/profile', async(req, res) => {
    const search = req.query.search;

    res.send(search+'');
//   res.json(req.body)
})

app.get('/get-token', async(req, res) => {
    const axios =  require('axios').default;
    const order_id = req.query.order_id;
    const amount = req.query.amount;
    const name = req.query.name;
    const email = req.query.email;
    const phone = req.query.phone;


    
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    axios({
        // Below is the API URL endpoint
        url: "https://app.sandbox.midtrans.com/snap/v1/transactions",
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization:
            "Basic " +
            Buffer.from(process.env.SERV_KEY).toString("base64")
          // Above is API server key for the Midtrans account, encoded to base64
        },
        data:
          // Below is the HTTP request body in JSON
          {
            transaction_details: {
              order_id: "trx-ory-" + time + order_id,
              gross_amount: parseInt(amount)
            },
            credit_card: {
              secure: true
            },
            customer_details: {
              first_name: name,
              last_name: "",
              email: email,
              phone: phone
            }
          }
      }).then( snapResponse => { 
          const snapToken = snapResponse.data.token;
          let finalToken = "https://app.sandbox.midtrans.com/snap/v2/vtweb/"+snapToken;
          console.log("Retrieved snap token:", finalToken);
          res.redirect(finalToken);
          // Pass the Snap Token to frontend, render the HTML page
        //   res.send(getMainHtmlPage(snapToken, handleMainRequest));
        })
  })

/**
 * Sample API HTTP response:
 * {
 *  "token":"66e4fa55-fdac-4ef9-91b5-733b97d1b862",
 *  "redirect_url":"https://app.sandbox.midtrans.com/snap/v2/vtweb/66e4fa55-fdac-4ef9-91b5-733b97d1b862"
 * }
 */