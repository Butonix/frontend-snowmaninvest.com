import Link from 'next/link';
import { API, DOMAIN, APP_NAME } from '../config';
import { withRouter } from 'next/router';
import Head from 'next/head';

const List = ({data, title, router}) => {

    const head = () => (
        <Head>
            <title>{title} | {APP_NAME}</title>
            <meta
                name="description"
                content="以文字的力量， 推崇智慧学习的方式， 教育更多人投资理财 以理财为基本，投资为策略，股票外汇知识为工具 达到财务自由!"
            />
            <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
            <meta property="og:title" content={`${title} | ${APP_NAME}`} />
            <meta
                property="og:description"
                content="以文字的力量， 推崇智慧学习的方式， 教育更多人投资理财 以理财为基本，投资为策略，股票外汇知识为工具 达到财务自由!"
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content="/public/logo.png" />
            <meta property="og:image:secure_url" content="/public/logo.png" />
            <meta property="og:image:type" content="image/jpg" />
        </Head>
    )
    
    return (
        <>
            {head()}
            <div className="content-wrapper list">
                <div className='title-container'>
                    <h1 className="title">{title}</h1>
                </div>
                
                <div className="card-contatiner">
                    {
                        data && data.map((b, i) => {
                            return (
                                <Link key={i} href={`/articles/${b.slug}`}>
                                    <div className="cards">
                                        <img className="image" src={`${API}/blog/photo/${b.slug}`}/>
                                        <div className="card-content">
                                            <h2 className="card-content-title">{`${b.title}`}</h2>
                                            <p className="card-content-excerpt">{`${b.excerpt}`}</p>
                                        </div>
                                    </div>  
                                </Link>
                            )
                        })
                    }
                </div>
            </div> 
        </>
    )
}

export default withRouter(List);