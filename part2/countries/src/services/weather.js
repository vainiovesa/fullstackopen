import axios from 'axios'
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?'
const apiKey = import.meta.env.VITE_SOME_KEY

const getForCity = name => {
    const request = axios.get(`${baseUrl}q=${name}&appid=${apiKey}&units=metric`)
    return request.then(response => response.data)
}

export default { getForCity }
