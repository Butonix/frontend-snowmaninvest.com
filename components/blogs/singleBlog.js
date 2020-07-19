import { readSingleBlog } from '../../actions/blog';
import { useEffect, useState } from 'react';
import { DOMAIN, API, APP_NAME } from '../../config';
import Output from 'editorjs-react-renderer';
import DisqusThread from '../../components/blogs/DisqusThread';
import { isAuth, getCookie } from '../../actions/auth';
import { savePostBtnReq } from '../../actions/blog';
import Head from 'next/head';
import { withRouter } from 'next/router';

const SingleBlog = ({slug, router}) => {

    let token = getCookie('token');
    const [ saveBtn, setSaveBtn ] = useState("");
    const [ logged, setLogged ] = useState();
    const [ blogData, setBlogData ] = useState({
        blogId  : "",
        title   : "",
        body    : "",
        author  : "",
        mtitle  : "",
        mdesc   : "",
        date    : "",
        slugs   : slug
    });

    const {blogId, title, body, author, mtitle, mdesc, date, slugs } = blogData;

    useEffect(() => {
        if(isAuth()){
            setLogged(true)
        }else{
            setLogged(false)
        }
        initBlogData();
    }, [])
    
    const head = () => (
        <Head>
            <title>{`雪人投资`}</title>
            <meta
                name="description"
                content={`content="以文字的力量， 推崇智慧学习的方式， 教育更多人投资理财 以理财为基本，投资为策略，股票外汇知识为工具 达到财务自由!"`}
            />
            <link rel="canonical" href={`${DOMAIN}/${slugs}`} />
            <meta property="og:title" content={`${mtitle}`} />
            <meta
                property="og:description"
                content={`以文字的力量， 推崇智慧学习的方式， 教育更多人投资理财 以理财为基本，投资为策略，股票外汇知识为工具 达到财务自由!"`}
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${DOMAIN}/${slugs}`} />
            <meta property="og:site_name" content={`${title}`} />
            
            <meta property="og:image" content={`${API}/blog/photo/${slugs}`} />
            <meta property="og:image:secure_url" content={`${API}/blog/photo/${slugs}`} />
            <meta property="og:image:type" content="image/jpg" />
        </Head>
    )

    const initBlogData = () => {
        readSingleBlog( slug ).then((data) => {
            if( data == undefined) {
                setErrorMsg(true)
            }else if(data.error) {
                console.log(data.error)
            }

            let i = data.createdAt.indexOf('T')
            let dat = data.createdAt.slice(0,i);

            let tempData = {
                blogId: data._id,
                title: data.title,
                body: data.body,
                author: data.postedBy.name,
                mtitle: data.mtitle,
                mdesc: data.mdesc,
                date: dat,
                slugs: data.slug
            }
            initBtnState(data._id);
            setBlogData(tempData)
        })
    }

    const initBtnState = ( id ) => {
        let query = {
            "blogId":`${id}`,
            "checkState": true
        }
        savePostBtnReq(query, token).then( data => {
            if( data == undefined) {
                setErrorMsg(true)
            }else if(data.error){
                console.log(data.error)
            }

            if(data.save){
                setSaveBtn(false);
            }else{
                setSaveBtn(true);
            }
            
        })
    }

    const handleSavePost = () => {
        let query = {
            "blogId":`${blogId}`,
            "checkState": false,
            "savePost": true,
            "unsavePost": false
        }

        savePostBtnReq(query, token).then( data => {
            if( data == undefined) {
                setErrorMsg(true)
            }else if(data.error){
                console.log(data.error)
            }
            setSaveBtn(!saveBtn);
        })
    }

    const handleUnsavePost = () => {
        let query = {
            "blogId":`${blogId}`,
            "checkState": false,
            "savePost": false,
            "unsavePost": true
        }

        savePostBtnReq(query, token).then( data => {
            if( data == undefined) {
                setErrorMsg(true)
            }else if(data.error){
                console.log(data.error)
            }
            setSaveBtn(!saveBtn)
        })
    }

    const unSavePostBtn = () => {
        
        return(
            <div>
                <button onClick={ handleUnsavePost } className="btn-snowgrey">
                    <i className="far fa-bookmark mr-1"></i>
                    取消收藏
                </button>
            </div>
        )
    }

    const savePostBtn = () => {
    
        return (
            <div>
                <button onClick={ handleSavePost } className="btn-snowblue">
                    <i className="fas fa-bookmark mr-1"></i>
                    收藏文章
                </button>
            </div>
        )
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
            { head() }
            { errorMsg && errorMsgComponent() }
            <img className="object-fit-100" src={`${API}/blog/photo/${slugs}`} alt=""/>
            <div className="container d-relative">
                <article className="my-5 w-75 mx-auto" id="article">
                    <h1 className="mb-3">{title}</h1>
                    <small className="text-s-grey author"><i className="fas fa-user-circle mr-1 text-s-grey"></i>{author} <br/> <span>发布于: {date}</span> </small>
                    <hr/>
                    <Output className="line-height-nice" data={ body }/>
                    <hr/>
                    <div className="mt-2 absolute">
                        { logged && saveBtn && savePostBtn() }
                        { logged && !saveBtn && unSavePostBtn() }
                    </div>
                </article>
                <DisqusThread id={`${blogId}`} title={`${title}`} path={`/articles/${slugs}`}/>
            </div>
        </>
    )

}

export default withRouter(SingleBlog);