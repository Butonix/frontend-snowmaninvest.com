import Link from 'next/link';
import { API } from '../config';

const List = ({data, title}) => {
    
    return (
        <div className="content-wrapper list">
            <div className='title-container'>
                <h1 className="title">{title}</h1>
            </div>
            
            <div className="card-contatiner">
                {
                    data && data.map((b, i) => {
                        return (
                            <Link key={i} href={`/articles/${b.slug}`}>
                                <div className="cards">
                                    <img className="image" src={`${API}/blog/photo/${b.slug}`}/>
                                    <div className="card-content">
                                        <h2 className="card-content-title">{`${b.title}`}</h2>
                                        <p className="card-content-excerpt">{`${b.excerpt}`}</p>
                                    </div>
                                </div>  
                            </Link>
                        )
                    })
                }
            </div>
        </div> 
    )
}

export default List;