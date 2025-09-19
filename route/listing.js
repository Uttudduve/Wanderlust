const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner ,validateListing} = require("../middleware.js");
const listingcontroller = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});

//INDEX ROUTE
router.route("/")
.get(wrapAsync(listingcontroller.index))
.post(isLoggedIn,upload.single('listings[image]'), validateListing ,wrapAsync(listingcontroller.createNew));

// NEW ROUTE

router.get("/new", isLoggedIn,listingcontroller.renderNew);

// SHOW ROUTE 
router.route("/:id")
.get(validateListing ,wrapAsync(listingcontroller.showRoute))
.put( isLoggedIn, isOwner,upload.single('listings[image]'),validateListing ,wrapAsync(listingcontroller.updateRoute))
.delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.deleteRoute));


// EDIT ROUTE

router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingcontroller.editRoute));


module.exports = router;