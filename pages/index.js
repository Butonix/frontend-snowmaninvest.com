import Head from 'next/head'
import Layout from '../components/Layout';
import Hero from '../components/home/hero';
import HomeCard from '../components/home/homeCard';
import { getBlogList } from '../actions/blog';
import { useEffect, useState } from 'react';
import { DOMAIN, APP_NAME } from '../config';
import { withRouter } from 'next/router';

const Home = ({router}) => {
  
  const [ writterList, setWritterList ] = useState([]);
  const [ heroList, setHeroList ] = useState([]);
  const [ communityList, setCommunityList ] = useState([]);
  const [ errorMsg, setErrorMsg ] = useState(false);
  useEffect(() => {
    initWritterBlogList();
  }, [])

  
  const head = () => (
    <Head>
        <title>INVESTOLOGY 雪人投资</title>
        <meta
            name="description"
            content="以文字的力量， 推崇智慧学习的方式， 教育更多人投资理财 以理财为基本，投资为策略，股票外汇知识为工具 达到财务自由!"
        />
        <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
        <meta property="og:title" content={`${APP_NAME}`} />
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

  const initWritterBlogList = () => {
    let priority = false;
    let query;
    //Send another Request to check if Priority is Available
    if(priority) {
      //get the three blog list

      query = {
        "query" : { "role": "1" },
        "skip"  : 0,
        "limit" : 6
      }
    }else{
      query = {
        "query" : { "role": "1" },
        "skip"  : 0,
        "limit" : 9
      }
    }
    
    getBlogList(query).then((result) => {
      if(result == undefined) {
        setErrorMsg(true)
      }else if (result.error){
        console.log(result.error)
      }else{
        let hero = result.data.slice(0,3);
        let writter = result.data.slice(3,9);
        setHeroList(hero);
        setWritterList(writter);
      }
    })

    let communityQuery = {
      "query" : { "role": "0" },
      "skip"  : 0,
      "limit" : 8
    }
    getBlogList(communityQuery).then((result) => {
      if(result == undefined) {
        setErrorMsg(true)
      }else if(result.error){
        console.log(result.error)
      }else{
        let community = result.data.slice(0,6);
        setCommunityList(community);
      }
    })
  }

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
      {head()}
      <Layout theme={`dark`}>
        { errorMsg && errorMsgComponent() }
        <Hero data={heroList}/>
        <HomeCard data={writterList} title="精选文章"/>
        <HomeCard data={communityList} title="社区文章"/>
      </Layout>
    </>
  )
}

export default withRouter(Home);