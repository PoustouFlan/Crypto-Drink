// category/list.tsx
import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {fetchCategories} from '../api';
import {encodeURIComponent} from "../Utils.tsx";

const CategoryList: React.FC = () => {
    const {scoreboardName} = useParams();
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesData = await fetchCategories();
                setCategories(categoriesData);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="category-list-container">
            <h1>Categories</h1>
            <ul>
                {categories.map((category, index) => (
                    <li key={index}>
                        <Link to={scoreboardName == null ? `/category/${encodeURIComponent(category)}`
                            : `/scoreboard/${scoreboardName}/category/${encodeURIComponent(category)}`}>{category}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;