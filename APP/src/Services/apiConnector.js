import axios from "axios";


export const axiosInstance = axios.create({});

export const apiConnector = (method,url,bodyData,headers,params) => {
    // console.log('The URL is ',url);
    return axiosInstance(
        {
            method:`${method}`,
            url:`${url}`,
            data: bodyData ? bodyData : null,
            headers: headers? headers : undefined,
            params:params?params:null,
            withCredentials:true,
        }
    );
}