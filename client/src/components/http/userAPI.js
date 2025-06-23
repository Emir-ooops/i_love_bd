import {$authHost, $host} from "./index";
import { jwtDecode } from "jwt-decode";  // Changed from jwt_decode to jwtDecode

export const registration = async (email, password, username) => {
    const {data} = await $host.post('api/user/registration', {email, password,username,role: 'user'})
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user)); // Сохраняем пользователя
    return data.user;  // Changed from jwt_decode to jwtDecode
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user)); // Сохраняем пользователя
    return data.user; // Возвращаем данные пользователя
    // Changed from jwt_decode to jwtDecode
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user)); // Сохраняем пользователя
    return data.user;  // Changed from jwt_decode to jwtDecode
}