import fetch from 'isomorphic-fetch';
import { API } from '../config';
import { isAuth, handleResponse } from './auth';

export const getTags = () => {
    return fetch(`${API}/tags`, {
        method:'GET'
    }).then(response => {
        return response.json();
    }).catch(err => console.log(err));
}


export const publishTag = ( tag, token ) => {

  
    return fetch(`${API}/tag`, {
        method: 'POST',
        
        headers: {
            'Content-Type':'application/json',
                Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(tag)
        
    }).then(response => {
        handleResponse(response);
        return response.json();
    }).catch( err => console.log(err));
    
    
}


export const deleteTag = (slug, token) => {

    return fetch(`${API}/tag/${slug}`,{
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
