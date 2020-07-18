import Layout from '../../../components/Layout';
import Router from 'next/router';
import { useState, useEffect } from 'react';
import ModifyList from '../../../components/modifyList';
import { getBlogList } from '../../../actions/blog'
import { getCategories } from '../../../actions/category'
import { isAuth } from '../../../actions/auth';

const ProfileArticleList = () => {
    
    const [ tempBlog, setTempBlog ]       = useState([]);
    const [ loadedBlog, setLoadedBlog ]   = useState([]);
    const [ loadMoreBtn, setLoadMoreBtn ] = useState(false);
    const [ listLimit, setListLimit]      = useState(16);
    const [ toSkip, setToSkip ]           = useState(0); 
    const [ title, setTitle ]             = useState("我的文章");
    const [ personal, setPersonal ]       = useState();

    useEffect(() => {
        if(!isAuth()){
            Router.push(`/signin`)
        }else{
            let params = {
                query: { postedBy: isAuth()._id },
                limit: listLimit,
                skip: toSkip
            }
            getBlogList( params ).then( data => {
                
                if( data == undefined) {
                    setErrorMsg(true)
                }else if (data.error) {
                    console.log(data.error)
                }
                setLoadedBlog(data.data)
                let newSkip = parseInt(data.skip) + parseInt(data.listSize)
    
                let params2 = {
                    query: { postedBy: isAuth()._id },
                    limit: listLimit,
                    skip: newSkip
                }
    
                getBlogList( params2 ).then( data => {
                    if( data == undefined) {
                        setErrorMsg(true)
                    }else if (data.error) {
                        console.log(data.error)
                    }
                    if(data.listSize == 0) {
                        setLoadMoreBtn(false)
                    }else{
                        setLoadMoreBtn(true)
                        let newSkip = parseInt(data.skip) + parseInt(data.listSize)
                        setToSkip(newSkip);
                        setTempBlog(data.data)
                    }
                    
                })
            })
        }
        
    }, [])
    
    const handleLoadMore = () => {
        setLoadedBlog([...loadedBlog, ...tempBlog]);
        initTempBlog();
    }

    const loadBtn = () => {
        return (
            <button 
                onClick={handleLoadMore} 
                className="mt-5 btn-snowblue">
                更多文章
            </button>
        )
    }

    const initTempBlog = () => {
        let params = {
            query: { postedBy: isAuth()._id },
            limit: listLimit,
            skip: toSkip
        }

        getBlogList( params ).then( data => {
            if(data.error) {
                console.log(data.error)
            }
            let newSkip = parseInt(data.skip) + parseInt(data.listSize)
            setToSkip(newSkip);
            setTempBlog(data.data)
            if(data.listSize == 0) {
                setLoadMoreBtn(false)
            }else{
                setLoadMoreBtn(true)
            }
        })

        
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
        <>
            <Layout theme={'bright'}>
                { errorMsg && errorMsgComponent() }
                <ModifyList data={loadedBlog} title={title}/>
                <div className="container d-flex justify-content-center">
                    { loadMoreBtn && loadBtn() }
                </div>
            </Layout>

        </>
    )
}

export default ProfileArticleList;

