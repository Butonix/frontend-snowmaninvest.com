import Layout from '../../../components/Layout';
import { isAuth } from '../../../actions/auth';
import router from 'next/router';
import { useEffect } from 'react';
import AdminCategory from '../../../components/admin/category';
import AdminCateogry from '../../../components/admin/category';

const admin = () => {

    useEffect(() => {
        if(isAuth()){
            if(isAuth().role != 2){
                router.push('/signin')
            }
        }
    }, [])

    return (
        <Layout theme={'bright'}>
            <div className="content-wrapper">
                <h2 className="mt-3 text-grey">管理员控制台</h2>
                <hr/>
                <AdminCateogry/>
            </div>
        </Layout>
    )
}

export default admin;