const cors = require("cors");
const express = require("express");
const stripe = require("stripe")("pk_test_51MHAYOSAnY2xlNlzHVBk5ud8LUEtXvxFo3Oosc8NZ2SV8PxDbbQJmDnxDE93deiAWPPlvQiVo0hz1yyCK3unr2BU00x0AihnDX");
const uuid = require("uuid");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.get("/",(req, res) => {
    res.send("it works")
});

app.post("/payment", (req,res) => {
    const {product, token} = req.body;
    console.log('product:', product);
    console.log('price:', product.price);

    const idempontencyKey = uuid();
    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'INR',
            customer: customer,
            recipientEmail: token.email,
            description: `purchase of ${product.name}`
        }, {idempontencyKey});
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err))
});

// listen
app.listen(5000, () => console.log('Express app running on port 5000'));