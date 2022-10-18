import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function EditSongModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.listMarkedForDeletion != null) {
        name = store.listMarkedForDeletion.name;
    }

    function handleConfirmEditSong(event) {
        store.editSong();
        store.hideEditSongModal();
    }

    function handleCancelEditSong(event) {
        store.hideEditSongModal();

    }


    return (
        <div
                id="edit-song-modal"
                className="modal"
                data-animation="slideInOutLeft">
                <div className="modal-dialog" id='verify-delete-list-root'>
                    <header className="dialog-header">
                    Edit Song
                    </header>
                    <div id="confirm-cancel-container">
                        <div>
                            <div id="title-prompt" class="modal-prompt">Title:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="edit-song-modal-title-textfield" class='modal-textfield' type="text" /></div>
                            <div id="artist-prompt" class="modal-prompt">Artist:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input id="edit-song-modal-artist-textfield" class='modal-textfield' type="text" /></div>
                            <div id="you-tube-id-prompt" class="modal-prompt">YouTube Id: <input id="edit-song-modal-youTubeId-textfield" class='modal-textfield' type="text" /></div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <input type="button" id="edit-song-confirm-button" className="close-modal-button" onClick={handleConfirmEditSong} value='Confirm' />
                        <input type="button" id="edit-song-cancel-button" className="close-modal-button" onClick={handleCancelEditSong} value='Cancel' />
                    </div>
                </div>
            </div>
    );
}

export default EditSongModal;










