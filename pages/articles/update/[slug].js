import Layout from '../../../components/Layout';
import dynamic from 'next/dynamic';
import { isAuth } from '../../../actions/auth';
import { useEffect } from 'react';
import router from 'next/router';

const UpdateBlog = dynamic(
    () => import('../../../components/blogs/updateBlog'),
    { ssr: false }
)


const updateBlog = () => {

    useEffect(() => {
        if(!isAuth()){
            router.push('/signin');
        }
    }, [])

    return (
        <Layout theme="bright">
            <UpdateBlog/>
        </Layout>
    )
}

export default updateBlog;