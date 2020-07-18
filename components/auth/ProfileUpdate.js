import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import { getCookie, isAuth, updateUser } from '../../actions/auth';
import { getProfile, update } from '../../actions/user';
import { API } from '../../config';

const ProfileUpdate = () => {
    const [values, setValues] = useState({
        username: '',
        name: '',
        email: '',
        about: '',
        password: '',
        password2: '',
        error: false,
        success: false,
        loading: false,
        photo: '',
        userData: '',
        photoUrl:''
    });

    const token = getCookie('token');
    const { username, name, email, about, password, password2, error, success, loading, photo, userData, photoUrl } = values;

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
                    about: data.about,
                    photoUrl: data.username,
                    password: '',
                    password2: ''
                });
            }
        });
    };

    useEffect(() => {
        init();
    }, []);

    const handleChange = name => e => {
        // console.log(e.target.value);
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        let userFormData = new FormData();
        userFormData.set(name, value);
        setValues({ ...values, [name]: value, userData: userFormData, error: false, success: false });
    };

    const handleSubmit = e => {
        e.preventDefault();
        if(password !== password2){
            setValues({ ...values, error: "请输入相同的密码" });
        }else{
            setValues({ ...values, loading: true });
            update(token, userData).then(data => {
                if( data == undefined) {
                    setErrorMsg(true)
                }else if (data.error) {
                    setValues({ ...values, error: data.error, success: false, loading: false });
                } else {
                    updateUser(data, () => {
                        setValues({
                            ...values,
                            username: data.username,
                            name: data.name,
                            email: data.email,
                            about: data.about,
                            password: '',
                            success: true,
                            loading: false
                        });
                    });
                }
            });
        }
    };

    const profileUpdateForm = () => (
        <form onSubmit={handleSubmit} className="mb-4">
            {/* <div className="form-group">
                <label className=" btn-snowblue">
                    上传头像
                    <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                </label>
            </div> */}
            <div className="form-group">
                <label className="text-muted">用户名</label>
                <input onChange={handleChange('name')} type="text" value={name} className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input type="text" value={email} className="form-control" readOnly />
            </div>

            <div className="form-group">
                <label className="text-muted">新密码</label>
                <input onChange={handleChange('password')} type="password" value={password} className="form-control" placeholder="您的密码" />
            </div>

            <div className="form-group">
                <label className="text-muted">确认密码</label>
                <input onChange={handleChange('password2')} type="password" value={password2} className="form-control" placeholder="您的密码" />
            </div>

            <div>
                <button type="submit" className="btn btn-primary">
                    更新
                </button>
            </div>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
            账户已更新
        </div>
    );

    const showLoading = () => (
        <div className="alert alert-info" style={{ display: loading ? '' : 'none' }}>
            更新中...
        </div>
    );

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
        <React.Fragment>
            { errorMsg && errorMsgComponent() }
            <div className="content-wrapper">
                <div className="row">
                    <div className="col-md-12">
                        {/* <img
                            src={`${API}/user/photo/${photoUrl}`}
                            className="img img-fluid img-thumbnail mb-3"
                            style={{ maxHeight: 'auto', maxWidth: '100%' }}
                            alt="user profile"
                        /> */}
                    </div>
                    <div className="col-md-8 mb-5">
                        
                        {profileUpdateForm()}
                        {showSuccess()}
                        {showError()}
                        {showLoading()}

                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ProfileUpdate;
