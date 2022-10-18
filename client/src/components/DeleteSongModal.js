import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function DeleteSongModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.listMarkedForDeletion != null) {
        name = store.listMarkedForDeletion.name;
    }

    function handleConfirmDeleteSong(event) {
        store.deleteSong();
        store.hideDeleteSongModal();
    }

    function handleCancelDeleteSong(event) {
        store.hideDeleteSongModal();

    }


    return (
        <div
                id="delete-song-modal"
                className="modal"
                data-animation="slideInOutLeft">
                <div className="modal-dialog" id='verify-delete-song-root'>
                    <header className="dialog-header">
                    Remove Song?
                    </header>
                    <div id="confirm-cancel-container">
                        <div>
                        Are you sure you wish to permanently remove <strong>{name}</strong> from the playlist?
                        </div>
                    </div>
                    <div className="modal-footer">
                        <input type="button" id="delete-song-confirm-button" className="close-modal-button" onClick={handleConfirmDeleteSong} value='Confirm' />
                        <input type="button" id="delete-song-cancel-button" className="close-modal-button" onClick={handleCancelDeleteSong} value='Cancel' />
                    </div>
                </div>
            </div>
    );
}

export default DeleteSongModal;