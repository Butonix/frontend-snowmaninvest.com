import fetch from 'isomorphic-fetch';
import { API } from '../config';
import { isAuth, handleResponse } from './auth';

export const create = ( category, token ) => {

    return fetch(`${API}/category`, {
        method: 'POST',
        
        headers: {
            'Content-Type':'application/json',
                Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(category)
        
    }).then(response => {
        handleResponse(response);
        return response.json();
    }).catch( err => console.log(err));
    
    
}

export const getCategories = () => {
    return fetch(`${API}/categories`, {
        method:'GET'
    }).then(response => {
        return response.json();
    }).catch(err => console.log(err));
}

export const removeCategory = (slug, token) => {
    
    return fetch(`${API}/category/${slug}`,{
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
             Authorization: `Bearer ${token}`,
        }
    }).then(response => {
        handleResponse(response);
        return response.json();
    }).catch( err => console.log(err));
}

export const updateCategory = ( slug, name, token ) => {
    
    let slugData = {
        name: name
    }

    return fetch(`${API}/category/${slug}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(slugData)
    }).then(response => {
        handleResponse(response);
        return response.json();
    }).catch( err => console.log(err));
}