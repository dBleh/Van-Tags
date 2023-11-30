import React, { useState, useRef, useEffect } from "react";
import { getSearch } from '../features/authSlice'
import { useDispatch, useSelector } from 'react-redux';

function Search(props) {
    const [lights, setLights] = useState([])
    const { received_items } = useSelector(state => state.auth);
    const inputRef = useRef(null);
    const dispatch = useDispatch()
    //Called on input change
    const onChange = (e) => {
        //Sets the item code for the light to be returned in the tag pdf
        props.onChangeAdd(e.target.value);
        //Gets 10 closest matches to search input
        dispatch(getSearch({ data: e.target.value }))
        received_items.forEach((el) => {
            const keys = Object.keys(el);
            setLights(keys)
        })
    }
    //Called when user selects a returned item
    const onAdd = (item) => {
        const inputEl = inputRef.current;
        inputEl.value = item.toUpperCase().slice(0, -4)
        setLights([]);
        props.onItemAdd(item);
    }
    //Handles search bar focus
    useEffect(() => {
        const handleBlur = () => {
            setLights([]);
        }
        const inputRefCurrent = inputRef.current;
        if (inputRefCurrent) {
            inputRefCurrent.addEventListener('blur', handleBlur);
            return () => {
                inputRefCurrent.removeEventListener('blur', handleBlur);
            }
        }
    }, []);
    return (
        <>
            <div className="searchBox">
                <form>
                    <div className='searchLabel'>Search</div>
                    <input className="searchBoxInput" onChange={onChange} ref={inputRef}></input>
                </form>
                {lights.map((item, index) => (
                    <li key={item}>
                        <button onMouseDown={() => onAdd(item)}>{item.toUpperCase().slice(0, -4)}</button>
                    </li>
                ))}
            </div>
        </>
    )
} export default Search;