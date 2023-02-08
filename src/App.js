/** @format */

import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
    const list = localStorage.getItem("list");
    if (list) {
        return JSON.parse(list);
    } else {
        return [];
    }
};

function App() {
    const [name, setName] = useState("");
    const [list, setList] = useState(getLocalStorage());
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [alert, setAlert] = useState({
        show: false,
        msg: "",
        type: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) {
            // display alert
            showAlert(true, "danger", "Please enter value");
        } else if (name && isEditing) {
            // deal with edit
            setList(
                list.map((item) => {
                    if (item.id === editId) {
                        return { ...item, title: name };
                    }
                    return item;
                })
            );
            setName("");
            setEditId(null);
            setIsEditing(false);
            showAlert(true, "success", "Item edited");
        } else {
            // add item to the list
            showAlert(true, "success", "Item Added To The List");
            const newItem = {
                id: new Date().getTime().toString(),
                title: name,
            };
            setList([...list, newItem]);
            setName("");
        }
    };

    const showAlert = (show = false, type = "", msg = "") => {
        msg = msg.toUpperCase();
        setAlert({ show, type, msg });
    };

    const clearList = () => {
        showAlert(true, "danger", "List is empty");
        setList([]);
    };

    const removeItem = (id) => {
        showAlert(true, "danger", "Item removed");
        setList(
            list.filter((item) => {
                return item.id !== id;
            })
        );
    };

    const editItem = (id) => {
        const specificItem = list.find((item) => item.id === id);
        setIsEditing(true);
        setEditId(id);
        setName(specificItem.title);
    };

    useEffect(() => {
        localStorage.setItem("list", JSON.stringify(list));
    }, [list]);

    return (
        <section className='section-center'>
            <form className='grocery-form' onSubmit={handleSubmit}>
                {alert.show && (
                    <Alert list={list} {...alert} removeAlert={showAlert} />
                )}
                <h3>Grocery Bud</h3>
                <div className='form-control'>
                    <input
                        type='text'
                        className='grocery'
                        placeholder='e.g. eggs'
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                    <button type='submit' className='submit-btn'>
                        {isEditing ? "edit" : "submit"}
                    </button>
                </div>
            </form>

            {list.length > 0 && (
                <div className='grocery-container'>
                    <List
                        editItem={editItem}
                        removeItem={removeItem}
                        items={list}></List>
                    <button onClick={clearList} className='clear-btn'>
                        Clear Items
                    </button>
                </div>
            )}
        </section>
    );
}

export default App;
