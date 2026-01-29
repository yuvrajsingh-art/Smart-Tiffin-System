const express = require("express");
const {loginUser, registerCustomer,providerCustomer, signOut,googleAuth} = require("../controllers/authcontroller");


const router = express.Router();

router.post("/registerCustomer/customer", registerCustomer);
router.post("/registerProvider/provider", providerCustomer)
router.post("/login", loginUser);
router.post("/logout", signOut);
router.post("/google-auth", googleAuth)

module.exports = router;
