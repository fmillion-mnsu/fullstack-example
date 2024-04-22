/* eslint react-hooks/exhaustive-deps: "off" */

import { useEffect, useState } from "react";
import { Button, Container, Form, Table } from "react-bootstrap";
import { Bounce, toast } from 'react-toastify';

import api from "../api";
import { ShopListItem } from "../types";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ConfirmationModal from "./ConfirmationModal";

function ShoppingList() {

    const [shopList, setShopList] = useState<ShopListItem[]>([]); // stores data from the API
    const [showNewItemLine, setShowNewItemLine] = useState<boolean>(false); // true to show line for entry of new item
    const [apiInFlight, setApiInFlight] = useState<boolean>(false); // true while API request is underway

    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false); // true to show modal dialog for confirmation

    // **************** Toast convenience functions ****************

    const errorToast = (message: string, error: any) => {
        toast.error(message + " See Dev Tools for details.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "colored",
            transition: Bounce
        });
        console.dir(error);
    }
    const successToast = (message: string) => {
        toast.success(message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "colored",
            transition: Bounce
        });
    }

    // **************** API interaction functions ****************

    const updateList = () => {
        // Fetch the shopping list from the server
        setApiInFlight(true);
        api.get<ShopListItem[]>('items')
            .then(response => {
                setShopList(response.data);
            })
            .catch(error => {
                errorToast("Could not reach the API to get the shopping list!", error);
            })
            .finally(() => {
                setApiInFlight(false);
            });
    };

    const clearItems = (confirm: boolean) => {
        // Remove items that are checked
        if (confirm) {
            setApiInFlight(true);
            api.delete('items')
                .then(response => {
                    updateList();
                    successToast(response.data + " items cleared!");
                })
                .catch(error => {
                    errorToast("Could not reach the API to clear purchased items!", error);
                })
                .finally(() => {
                    setApiInFlight(false);
                });
        }
    }

    const addNewItem = (item: string) => {
        // Add new shopping list item
        setApiInFlight(true);
        api.put('item', {item: item})
            .then(response => {
                updateList();
                setShowNewItemLine(false);
            })
            .catch(error => {
                errorToast("Could not reach the API to add a new item!", error);
            })
            .finally(() => {
                setApiInFlight(false);
            });
    }

    const toggleItem = (id: number) => {
        // Toggle checkbox on an item
        if (!apiInFlight) {
            setApiInFlight(true);
            api.post('item/' + id)
                .then(response => {
                    updateList();
                })
                .catch(error => {
                    errorToast("Could not reach the API to toggle an item!", error);
                })
                .finally(() => {
                    setApiInFlight(false);
                });
        }
    }

    // This will force the input focus to the new item box whenever the new item line is shown.
    useEffect(() => {
        if (showNewItemLine) {
            const newItemInput = document.getElementById("newItem");
            if (newItemInput) {
                newItemInput.focus();
            }
        }
    }, [showNewItemLine]); // This effect runs whenever `showNewItemLine` changes

    // Gets the list from the API on page load.
    useEffect(() => {
        updateList();
    }, []);

    // Allows the user to press Enter to submit the new item, or Escape to cancel it.
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            const tgt = event.target as HTMLInputElement;
            const newItemValue = tgt.value;
            tgt.value="";
            addNewItem(newItemValue);
            return;
        }
        if (event.key === "Escape") {
            setShowNewItemLine(false);
        }
    };

    return (
        <>
            <Container>
                <div style={{textAlign: "right", paddingBottom: "1em"}}>
                    {apiInFlight && <><span>Waiting for API...</span> <span><i className="fa-solid fa-hourglass" /></span><span style={{display: "inline-block", width: "3em"}}></span></>}&nbsp;
                    <Button disabled={apiInFlight} variant="danger" onClick={() => setShowConfirmModal(true)}><i aria-hidden="true" className="fa-solid fa-trash" /> Clear Purchased Items</Button>&nbsp;
                    <Button disabled={showNewItemLine || apiInFlight} variant="success" onClick={() => setShowNewItemLine(true)}><i aria-hidden="true" className="fa-regular fa-plus" /> Add New Item</Button>
                </div>
                <Table variant="dark" striped>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th style={{width: "15em"}}>Purchased</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shopList.map((item, index) => (
                            <tr key={item.id}>
                                <td>{item.item}</td>
                                <td onClick={() => toggleItem(item.id)} className="bigger-icon">{item.checked ? <><span className="sr-only">{item.item} checked</span><i aria-hidden="true" className="fa-regular fa-square-check" /></> : <><span className="sr-only">{item.item} not checked</span><i aria-hidden="true" className="fa-regular fa-square" /></>}</td>
                            </tr>
                        ))}
                        {showNewItemLine && (
                            <tr>
                                <td>
                                    <Form.Control id="newItem" disabled={apiInFlight} type="text" placeholder="Enter Item Name. Press Esc to cancel." onKeyDown={handleKeyPress} />
                                </td>
                                <td>
                                <Button variant="danger" onClick={() => setShowNewItemLine(false)}>Cancel</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Container>
            
            <ConfirmationModal show={showConfirmModal} setShow={setShowConfirmModal} onClose={clearItems} />
        </>
    )
}

export default ShoppingList;