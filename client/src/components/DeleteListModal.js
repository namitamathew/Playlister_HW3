import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function DeleteListModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.listMarkedForDeletion != null) {
        name = store.listMarkedForDeletion.name;
    }

    function handleConfirmDeleteList(event) {
        store.deleteList();
        store.hideDeleteListModal();
        store.loadIdNamePairs();
    }

    function handleCancelDeleteList(event) {
        store.hideDeleteListModal();

    }

    return (
        <div
                id="delete-list-modal"
                className="modal"
                data-animation="slideInOutLeft">
                <div className="modal-dialog" id='verify-delete-list-root'>
                    <header className="dialog-header">
                    Delete the {name} playlist?
                    </header>
                    <div id="confirm-cancel-container">
                        <div>
                            Are you sure you wish to permanently delete the {name} playlist?
                        </div>
                    </div>
                    <div className="modal-footer">
                        <input type="button" id="remove-song-confirm-button" className="close-modal-button" onClick={handleConfirmDeleteList} value='Confirm' />
                        <input type="button" id="remove-song-cancel-button" className="close-modal-button" onClick={handleCancelDeleteList} value='Cancel' />
                    </div>
                </div>
            </div>
    );
}

export default DeleteListModal;










