import Layout from '../components/Layout';
import SigninComponent from '../components/auth/SigninComponent';
import styles from '../components/component-style/Auth.module.scss';


export default function Signin() {
   
   return (
       <Layout theme={`bright`}>
          <div className={styles.contentWrapper}>
            <h1>会员登录</h1>
            <SigninComponent/>
          </div>
       </Layout>
    )
  }