const axios = window.axios
async function getInfo() {const res = await axios.get("https://opensky-network.org/api/states/all")
return res
}

export default getinfo