import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { isAuth, signout} from '../actions/auth';
import Link from 'next/link';
import Router from 'next/router'
import { getCategories } from '../actions/category';
import { listSearch } from '../actions/blog';

const Header = ({color}) => {

    if(color == 'dark') {
        var theme = 'theme-dark'
    }else if( color == 'bright') {
        var theme = ''
    }

    //states
    const [ click , setClick ] = useState(false);
    const [ signed , setSigned ] = useState(isAuth());
    const [ categories, setCategories ] = useState([])
    const [ errorMsg, setErrorMsg ] = useState(false);
    
    const scrollBar = useRef(null);
    const [ admin, setAdmin ] = useState(false);
    const [values, setValues] = useState({
        search: undefined,
        results: [],
        searched: false,
        message: ''
    });

    const { search, results, searched, message } = values;
    
    useEffect(() => {
         initCategories();
         if(isAuth()){
             if(isAuth().role == 2){
                setAdmin(true)
             }
         }
    }, [])

    const searchSubmit = e => {
        e.preventDefault();
        listSearch({ search }).then(data => {
            setValues({ ...values, results: data, searched: true, message: `${data.length} 个相关文章` });
        });
    };

    const handleChange = e => {
        // console.log(e.target.value);
        setValues({ ...values, search: e.target.value, searched: false, results: [] });
    };

    const searchedBlogs = (results = []) => {
        return (
            <div className="search-result">
                {message && <p>{message}</p>}
                <hr/>
                {results.map((blog, i) => {
                    return (
                        <div className='searchedItem' key={i}>
                            <Link href={`/articles/${blog.slug}`}>
                                <a className="">{blog.title}</a>
                            </Link>
                        </div>
                    );
                })}
            </div>
        );
    };

    const initCategories = () => {
        getCategories().then( data => {
            if( data == undefined) {
                setErrorMsg(true)
            }else if( data.error ) {
                console.log( data.error );
            }else{
                setCategories(data)
            }
        })
        
    }

    const handleSideBar = () => {
        setClick(!click)
    }

    const scrollableRight = () => {
        scrollBar.current.scrollBy(50,0)
    }

    const scrollableLeft = () => {
        scrollBar.current.scrollBy(-50,0)
    }

    const mobileSideBar = () => (
        <div className="dis-sm-block">
            <div className="sidenav" id="sideNav">
                <div onClick={handleSideBar} className="close-area"></div>
                <div className="sidenav_menu">
                    <i onClick={handleSideBar} className="fas fa-times-circle"></i>
                    <div className="sidenav_items">
                        <ul>
                            <Link href={`/profile/${isAuth().username}`}>
                                <li><i className="fas fa-user-circle"></i>个人账户</li>
                            </Link>
                            <Link href={`/profile/articles`}>
                                <li><i className="fas fa-align-right"></i>我的文章</li>
                            </Link>
                            <Link href={`/profile/bookmark`}>
                                <li><i className="fas fa-bookmark"></i>我的收藏</li>
                            </Link>
                            <li onClick={() => signout(() => Router.replace(`/signin`))}>
                                <i className="fas fa-sign-out-alt"></i>
                                退出账户
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )

    const mobileCategoryBar = () => (
        <div className={`wrapper py-3 dis-none`}>
            <div className="horizontal-menu d-flex">
                <div className="clickBtn clickBtn-left"><i onClick={scrollableLeft} className="fas fa-chevron-left"/></div>
                <div className="scrollable" id="scroll" ref={scrollBar}>
                    <Link href="/"><a>首页</a></Link>
                    <Link href="/articles"><a>文章</a></Link>
                    {/* <Link href="/video"><a>视频</a></Link> */}
                    {
                        categories && categories.map( (c, i) => {
                            return( <Link key={i} href={`/category/${c.slug}`}><a>{c.name}</a></Link>)
                        })
                    }
                </div>
                <div className="clickBtn clickBtn-right"><i onClick={scrollableRight} className="fas fa-chevron-right"></i></div>
            </div>
        </div>
    )

    const mainLeft = () => (
        <Link href="/">
            <div className="left">
                <img className="navbar__logo_img" src="/logo.png" alt="logo"/>
                <span className="fw-7 mx-2">INVESTOLOGY</span>
                <span className="fw-5">雪人投资</span>
            </div>
        </Link>
    )

    const signedBtn = () => (
        <>
            { admin && <a href="/profile/admin"><button className="btn-snowblue">编辑分类</button></a> }
            { !admin && <a href="/articles/newblog"><button className="btn-snowblue">写文章</button></a> }
            <a href="#" className="d-inline-block d-relative dropdown-menu-btn dis-lg-block">
                <i className="fas fa-user"></i>
                    <div className="menu menu-profile d-absolute">
                        <Link href={`/profile/${isAuth().username}`}>
                            <div className="item fw-5"><i className="fas fa-user-circle"></i>个人帐户</div>
                        </Link>
                        <Link href={`/profile/articles`}>
                            <div className="item fw-5"><i className="fas fa-align-right"></i>我的文章</div>
                        </Link>
                        
                        <Link href={`/profile/bookmark`}>
                            <div className="item fw-5"><i className="fas fa-bookmark"></i>我的收藏</div>
                        </Link>
                        
                        <div onClick={() => signout(() => Router.replace(`/signin`))} className="item fw-5">
                            <i className="fas fa-sign-out-alt"></i>退出账户
                        </div>
                    </div>
            </a>
            <a href="#" className="d-relative dropdown-menu-btn dis-sm-block click-menu-btn">
                <i onClick={handleSideBar} className="fas fa-user-circle"></i>
            </a>
        </>
    )

    const unsigned = () => (
        <Link href="/signin">
            <a className="d-inline-block">
                <button className="btn-snowblue">登录</button>
            </a> 
        </Link>
        
    )

    const mainRight = () => (
        <div className="right d-flex align-items-center">
                <ul className="d-flex dis-sm-none">
                    <Link href="/"><li>首页</li></Link>
                    <Link href="/articles">
                        <li className="d-relative dropdown-menu-btn">
                            文章
                            <div className="menu menu-category d-absolute">
                                {
                                    categories && categories.map( (c, i) => {
                                       return( <Link key={i} href={`/category/${c.slug}`}><div className="item fw-5">{c.name}</div></Link>)
                                    })
                                }
                            </div>
                        </li>
                    </Link>
                    {/* <Link href="/video">
                        <li>视频</li>
                    </Link> */}
                    
                </ul>
                <div className="searchInput d-relative">
                    <form onSubmit={searchSubmit}>
                        <input placeholder="搜寻" type="search" onChange={handleChange}/>
                        <svg onClick={searchSubmit} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-search d-absolute" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                            <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                        </svg>
                        {searched && searchedBlogs(results)}
                    </form>
                </div>
                { signed && signedBtn()}
                { !signed && unsigned()}
            </div>
    )

    const errorMsgComponent = () => (
        <div className="error-container">
                <i onClick={errorMsgHandler} className="fas fa-times-circle"></i>
                <p>抱歉！连接失败，请稍后重试</p>
               
        </div>
    )
    
    const errorMsgHandler = () => {
    setErrorMsg(false)
    }
      
    //output
    return (
        <>  
            <Head>
                <title>雪人投资</title>
            </Head>
            { errorMsg && errorMsgComponent() }
            { click && mobileSideBar()}
            <nav className={`${theme}`}>
                <div className={`wrapper py-3`}>
                    {mainLeft()}
                    {mainRight()}
                </div>
                    {mobileCategoryBar()}
            </nav>

        </>
    )
}


export default Header;