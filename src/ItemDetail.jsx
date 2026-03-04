import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function ItemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const itemNameRef = useRef();
    const itemCategoryRef = useRef();
    const itemPriceRef = useRef();

    async function loadItem() {
        const uri = `http://localhost:3000/api/item/${id}`;
        console.log("==> uri: ", uri);
        const result = await fetch(uri);
        const data = await result.json();
        console.log("==> data :", data);
        itemNameRef.current.value = data.itemName;
        itemCategoryRef.current.value = data.itemCategory;
        itemPriceRef.current.value = data.itemPrice;
    }

    async function onUpdate() {
        const body = {
            name: itemNameRef.current.value,
            category: itemCategoryRef.current.value,
            price: itemPriceRef.current.value
        };
        const uri = `http://localhost:3000/api/item/${id}`;
        console.log("==> uri: ", uri);
        const result = await fetch(uri, {
            method: "PATCH",
            body: JSON.stringify(body)
        });
        if (result.status == 200) {
            loadItem();
            alert("Item updated successfully");
        }
    }

    async function onDelete() {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }

        try {
            const uri = `http://localhost:3000/api/item/${id}`;
            const result = await fetch(uri, {
                method: "DELETE"
            });

            if (result.ok) {
                alert("Item deleted successfully");
                navigate("/");
            } else {
                alert("Failed to delete item");
            }
        } catch (err) {
            console.log("==> err : ", err);
            alert("Error deleting item");
        }
    }

    useEffect(() => {
        loadItem();
    }, []);

    return (
        <div>
            <h1>Edit Item</h1>
            <table>
                <tbody>
                    <tr>
                        <th style={{ textAlign: "left" }}>Name</th>
                        <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                            <input type="text" ref={itemNameRef} />
                        </td>
                    </tr>
                    <tr>
                        <th style={{ textAlign: "left" }}>Category</th>
                        <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                            <select ref={itemCategoryRef}>
                                <option>Stationary</option>
                                <option>Kitchenware</option>
                                <option>Appliance</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ textAlign: "left" }}>Price</th>
                        <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                            <input type="text" ref={itemPriceRef} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr />
            <button onClick={onUpdate}>Update</button>
            <button onClick={onDelete} style={{ marginLeft: "10px" }}>Delete</button>
            <button onClick={() => navigate("/")} style={{ marginLeft: "10px" }}>
                Back to List
            </button>
        </div>
    );
}