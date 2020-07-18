import Layout from '../../components/Layout';
import Profile from '../../components/auth/Profile';
import { useRouter } from 'next/router';

const profile = () => {

    const router = useRouter();
    const {profile} = router.query;

    return(
        <>  
            <Layout>
                <Profile user={profile}/>
            </Layout>

        </>
    )
    
}

export default profile;