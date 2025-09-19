const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const myToken =  process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: myToken });

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNew = (req,res) =>{
    res.render("listings/new.ejs");
};

module.exports.showRoute = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews" ,
        populate:{path:"author"}
        }).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exists as per request!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createNew = async(req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listings.location,
    limit: 1
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listings);
    newListing.image = {url,filename};
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
    let k = await newListing.save();
    console.log(k);
    req.flash("success","New Listings added");
    res.redirect("/listings");
};

module.exports.editRoute = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exists as per request!");
        return res.redirect("/listings");
    }
    
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing , originalImageUrl});
};

module.exports.updateRoute = async (req,res)=>{
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listings.location,
    limit: 1
    })
    .send();

    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , { ...req.body.listings});

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};

    }
    listing.geometry = response.body.features[0].geometry;
    await listing.save();
    req.flash("success","Listings Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteRoute = async (req,res)=>{
    let {id} = req.params;
    let del = await Listing.findByIdAndDelete(id);
    console.log(del);
    req.flash("success","Listings Deleted!");
    res.redirect("/listings");
};
