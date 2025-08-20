import axios from "axios";

const axiosIns = axios.create(
    {
        headers:{
            'Accepts': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'pk_150021752_CNRM0LR99ME9TKWDM0X8HTWEIDJW64I9'
        },
        baseURL: 'https://api.clickup.com/api/v2'
    }
)

export default axiosIns