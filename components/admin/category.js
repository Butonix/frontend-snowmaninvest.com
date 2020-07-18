import { useState, useEffect } from 'react';
import { getCookie } from '../../actions/auth';
import { create, getCategories, removeCategory } from '../../actions/category';


const AdminCategory = () => {
    const [values, setValues] = useState({
        name: '',
        error: false,
        success: false,
        categories: [],
        removed: false,
        reload: false
    });

    const { name, error, success, categories, removed, reload } = values;
    const token = getCookie('token');

    useEffect(() => {
        loadCategories();
    }, [reload]);

    const loadCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setValues({ ...values, categories: data });
            }
        });
    };

    const showCategories = () => {
        return categories.map((c, i) => {
            return (
                <button
                    onDoubleClick={() => deleteConfirm(c.slug)}
                    title="双击删除"
                    key={i}
                    className="btn btn-outline-primary mr-1 ml-1 mt-3"
                >
                    {c.name}
                </button>
            );
        });
    };

    const deleteConfirm = slug => {
        let answer = window.confirm('Are you sure you want to delete this category?');
        if (answer) {
            deleteCategory(slug);
        }
    };

    const deleteCategory = slug => {
        
        removeCategory(slug, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setValues({ ...values, error: false, success: false, name: '', removed: !removed, reload: !reload });
            }
        });
    };

    const clickSubmit = e => {
        e.preventDefault();
        create({ name }, token).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, success: false });
            } else {
                setValues({ ...values, error: false, success: true, name: '', removed: false, reload:true });
            }
        });
    };

    const handleChange = e => {
        setValues({ ...values, name: e.target.value, error: false, success: false, removed: '', reload: false });
    };

    const showSuccess = () => {
        if (success) {
            return <p className="text-success">分类已创建</p>;
        }
    };

    const showError = () => {
        if (error) {
            return <p className="text-danger">此分类已经存在</p>;
        }
    };

    const showRemoved = () => {
        if (removed) {
            return <p className="text-danger">分类已成功删除</p>;
        }
    };

    const mouseMoveHandler = e => {
        setValues({ ...values, error: false, success: false, removed: '' });
    };

    const newCategoryFom = () => (
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">分类名称</label>
                <input type="text" className="form-control" onChange={handleChange} value={name} placeholder="请输入分类名称" required />
            </div>
            <div>
                <button type="submit" className="btn-snowblue">
                    创建新分类
                </button>
            </div>
        </form>
    );

    return (
        <React.Fragment>
            {showSuccess()}
            {showError()}
            {showRemoved()}
            <div onMouseMove={mouseMoveHandler}>
                {newCategoryFom()}
                {showCategories()}
            </div>
        </React.Fragment>
    );
};

export default AdminCategory;
