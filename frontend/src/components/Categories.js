import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setCategory} from "../actions/productActions";

const Categories = ({categoryList}) => {
    const dispatch = useDispatch()

    console.log(categoryList)
    return (
        <nav aria-label="Breadcrumb" style={{margin: '20px 20px 20px 20px'}} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 pt-1">
            <ol role="list"
                className="px-2 pt-2 sm:pt-0 sm:pb-2 flex whitespace-nowrap items-center space-x-3 overflow-x-auto rounded-3xl max-w-max">
                <p onClick={() => dispatch(setCategory('all'))} className="text-sm font-medium text-gray-50 px-4 py-1.5 bg-black rounded-full mr-2">Categories</p>
                {categoryList.categories.map(item => {

                    return (
                        <li className="text-sm">
                            <div className="flex items-center">
                                <a onClick={() => dispatch(setCategory(item.name))}
                                   className="font-medium text-gray-600 hover:text-gray-800"> {item.name} </a>
                            </div>
                        </li>
                    )
                })}

            </ol>
        </nav>
    );
};

export default Categories;