import Router from 'next/router';
import GoogleLogin from 'react-google-login';
import { loginWithGoogle, authenticate, isAuth } from '../../actions/auth';
import { GOOGLE_CLIENT_ID } from '../../config';

const LoginGoogle = () => {

    const responseGoogle = response => {
        const tokenId = response.tokenId;
        const user = { tokenId };

        loginWithGoogle(user).then( data => {
            if(data.error) {
                console.log(data.error)
            }else{
                authenticate(data, () => {
                    if (isAuth() && isAuth().role === 1) {
                        Router.push(`/`);
                    } else {
                        Router.push(`/`);
                    }
                });
            }
        })

    }

    return (
        <div className="pt-4 login-with-google-div">
            <GoogleLogin
                clientId={`${GOOGLE_CLIENT_ID}`}
                buttonText="Login with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                theme="dark"
            />
        </div>
    )
}

export default LoginGoogle;