const axios = require('axios');

const geoLocation = async function (req, res) {
    try {
        let options = {
            method: "get",
            url: "https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/"
        }
        let result = await axios(options);
        let data = result.data
        res.status(200).send({ status: true, message: data })
    }
    catch (error) {
        console.log(err)
        res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { geoLocation }

