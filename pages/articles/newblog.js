import Layout from '../../components/Layout';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import router from 'next/router';
import { isAuth } from '../../actions/auth';


const CreateBlog = dynamic(
    () => import('../../components/blogs/createBlog'),
    { ssr: false }
)

const newBlog = () => {

    useEffect(() => {
        if(!isAuth()){
            router.push('/signin');
        }
        const handleBeforeUnload = event => event.preventDefault();
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [])

    if(isAuth()){
        var name = isAuth().name;
    }

    const handleReload = (e) => {
        e.preventDefault;
    }


    return (
        <>
            <Layout theme={'bright'}>
                <div className="container">
                    <CreateBlog username={name}/>
                </div>
            </Layout>
        </>
    )
}

export default newBlog;