import { isAuth, getCookie } from '../../../actions/auth';
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout'
import { profileBookmark } from '../../..//actions/auth';
import List from '../../../components/list';

const bookMarkList = () => {
    let token = getCookie('token');
    const [ userId, setUserId ] = useState("")
    const [ list, setList ] = useState([])

    useEffect(() => {
        !isAuth() && Router.push(`/signin`);
        setUserId(isAuth()._id);
        initBookMarkList();
    }, [])

    const initBookMarkList = () => {
        profileBookmark(token).then(data => {
            if( data == undefined) {
                setErrorMsg(true)
            }else if (data.error){
                console.log(data.error)
            }
            setList(data.savedPost)
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
        <Layout theme={'bright'}>
            { errorMsg && errorMsgComponent() }
            <List data={list} title="我的收藏"/>
        </Layout>
    )
}   

export default bookMarkList;