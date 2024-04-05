/* eslint react-hooks/exhaustive-deps: "off" */
import React from "react";
import { Modal, Button } from "react-bootstrap";

// The modal needs to be given both a value and a setter - you should use useState on the parent to generate these.
// onClose is a function that should be called once the user selects an option.
interface ConfirmationModalProps {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: (value: boolean) => void; // new prop
}

function ConfirmationModal(props: ConfirmationModalProps) {

const { show, setShow, onClose } = props;

    // Run when either yes or no is clicked.
    const handleClose = (selection: boolean) => {
        setShow(false);
        onClose(selection); // call onClose with the value clicked on
    };

    return (
        <>
            <Modal variant="dark" show={show} onHide={() => handleClose(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to permanently remove all checked items from the shopping list?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose(false)}>
                        No
                    </Button>
                    <Button variant="primary" onClick={() => handleClose(true)}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ConfirmationModal;