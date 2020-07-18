import Link from 'next/link';
import {API} from '../../config';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

const homeCard = ({data, title}) => {
    
    let left = data.slice(0,2);
    let right  = data.slice(2,7);

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

    let more = "";

    if(title == '精选文章'){
        more = "/articles/featuredblog"
    }else if(title == '社区文章'){
        more = "/articles/comunityblog"
    }

    const homeCardItem = () => {
        return (
            <section className="content-wrapper homeCard">
                <div className="d-flex justify-space-between align-items-center mb-3 homeCard-top">
                    <h3 className="text-grey">{title}</h3>
                    <Link href={more}>
                        <button className="btn-snowblue">更多</button>
                    </Link>
                </div>
                <div className="d-flex height-limiter">
                    <div className="homeCard-Big">
                        {
                            left.map((d, i ) => {
                                return (
                                    <Link key={i} href={`/articles/${d.slug}`}>
                                        <div className="homeCard-Big_item">
                                            <img src={`${API}/blog/photo/${d.slug}`}/>
                                            <div className="bigcard-details">
                                                <h4 className="text-white">{smartTrim(d.title, 25, ' ', '...')}</h4>
                                                <p className="text-white">{ ReactHtmlParser(d.excerpt) }</p>
                                            </div>  
                                            
                                            <i className="fas fa-arrow-alt-circle-right"></i>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                    <div className="homeCard-Small  justify-space-between">
                        {
                            right.map((d, i ) => {
                                return (
                                    <Link key={i} href={`/articles/${d.slug}`}>
                                        <div className="d-flex justify-space-between align-items-center homeCard-Small__item">
                                            <div className="date">{
                                                cutDate(d.createdAt)
                                            }</div>
                                            <div className="content">
                                                <h5>{smartTrim(d.title, 25, ' ', '...')}</h5>
                                                <p>{ ReactHtmlParser(d.excerpt) }</p>
                                            </div>
                                            <div className="image">
                                                <img src={`${API}/blog/photo/${d.slug}`} />
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
            </section>
        )
    }

    return (
        <>
            {homeCardItem()}
        </>
    )

}

export default homeCard;