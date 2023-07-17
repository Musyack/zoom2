import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setCategory} from "../actions/productActions";

const Categories = ({categoryList}) => {
    const dispatch = useDispatch()
    const [active, setActive] = useState(1000)
    const onCategory = (name, i) => {
        dispatch(setCategory(name))
        setActive(i)
    }

    console.log(categoryList)
    return (
        <div style={{marginTop: '10%'}} className={'param'}>
            <div className={'values'}>
                {categoryList.categories.map((item, i )=> {

                    return (

                                <a  onClick={() => onCategory(item.name, i)}
                                   className={i === active ? 'selected' : ''}> {item.name} </a>

                    )
                })}

            </div>
        </div>


    );
};

export default Categories;