const Router = require("express")
const Country = require("../models/Country")
const router = Router()
const Continent = require("../models/Continent")

router.get('/country-helper', async (req, res) => {
     try{
      const countries = await Continent.find()
      if(!countries){
      return  res.status(400).json({message : "Countries not found"})
      }

    //   const transformedData = [];
    //   countries.forEach((country) => {
    //   const countryArray = Object.values(country); // Convert the object values into an array
    //   transformedData.push(...countryArray); // Add the array to the transformed data array
    //   });
    
      return res.send(countries)
     }catch(err){
        console.log(err)
     }
})

router.get('/region-helper', async (req, res) => {
  try{
   const country = req.query.country

   if(!country){
    const countries = await Continent.find({countryName : "Afghanistan"}).select("regions")
   }

   const countries = await Continent.find({countryName : country}, "-_id").select("regions")
   res.json(countries[0])
 
  }catch(err){
     console.log(err)
  }
})
module.exports = router

