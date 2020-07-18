import Layout from '../components/Layout';
import SignUpComponent from '../components/auth/SignupComponent';
import styles from '../components/component-style/Auth.module.scss';


export default function SignUp() {
   
   return (
       <Layout theme={`bright`}>
          <div className={styles.contentWrapper}>
            <h1>会员注册</h1>
            <SignUpComponent/>
          </div>
       </Layout>
    )
}