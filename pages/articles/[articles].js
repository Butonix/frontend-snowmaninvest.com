import Layout from '../../components/Layout';
import SingleBlog from '../../components/blogs/singleBlog';


const Articles = ({slug}) => {
    
    return (
        <>
            <Layout theme={'bright'}>
                <SingleBlog slug={`${slug}`}/>
            </Layout>

        </>
    )
}

Articles.getInitialProps = ( context ) => {
    return{
        slug: context.query.articles
    }
}

export default Articles;