
const originalData = [
    {
      "0": {
        "name": "Afghanistan",
        "dial_code": "+93",
        "code": "AF"
      },
      "1": {
        "name": "Aland Islands",
        "dial_code": "+358",
        "code": "AX"
      }
    }
  ];
  
  // Initialize an array to store the transformed data
  const transformedData = [];
  
  // Loop through the original data
  originalData.forEach((countryData) => {
    const countryArray = Object.values(countryData); // Convert the object values into an array
    transformedData.push(...countryArray); // Add the array to the transformed data array
  });
  
  console.log(transformedData);