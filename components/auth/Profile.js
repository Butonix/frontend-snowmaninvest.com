import styles from '../component-style/List.module.scss';
import Link from 'next/link';
import { API } from '../../config';
import { useState, useEffect } from 'react';
import { getCookie } from '../../actions/auth';
import { getProfile} from '../../actions/user';

const Profile = ({user}) => {

    const [values, setValues] = useState({
        username: '',
        name: '',
        email: '',
        about: '',
        password: ''
    });

    const token = getCookie('token');
    const { username, name, email, password } = values;

    const init = () => {
        getProfile(token).then(data => {
            if( data == undefined) {
                setErrorMsg(true)
            }else if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    username: data.username,
                    name: data.name,
                    email: data.email,
                    password: data.password
                });
            }
        });
    };

    useEffect(() => {
        init()
    }, []);
    
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
            { errorMsg && errorMsgComponent() }
            <div className={styles.wrapper}>
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>个人账户</h1>
                </div>
                <div className={styles.lowerCard}>
            <div className={styles.content}>
            {/* <div className={styles.flexWrap}>
                <img src={`${API}/user/photo/${username}`}/>
            </div> */}
            
            <div className={styles.inputFlex}>
                <p className={styles.titleSmall}>用户ID</p>
                <input type="text" placeholder="您的用户名" value={username} readOnly/>
            </div>
            <div className={styles.inputFlex}>
                <p className={styles.titleSmall}>用户名</p>
                <input type="text" placeholder="您的用户名" value={name} readOnly/>
            </div>
            <div className={styles.inputFlex}>
                <p className={styles.titleSmall}>电子邮箱</p>
                <input type="email" placeholder="您的电子邮箱" value={email} readOnly/>
            </div>
            <div className={styles.inputFlex}>
                <p className={styles.titleSmall}>密码</p>
                <input type="password" placeholder="***************************"  readOnly/>
            </div>
            
            <Link href="/profile/update">
                <button className={styles.button}>编辑资料</button>
            </Link>
            
        </div>
    </div>
               
            </div> 
        </>
    )
}

export default Profile;