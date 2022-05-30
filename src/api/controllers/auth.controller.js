const request = require('request-promise');

const { sendOtp, verifyOtp, createAccount } = require('../services/auth.service');


module.exports = {
    sendOtp: (req, res) => {
        sendOtp(req.body, function (error, result) {
            if (error) {
                if (error.code == 500) {
                    return res.json({
                        code:error.code,
                        status: "FAILED",
                        message: "Database connection error",
                    });
                } else {
                    return res.json({
                        code:error.code,
                        status: "FAILED",
                        message: error.message,
                    });
                }
            } else {

                return res.json({
                    code:result.code,
                    status: "SUCCESS",
                    message: result.message,
                    data: result.data,
                })

                // const phone = result.phone;
                // const otp = result.otp;

                // const options = {
                //     method: 'POST',
                //     uri: 'https://messagebyte.com/smsapi/sendjson?user=628c8c0df996e708ea1f7785&pswd=70771751&type=text',
                //     body: {
                //         "message": {
                //             "submit": {
                //                 "sender": "SENDER",
                //                 "content": "Hi {#var#}, Email is {#var#}",
                //                 "peid": "123456789",
                //                 "content_id": "12345",
                //                 "da": [
                //                     {
                //                         "msisdn": "9358174783",
                //                         "name": "User1",
                //                         "email": "user1@test.com"
                //                     }
                //                 ]
                //             }
                //         }
                //     },
                //     json: true,
                //     headers: {
                //         'Content-Type': 'application/json'
                //     }
                // }

                // request(options).then(function (response) {
                //     return res.json({
                //         status: "SUCCESS",
                //         message: "Otp sent successfully",
                //         data: result,
                //     })
                // })
                //     .catch(function (err) {
                //         return res.json({
                //             status: "FAILED",
                //             message: "Failed to send OTP.",
                //         });
                //     })
            }
        });
    },


    verifyOtp: (req, res) => {
        verifyOtp(req.body, function (error, result) {
            if (error) {
                if (error.code == 500) {
                    return res.json({
                        status: "FAILED",
                        code:error.code,
                        message: "Database connection error",
                    });
                } else {
                    return res.json({
                        status: "FAILED",
                        code:error.code,
                        message: error.message,
                    });
                }
            } else {
                res.json({
                    status: "SUCCESS",
                    code:result.code,
                    message: result.message,
                    data: result.data,
                })
            }
        })
    },

    createAccount: (req, res) => {
        var profileImage="";
        if(req.file!=null){
            profileImage=req.file.filename;
        }
        req.body.profile=profileImage;
        
        createAccount(req.body, function (error, result) {
            if (error) {
                if (error.code == 500) {
                    return res.json({
                        status: "FAILED",
                        code:error.code,
                        message: "Database connection error",
                    });
                } else {
                    return res.json({
                        status: "FAILED",
                        code:error.code,
                        message: error.message,
                    });
                }
            } else {
                res.json({
                    status: "SUCCESS",
                    code:result.code,
                    message: result.message,
                    data: result.data,
                })
            }
        })
    }
}