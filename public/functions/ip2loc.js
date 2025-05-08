const geoResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
const location = {
    lat: geoResponse.data.latitude,
    lng: geoResponse.data.longitude
};
