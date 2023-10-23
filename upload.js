const fs = require('fs');
const Country = require('./models/Country');

let countriesData;
try {
  const rawCountriesData = fs.readFileSync('countries.json');
  countriesData = JSON.parse(rawCountriesData);

} catch (error) {
  console.error('Error reading JSON file:', error);
}

countriesData.forEach((country) => {
    const newCountry = new Country({
      name: country.name,
      code: country.code,
      dialCode: country.dial_code,
      // Map other fields as needed
    });
    newCountry.save();
  });