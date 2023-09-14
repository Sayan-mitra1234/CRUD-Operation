import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";

function Todo(){
    const[itemText,setItemText]=useState('');
    const [listItems,setListItems]=useState([])
    const [isUpdating,setIsUpdating]=useState('')
    const[updateItemText, setUpdateItemText]=useState('')

    const addItem=async(e)=>{
        e.preventDefault();
        try{
            const res=await axios.post('http://localhost:5000/api/item',{item: itemText})
            setListItems(prev=>[...prev,res.data])
            setItemText('')
        }catch(err){
            console.log(err)
        }
    }
    useEffect(()=>{
        const getItemsList=async ()=>{
            try{
                const res=await axios.get('http://localhost:5000/api/items')
                setListItems(res.data)

            }catch(err){
                console.log(err)
            }
        }
        getItemsList()
    },[]);

    const deleteItem=async(id)=>{
        try{
            const res=await axios.delete(`http://localhost:5000/api/item/${id}`)
            const newListItems=listItems.filter(item=>item._id !==id)
            setListItems(newListItems)
        }catch(err){
            console.log(err)
        }
    }

    const updateItem=async(e)=>{
        e.preventDefault()
        try{
            const res=await axios.put(`http://localhost:5000/api/item/${isUpdating}`,{item: updateItemText})
            const updatedItemIndex=listItems.findIndex(item=>item._id === isUpdating)
            const updatedItem=listItems[updatedItemIndex].item =updateItemText;
            setUpdateItemText('');
            setIsUpdating('');
        }catch(err){
            console.log(err)
        }
    }
    const renderUpdateForm =()=>(
        <form onSubmit={(e)=>{updateItem(e)}}>
            <input type="text" placeholder="new item" onChange={e=>{setUpdateItemText(e.target.value)}} value={updateItemText}/>
            <button type="submit">Update</button>
        </form>
    )
    return(
        <div>
            <h1>CRUD OPERATION</h1>
            <form onSubmit={e=> addItem(e)}>
                <input type="text" placeholder="add item" onChange={e=>{setItemText(e.target.value)}} value={itemText}/>
                <button type="submit">Add</button>


            </form>

            <div>
                {
                    listItems.map(item=>(
                        <div>
                            {
                                isUpdating ===item._id
                                ? renderUpdateForm()
                                : <>
                                <h1>{item.item}</h1>
                                <button onClick={()=>{setIsUpdating(item._id)}}>update</button>
                                <button onClick={()=>{deleteItem(item._id)}}>delete</button>
                                </>
                            }
                         </div>   
                    ))
                }
            </div>
        </div>
    )
}

export default Todo;