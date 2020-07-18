import Head from 'next/head'
import Layout from '../components/Layout';
import Hero from '../components/home/hero';
import HomeCard from '../components/home/homeCard';
import { getBlogList } from '../actions/blog';
import { useEffect, useState } from 'react';

export default function Home() {
  
  const [ writterList, setWritterList ] = useState([]);
  const [ heroList, setHeroList ] = useState([]);
  const [ communityList, setCommunityList ] = useState([]);
  const [ errorMsg, setErrorMsg ] = useState(false);
  useEffect(() => {
    initWritterBlogList();
  }, [])

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
    <Layout theme={`dark`}>
       { errorMsg && errorMsgComponent() }
       <Hero data={heroList}/>
       <HomeCard data={writterList} title="精选文章"/>
       <HomeCard data={communityList} title="社区文章"/>
     </Layout>
  )
}