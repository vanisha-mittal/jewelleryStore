const express = require("express");
const router = express.Router();
const request = require("request");
const jsSHA = require("jssha");
const { v4: uuid } = require("uuid");
const { isLoggedIn } = require("../middleware");

router.post(
    "/payment_gateway/payumoney",
    isLoggedIn,
    (req, res) => {
        try {
            req.body.txnid = uuid();
            req.body.email = req.user.email;
            req.body.firstname = req.user.username;

            const pay = req.body;

            const hashString =
                process.env.MERCHANT_KEY +
                "|" + pay.txnid +
                "|" + pay.amount +
                "|" + pay.productinfo +
                "|" + pay.firstname +
                "|" + pay.email +
                "|" + "||||||||||" +
                process.env.MERCHANT_SALT;

            const sha = new jsSHA("SHA-512", "TEXT");
            sha.update(hashString);

            pay.key = process.env.MERCHANT_KEY;
            pay.surl = "http://localhost:8080/payment/success";
            pay.furl = "http://localhost:8080/payment/fail";
            pay.hash = sha.getHash("HEX");

            request.post({
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                url: "https://sandboxsecure.payu.in/_payment",
                form: pay
            }, (error, httpRes, body) => {
                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: error.message
                    });
                }

                if (httpRes.statusCode >= 300 && httpRes.statusCode <= 400) {
                    return res.redirect(httpRes.headers.location);
                }

                return res.send(body);
            });
        } catch (e) {
            res.status(500).json({
                success: false,
                message: e.message
            });
        }
    }
);

router.post("/payment/success", (req, res) => {
    res.json({
        success: true,
        payment: req.body
    });
});

router.post("/payment/fail", (req, res) => {
    res.status(400).json({
        success: false,
        payment: req.body
    });
});

module.exports = router;
