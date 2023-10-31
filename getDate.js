module.exports = function getDate(){
  const d = new Date()
let month = d.getMonth() + 1
let year = d.getFullYear()
let day = d.getDate() 
let hour = d.getHours() 
let minutes = d.getMinutes() 
let seconds = d.getSeconds() 

const dateRegister = {
    year,
    month,
    day,
    hours : {
      hour,
      minutes,
      seconds
    }
}
return dateRegister
}