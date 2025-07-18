const axios = require('axios');

const axiosInstance = axios.create({});

const apiConnector = (method,url,bodyData,headers,params) => {
    return axiosInstance(
        {
            method:`${method}`,
            url:`${url}`,
            data:bodyData ? bodyData : null,
            headers: headers ? headers : null,
            params: params ? params : null,
            withCredentials:true,
        }
    );
}


module.exports = apiConnector;