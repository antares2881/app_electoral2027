import axios from "axios"

export function login(data){
    // console.log(data)
    let json = JSON.stringify(data)
    let credentials = "json="+json
    return new Promise((res, rej) => {
        axios.post('/api/login', credentials)
            .then((response) => {           
                res(response.data)
            })
            .catch((err) => {
                rej('Error al loguearse')
            })
    })
}

export function getLocalUser(){
    let userStr = null
    if(localStorage.getItem('user')){
        userStr = localStorage.getItem('user');
    }    
    if(!userStr){
        return null
    }else{
        return JSON.parse(userStr);
    }
}

export function getTokenApi(){
    const token = localStorage.getItem('token_api')
    if(!token){
        return null
    }
    return token
}