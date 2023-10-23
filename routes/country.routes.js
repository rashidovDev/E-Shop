const Router = require("express")
const Country = require("../models/Country")
const router = Router()

router.get('', async (req, res) => {
     try{
      const countries = await Country.find()
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

module.exports = router

