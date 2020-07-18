import { API } from  '../../config';
import Link from 'next/link';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

const Hero = ({data, title}) => {

    let count = 1;

    const smartTrim = (str, length, delim, appendix) => {
        if (str.length <= length) return str;
    
        var trimmedStr = str.substr(0, length + delim.length);
    
        var lastDelimIndex = trimmedStr.lastIndexOf(delim);
        if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);
    
        if (trimmedStr) trimmedStr += appendix;
        return trimmedStr;
    };

    const cutDate = (data) => {

        let i = data.indexOf('T')
        let date = data.slice(0, i)
        return `${date}`
    }
    
    const heroMobile = () => {
        return (
            <div id="carouselExampleControls" className="dis-sm-block carousel slide" data-ride="carousel" pause="hover">
                <div className="carousel-inner">
                    {
                        
                        data.map((d,i) => {
                            let active;
                            if(count == 1) {
                                active = 'active'
                                count = 2
                            }else{
                                active = ''
                            }

                            return (
                                <Link key={i} href={`/articles/${d.slug}`}>
                                    <div className={`carousel-item ${active}`}>
                                        <img src={`${API}/blog/photo/${d.slug}`} className="d-block w-100"/>
                                        <h2 className="title">
                                            {smartTrim(d.title, 30, ' ', '...') }
                                        </h2>
                                    </div>
                                </Link>
                            )
                        })
                    }
                
                </div>
                <div className="control">
                    <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                        <i className="text-white fas fa-arrow-circle-left"></i>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                        <i className="text-white fas fa-arrow-circle-right"></i>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
                
        </div>
        )
    }

    const heroSectionBarDesktop = () => {
        return (
            <header className="heroDesktop dis-lg-grid">          
                {   
                    data.map((d,i) => {
                        return (
                            <Link key={i} href={`articles/${d.slug}`} className="heroDesktop dis-lg-grid">
                                <div className="heroDesktop__item">
                                    <img src={`${API}/blog/photo/${d.slug}`}/>
                                    <div className="heroDesktop__details">
                                        <h2>{smartTrim(d.title, 40, ' ', '...')}</h2>
                                        <small>{cutDate(d.createdAt)}</small>
                                        <p>{ ReactHtmlParser(d.excerpt) }</p>
                                        <i className="fas fa-arrow-alt-circle-right"></i>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                }
            </header>
        )
    }
    
    return (
        <>
            {heroMobile()}
            {heroSectionBarDesktop()}
        </>  
    )
}

export default Hero;