import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import List from '../../components/list';
import { getBlogList } from '../../actions/blog'

const ArticleList = ({blogs, limit, skip, returnSize}) => {

    const [ tempBlog, setTempBlog ]       = useState([]);
    const [ loadedBlog, setLoadedBlog ]   = useState(blogs);
    const [ loadMoreBtn, setLoadMoreBtn ] = useState();
    const [ listLimit, setListLimit]      = useState(limit);
    const [ toSkip, setToSkip ]           = useState(returnSize); 

    useEffect(() => {
        initTempBlog();
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
            query: {},
            limit: listLimit,
            skip: toSkip
        }

        getBlogList( params ).then( data => {
            if( data == undefined) {
                setErrorMsg(true)
            }else if (data.error) {
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
                <List data={loadedBlog} title="文章"/>
                <div className="container d-flex justify-content-center">
                    { loadMoreBtn && loadBtn() }
                </div>
            </Layout>

        </>
    )
}

ArticleList.getInitialProps = () => {
    let params = {
        query: {},
        limit: 16,
        skip: 0
    }
    return getBlogList( params ).then( data => {
        if(data.error){
            console.log(data.error)
        }
        return {
            blogs: data.data,
            limit: data.limit,
            skip: data.skip,
            returnSize: data.listSize
        }
    })
}

export default ArticleList;

