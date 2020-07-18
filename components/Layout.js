import Header from './Header';
import Footer from './Footer';


const Layout = ({theme, children}) => {

    return (
        <>  
            <Header color={theme}/>
                {children}
            <Footer/>
        </>
    )
}

export default Layout;