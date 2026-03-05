const axios = require("axios");

const getCoordinates = async (address) => {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: address,
        format: "json",
        limit: 1
      },
      headers: {
        "User-Agent": "stockmate-app"
      }
    }
  );

  if (!response.data.length) {
    throw new Error("Address not found");
  }

  const location = response.data[0];

  return {
    latitude: parseFloat(location.lat),
    longitude: parseFloat(location.lon)
  };
};

module.exports = { getCoordinates };