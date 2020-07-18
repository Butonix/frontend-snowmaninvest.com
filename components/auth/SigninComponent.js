import styles from '../component-style/Auth.module.scss';
import Link from 'next/link';
import Router from 'next/router';
import { useState, useEffect } from 'react';
import { signin, authenticate, isAuth } from '../../actions/auth';
import LoginGoogle from '../../components/auth/LoginGoogle';

const SigninComponent = () => {

    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    });

    const { email, password, error, loading, message, showForm } = values;

    useEffect(() => {
        isAuth() && Router.push(`/`);
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        // console.table({ name, email, password, error, loading, message, showForm });
        setValues({ ...values, loading: true, error: false });
        const user = { email, password };

        signin(user).then(data => {
            if (typeof(data) == 'undefined') {
                setValues({ ...values, error: "抱歉，我们的服务器这正在维修，稍后请重试", loading: false });
            } else if(data.error) {
                setValues({ ...values, error: data.error, loading: false });
            }else {
                // save user token to cookie
                // save user info to localstorage
                // authenticate user
                authenticate(data, () => {
                    if (isAuth() && isAuth().role === 2) {
                        Router.push(`/profile/admin`);
                    } else {
                        Router.push(`/`);
                    }
                });
            }
        });
    };

    const handleChange = name => e => {
        setValues({ ...values, error: false, [name]: e.target.value });
    };

    const showLoading = () => (loading ? <div className="btn-snowblue">登陆中...</div> : '');
    const showError = () => (error ? <div className="btn-snowred">{error}</div> : '');
    const showMessage = () => (message ? <div className="alert alert-info">{message}</div> : '');

    return (
        <>
            {showError()}
            {showLoading()}
            {showMessage()}
            {showForm && (
            <>
                <form onSubmit={handleSubmit}>
                   <p className={styles.smallTitle}>电子邮箱</p>
                   <input value={email} onChange={handleChange('email')} type="email" placeholder="您的电子邮箱"/>
                   <p className={styles.smallTitle}>密码</p>
                   <input value={password} onChange={handleChange('password')} type="password" placeholder="您的密码"/>
                   <input className={styles.submitBtn} type="submit" value="登录"/>

                </form>
                <p className={styles.sectionBreakA}>还没有账户? 点击<Link href="/signup"><a><u>这里</u></a></Link>登录</p>
                <p className={styles.sectionBreak}>或者</p>
                <LoginGoogle/>
                {/* <a href=""><div className={styles.oAuthBtn}><div className={styles.center}><img src="/icons/facebook.svg"/><p>Sign In with Facebook</p></div></div></a> */}
            </>
            )}
        </>
    )
}

export default SigninComponent;