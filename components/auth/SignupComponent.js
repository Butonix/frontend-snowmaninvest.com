import styles from '../component-style/Auth.module.scss';
import Link from 'next/link';
import Router from 'next/router';
import { useState, useEffect } from 'react';
import { signup, authenticate, isAuth } from '../../actions/auth';
import LoginGoogle from '../auth/LoginGoogle';

const SignupComponent = () => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    })

    const { name ,email, password, password2, error, loading, message, showForm } = values;


    useEffect(() => {
        isAuth() && Router.push(`/`);
    }, []);

    const handleChange = name => e => {
        setValues({ ...values, error: false,message:false, [name]: e.target.value });
    }
    
    
    const handleSubmit = e => {
        
        e.preventDefault();
        if(password !== password2){
            setValues({ ...values, error: "请输入相同的密码" });
        }else{
            setValues({ ...values, loading: true, error: false, message:false});
            const user = { name, email, password };

            signup(user).then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false });
                } else {
                setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    password2: '',
                    error: '',
                    loading: false,
                    message: data.message,
                    showForm: false
                });
                }
            });
        }
         
    }

    const showLoading = () => (loading ? <div className="alert alert-info">Loading...</div> : '');
    const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '');
    const showMessage = () => (message ? <div className="alert alert-info">{message}</div> : '');

    const signupForm = () => {
        return (
            <>
                <form onSubmit={handleSubmit}>
                    <p className={styles.smallTitle}>用户名</p>
                    <input value={name} onChange={handleChange('name')} type="text" placeholder="您的用户名"/>
                    
                    <p className={styles.smallTitle}>电子邮箱</p>
                    <input value={email} onChange={handleChange('email')} type="email" placeholder="您的电子邮箱"/>
                    
                    <p className={styles.smallTitle}>密码</p>
                    <input value={password} onChange={handleChange('password')} type="password" placeholder="您的密码"/>
                    
                    <p className={styles.smallTitle}>确认密码</p>
                    <input value={password2} onChange={handleChange('password2')} type="password" type="password" placeholder="您的密码"/>
                    
                    <input className={styles.submitBtn} type="submit" value="注册"/>
                </form>
                <p className={styles.sectionBreakA}>已有账户? 点击<Link href="/signin"><a><u>这里</u></a></Link>登录</p>
                <p className={styles.sectionBreak}>或者</p>
                {/* <a href="#">
                    <div className={styles.oAuthBtn}>
                        <div className={styles.center}>
                            <img src="/icons/facebook.svg"/>
                            <p>Sign In with Facebook</p>
                        </div>
                    </div>
                </a> */}
                <LoginGoogle/>
            </>
        )
    }

    return (
        <>
            {showError()}
            {showLoading()}
            {showMessage()}
            {showForm && signupForm()}
        </>
    )
}

export default SignupComponent;