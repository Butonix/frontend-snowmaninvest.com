import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import SimpleImage from '../blogs/editorjs-plugin/SimpleImage';
import Link from '@editorjs/link'
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';
import CheckList from '@editorjs/checklist';
import Quote from '@editorjs/quote';

import { useEffect, useState } from 'react';
import { createBlog } from '../../actions/blog';
import { getCategories, publishCategory, deleteCategory, updateCategory } from '../../actions/category';
import { API } from '../../config'
import { setLocalStorage, removeLocalStorage,getLocalStorage, getCookie, isAuth } from '../../actions/auth';
import router from 'next/router'

let blogCreated = 0;
let editor = {};

const CreateBlog = ({username}) => {

    let blog;
    let id = isAuth()._id;
    let token = getCookie('token');

    //states
    const [ categoriesArray, setCategoriesArray ] = useState([]);
    const [ checkedCategory, setCheckedCategory ] = useState([]);

    const [ imgPreviewUrl , setImgPreviewUrl ] = useState(""); 
    const [ values, setValues ] = useState({
        error: '',
        success:'',
        loading: false,
        reload: '',
        title: '',
        formData: ''
    })
    const { error, success , loading, reload, title, formData} = values;
    
    //Pre-loading
    useEffect(() => {
        initCategories();
        setValues({...values, formData: new FormData(), title:JSON.parse(localStorage.getItem('blog')) && JSON.parse(localStorage.getItem('blog')).title})
    }, [reload]);

    if(blogCreated == 0){
        blogCreated = 1;
            editor = new EditorJS({
            holder:'editorjs',
            placeholder:'我的想法...',
            data: JSON.parse(localStorage.getItem('blog')) && JSON.parse(localStorage.getItem('blog')).blog,
            onChange: () => { 
                editor.save().then((outputData) => {
                    let oldData = JSON.parse(localStorage.getItem('blog'));
                    if(oldData) {
                        oldData.title = "";
                        oldData.blog = outputData;
                        setLocalStorage('blog', oldData)
                    }else{
                        let emptyData = {
                            title: title,
                            blog : outputData
                        };
                        setLocalStorage('blog', emptyData)
                    }
                    
                    
                    
                  }).catch((error) => {
                    setValues({...values, error: error})
                  });
            },
            tools: {
                header:{
                    class:Header,
                    inlineToolbar:true
                },
                list:{
                    class:List,
                    inlineToolbar:true
                },
                image:{
                    class:SimpleImage,
                    inlineToolbar:true
                },
                embed: {
                    class:Embed,
                    inlineToolbar:true
                },
                link: {
                    class:Link,
                    inlineToolbar:true,
                    config: {
                        endpoint: `${API}/linkUrl`, // Your backend endpoint for url data fetching
                    }
                },
                image: {
                    class:ImageTool,
                    inlineToolbar:true,
                    config: {
                        endpoints: {
                            byFile: `${API}/uploadFile/temp-${id}`,
                            byUrl:`${API}/uploadUrl`,
                        }    
                    }
                },
                checklist: {
                    class:CheckList,
                    inlineToolbar:true
                },
                quote: {
                    class:Quote,
                    inlineToolbar:true
                }
            },
            logLevel:'VERBOSE'
            });
    }

    

    //Load Categories
    const initCategories = () => {
        getCategories().then( data => {
            if (typeof(data) == 'undefined') {
                setValues({ ...values, error: "抱歉，我们的服务器这正在维修，稍后请重试", loading: false });
            }
            else if(data.error){
                setValues({...values, error: data.error})
            } else{
                setCategoriesArray(data);
            }
            
        })
    }

    // Image Preview Handler
    const handleImagePreview = ( e ) => {
        if(URL.createObjectURL(e.target.files[0])){
            setImgPreviewUrl( URL.createObjectURL(e.target.files[0]) )   
        }

        formData.set('photo', e.target.files[0]);
        setValues({...values, formData, error:""})
    }

    // Component - Categories

    // Categories - Functions
    const handleCategoryArray = ( c ) => {
        setValues({ ...values, error: '' });
        
        // return the first index or -1
        const clickedCategory = checkedCategory.indexOf(c);
        const all = [...checkedCategory];

        if (clickedCategory === -1) {
            all.push(c);
        } else {
            all.splice(clickedCategory, 1);
        }
        setCheckedCategory(all);
    }

    // Render Categories List
    const categories = () => (
        categoriesArray && categoriesArray.map((category, i) => (
                <li key={i} className="input-group mb-1">
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <input type="checkbox" onChange={ () => { handleCategoryArray(category._id)} }/>
                        </div>
                    </div>
                    <div className="form-control">{`${category.name}`}</div>
                </li>
        ))
    )

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
            {success}
        </div>
    );

    const showLoading = () => (
        <div className="alert alert-success" style={{ display: loading ? '' : 'none' }}>
            {loading}
        </div>
    );

    // Component - Pre-Publish Pop Up Modal
    const clearMessage = ( ) => {
        setValues({...values, error: '', success:''})
    }

    const prePublishModal = () =>  (
        <>
            <button type="button" className="btn btn-primary rounded-pill px-4" data-toggle="modal" data-target="#publishBlogModal">
            下一步
            </button>

            <div className="modal fade" id="publishBlogModal" tabIndex="-1" role="dialog" aria-labelledby="publishBlogModal" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title primary-blue font-weight-bolder" id="exampleModalLabel">发布文章</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span onClick={ clearMessage } className="outline-0" aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="featured-image">
                        <h6 className="text-grey">文章封面</h6>
                        <div className="input-group mb-3">
                            <div className="custom-file col-12">
                                <input type="file" onChange={ handleImagePreview } className="custom-file-input " id="inputGroupFile02" accept="image/*"/>
                                <label className="btn btn-primary rounded-pill custom-file-label" htmlFor="inputGroupFile02" aria-describedby="inputGroupFileAddon02">选择图片</label>
                            </div>
                            <div className="image-preview col-12 py-2">
                                {
                                    imgPreviewUrl && (
                                        <img src={imgPreviewUrl} accept="image/*"/>
                                    )
                                }
                                
                            </div>
                        </div>
                    </div>
                    <div className="categories">
                        <h6 className="text-grey">文章分类</h6>
                        <ul className="list-group scrollable pr-2">
                            { categories() }
                        </ul>
                    </div>
                </div>
                <div className="modal-footer justify-content-start">
                    {
                        !loading && (
                            <>
                            <button type="button" className="btn btn-primary rounded-pill px-4" onClick={ publishBlog }>发布</button>
                            <button type="button" onClick={ clearMessage } className="btn btn-secondary rounded-pill px-4" data-dismiss="modal">取消</button>
                            <button type="button" onClick={ reset } className="btn btn-secondary rounded-pill px-4">重设文章</button>
                            </>
                        )
                    }
                    {showError()}
                    {showSuccess()}
                    {showLoading()}
                </div>
                </div>
            </div>
            </div>
        </>
    )

    const reset = () => {
        removeLocalStorage('blog')
        router.reload();
    }
    
    const handleChangeTitle = e => {
        setValues({...values, title: e.target.value})
        editor.save().then((outputData) => {
            let data = {
                title: title,
                blog: outputData
            }
            setLocalStorage('blog', data)
          }).catch((error) => {
            console.log(error)
          });
    }
    
    // Publish Blog
    const publishBlog = e => {
        e.preventDefault();
        editor.save().then((outputData) => {
            let data = JSON.stringify(outputData);
            formData.set('title', title);
            formData.set('categories', checkedCategory);
            formData.set('content', data);
            formData.set('username', `${isAuth().name}`)
            setValues({ ...values, loading:'发布中...' });
            createBlog( formData, token ).then( data => {
                if( data == undefined) {
                    setErrorMsg(true)
                }else if (data.error) {
                    setValues({ ...values, error: data.error, success: false });
                } else {
                    setCategoriesArray([]);
                    setImgPreviewUrl("");
                    editor.blocks.clear();
                    removeLocalStorage('blog')
                    setValues({ ...values, title: '', formData: new FormData(), error: '', success:`${data.message}`, reload: true, loading: false});
                    router.push(`/articles/${data.result.slug}`)
                }
            });
        }).catch((error) => {
            setValues({ ...values, error: error, success: false });
        });
    }

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
        <div className="content-wrapper">
            { errorMsg && errorMsgComponent() }  
            <div className="editor-wrapper">
                <h5 className="mt-5 text-grey"><i className="fas fa-user-circle mr-2"></i>{username}</h5>
                <div className="input-group">
                    <input type="text" className="form-control border-0 px-0 shadow-0 title" placeholder="标题"
                    value={title} onChange={ handleChangeTitle }/>
                </div>
            </div>
            <div id="editorjs"></div>
            <div className="editor-wrapper">
                {prePublishModal()}
            </div>
        </div>
    )
}

export default CreateBlog;