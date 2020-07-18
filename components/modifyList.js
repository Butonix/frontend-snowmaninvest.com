import styles from '../components/component-style/List.module.scss';
import Link from 'next/link';
import Router from 'next/router';
import { API } from '../config';
import { isAuth, getCookie } from '../actions/auth';
import { removeBlog } from '../actions/blog';
import { useState } from 'react';


const ModifyList = ({data, title}) => {
    let token = getCookie('token')

    const handleDelete = (slg) => {
        if(window.confirm('确定删除此文章？')){
            removeBlog(token, slg).then(data => {
                if( data == undefined) {
                    setErrorMsg(true)
                }else if (data.error) {
                    window.alert(`${data.error}`)
                }else{
                    Router.reload();
                }
            })
        }
    }
    const btn = (slug) => {
        if(data[0] && isAuth()){
            if(data[0].postedBy._id == isAuth()._id){
                return(
                    <div className="my-2">
                        <a href={`/articles/update/${slug}`}><button className="mr-2 btn-snowblue">编辑文章</button></a>
                        <button onClick={() => {handleDelete(slug)}} className="btn-snowred">删除文章</button>
                    </div>
                )
            }else{
                return(
                    <></>
                )
            }
        }
        
    }

    //error message
    const [ errorMsg, setErrorMsg ] = useState(false);
    const errorMsgComponent = () => (
        <div className="error-container">
                <i onClick={errorMsgHandler} class="fas fa-times-circle"></i>
                <p>抱歉！连接失败，请稍后重试</p>
               
        </div>
      )
    
    const errorMsgHandler = () => {
    setErrorMsg(false)
    }

    return (
        <div className="content-wrapper list">
             { errorMsg && errorMsgComponent() }
            <div className='title-container'>
                <h1 className="title">{title}</h1>
            </div>
        
            <div className="card-contatiner">
                {
                    data && data.map((b, i) => {
                        return (
                            <div className="cards">
                                <Link key={i} href={`/articles/${b.slug}`}>
                                    <img className="image" src={`${API}/blog/photo/${b.slug}`}/>
                                </Link>
                                <div className="card-content">
                                    <Link key={i} href={`/articles/${b.slug}`}>
                                        <a>
                                            <h2 className="card-content-title">{`${b.title}`}</h2>
                                            <p className="card-content-excerpt">{`${b.excerpt}`}</p>
                                        </a>
                                    </Link>
                                    { btn(b.slug) }
                                </div>
                            </div>  
                        )
                    })
                }
            </div>
        </div> 
    )
}

export default ModifyList;

            