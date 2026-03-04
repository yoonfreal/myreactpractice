import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

export function Items() {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemNameRef = useRef();
    const itemCategoryRef = useRef();
    const itemPriceRef = useRef();

    async function loadItems() {
        try {
            const response = await fetch("http://localhost:3000/api/item");
            const data = await response.json();
            console.log("==> data : ", data);
            setItems(data);
        } catch (err) {
            console.log("==> err : ", err);
            alert("Loading items failed");
        }
    }

    async function onItemSave() {
        const uri = "http://localhost:3000/api/item";
        const body = {
            name: itemNameRef.current.value,
            category: itemCategoryRef.current.value,
            price: itemPriceRef.current.value
        };
        const result = await fetch(uri, {
            method: "POST",
            body: JSON.stringify(body)
        });
        const data = await result.json();
        console.log("==> data: ", data);

        // Clear form
        itemNameRef.current.value = "";
        itemCategoryRef.current.value = "Stationary";
        itemPriceRef.current.value = "";

        loadItems();
    }

    async function onDeleteItem(id, name) {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            const uri = `http://localhost:3000/api/item/${id}`;
            const result = await fetch(uri, {
                method: "DELETE"
            });

            if (result.ok) {
                loadItems();
                alert("Item deleted successfully");
            } else {
                alert("Failed to delete item");
            }
        } catch (err) {
            console.log("==> err : ", err);
            alert("Error deleting item");
        }
    }

    useEffect(() => {
        console.log("==> Init...");
        loadItems();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = items.slice(startIndex, endIndex);

    function goToPage(page) {
        setCurrentPage(page);
    }

    return (
        <>
            <h1>Item Management</h1>
            <p>Total Items: {items.length} | Page {currentPage} of {totalPages}</p>

            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{item._id}</td>
                                <td>{item.itemName}</td>
                                <td>{item.itemCategory}</td>
                                <td>THB {item.itemPrice}</td>
                                <td>
                                    <Link to={`/items/${item._id}`}>Edit</Link>
                                    {" | "}
                                    <button onClick={() => onDeleteItem(item._id, item.itemName)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    <tr>
                        <td> - </td>
                        <td><input type="text" ref={itemNameRef} /></td>
                        <td>
                            <select ref={itemCategoryRef}>
                                <option>Stationary</option>
                                <option>Kitchenware</option>
                                <option>Appliance</option>
                            </select>
                        </td>
                        <td><input type="text" ref={itemPriceRef} /></td>
                        <td><button onClick={onItemSave}>Add Item</button></td>
                    </tr>
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ marginRight: '10px' }}
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        style={{
                            margin: '0 5px',
                            fontWeight: page === currentPage ? 'bold' : 'normal',
                            backgroundColor: page === currentPage ? '#007bff' : '#f0f0f0',
                            color: page === currentPage ? 'white' : 'black',
                            border: '1px solid #ddd',
                            padding: '5px 10px',
                            cursor: 'pointer'
                        }}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ marginLeft: '10px' }}
                >
                    Next
                </button>
            </div>
        </>
    );
}