import fetch from 'isomorphic-fetch';
import { API } from '../config';
import { isAuth, handleResponse } from './auth';
import queryString from 'query-string';

export const createBlog     = ( blog, token ) => {
    return fetch(`${API}/blog`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: blog
    }).then(response => {
        handleResponse(response);
        return response.json();
    }).catch( err => console.log(err));
}

export const getBlogList    = ( frontQuery ) => {
    return fetch(`${API}/blogs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(frontQuery)

    }).then( response => {
        return response.json();
    })
} 

export const readSingleBlog = (slug) => {
    return fetch(`${API}/articles/${slug}`, {
        method: 'GET'
    }).then( response => {
        return response.json();
    })
}

export const savePostBtnReq = ( query, token ) => {

    return fetch(`${API}/blog/bookmark`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(query)
    }).then( response => {
        return response.json();
    })
}

export const removeBlog = ( token, slug ) => {
    return fetch(`${API}/blog/remove/${slug}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
    }).then(response => {
        handleResponse(response);
        return response.json();
    }).catch( err => console.log(err));
}

export const updateBlogAction = ( blog, token, slug ) => {
    return fetch(`${API}/blog/update/${slug}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: blog
    }).then(response => {
        handleResponse(response);
        return response.json();
    }).catch( err => console.log(err));
}

export const listSearch = params => {
    let query = queryString.stringify(params);
    console.log('query params', query);
    return fetch(`${API}/blogs/search?${query}`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const resetTempImage = ( token ) => {
    return fetch(`${API}/resetImage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then( response => {
        return response.json();
    })
}