import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    SET_SONG_EDIT_ACTIVE: "SET_SONG_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION"
}


// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        songEditActive: -1,
        songDeleteActive: -1,
        listMarkedForDeletion: null
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songEditActive: -1,
                    songDeleteActive: -1,
                    listMarkedForDeletion: null
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songEditActive: -1, 
                    songDeleteActive: -1,
                    listMarkedForDeletion: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    songEditActive: -1,
                    songDeleteActive: -1,
                    listMarkedForDeletion: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songEditActive: -1,
                    songDeleteActive: -1,
                    listMarkedForDeletion: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songEditActive: -1,
                    songDeleteActive: -1,
                    listMarkedForDeletion: payload._id
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songEditActive: -1,
                    songDeleteActive: -1,
                    listMarkedForDeletion: null
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    songEditActive: -1,
                    songDeleteActive: -1,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.SET_SONG_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    songEditActive: payload,
                    songDeleteActive: -1,
                    listMarkedForDeletion: null
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }


    store.createNewList = function () {
        async function asyncCreateNewList() {
            //let index = store.getPlaylistSize();
            let body = {"name": "Untitled", "songs": []}
            let response = await api.createNewList(body);
            if (response.data.success) {
                let playlist = response.data.playlist;
                async function getListPairs(playlist) {
                    response = await api.getPlaylistPairs();
                    console.log(response.data.success);
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        console.log(pairsArray);
                        storeReducer({
                            type: GlobalStoreActionType.CREATE_NEW_LIST,
                            payload: {
                                idNamePairs: pairsArray,
                                playlist: playlist
                            }
                        });
                    }
                }
                getListPairs(playlist);
                store.setCurrentList(playlist._id);
            }
        }
        asyncCreateNewList();
    }

    store.deleteList = function () {
        async function deleteList() {
            let listToDelete = store.listMarkedForDeletion;
            console.log(listToDelete);
            console.log(listToDelete.substring(12, listToDelete.toString().length));
            let response = await api.deletePlaylistById(listToDelete.substring(12, listToDelete.toString().length));
            if (response.data.success) {
                let playlist = response.data.playlist;
                console.log(playlist, 'list deleted')
            }
        }
        deleteList()
        store.loadIdNamePairs();
    }


    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            console.log(id);
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    console.log('success')
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.refreshCurrentList = function (id) {
        async function asyncChangeListSongs(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.songs = store.currentList.songs;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListSongs(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.markListForDeletion = function (id) {
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: id
        })
        this.showDeleteListModal();
        
    }

    store.markSongForEditing = function (id) {
        console.log(store.currentList);
        console.log(id);
        storeReducer({
            type: GlobalStoreActionType.SET_SONG_EDIT_ACTIVE,
            payload: id
        })
        console.log(store.currentList);

        this.showEditSongModal();
        console.log(store.currentList);
        
    }

    store.showDeleteListModal = function (id) {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
    }

    // THIS FUNCTION IS FOR HIDING THE MODAL
    store.hideDeleteListModal = function () {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");

        store.loadIdNamePairs();
    }

    store.addSong = function () {
        async function asyncCreateNewSong() {
            //let index = store.getPlaylistSize();
            let response = await api.getPlaylistById(store.currentList._id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                let newSong = {"title": "Untitled", "artist": "Unknown", "youTubeId": "dQw4w9WgXcQ"};
                playlist.songs.push(newSong);
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncCreateNewSong();
    }

    store.moveSong = function (start, end) {
        if (start < end) {
            let t = store.currentList.songs[start];
            for (let i = start; i < end; i++) {
                store.currentList.songs[i] = store.currentList.songs[i + 1];
            }
            store.currentList.songs[end] = t;
        }
        else if (start > end) {
            let t = store.currentList.songs[start];
            for (let i = start; i > end; i--) {
                store.currentList.songs[i] = store.currentList.songs[i - 1];
            }
            store.currentList.songs[end] = t;
        }


        store.refreshCurrentList(store.currentList._id);
        
    }

    store.showEditSongModal = function(id) {
        console.log(id);
        document.getElementById("edit-song-modal-title-textfield").value = store.currentList.songs[id].title;
        document.getElementById("edit-song-modal-artist-textfield").value = store.currentList.songs[id].artist;
        document.getElementById("edit-song-modal-youTubeId-textfield").value = store.currentList.songs[id].youTubeId;
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
        store.songEditActive = id


    }
    store.hideEditSongModal = function() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }

    store.showDeleteSongModal = function(id) {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");
        store.songDeleteActive = id;

    }
    store.hideDeleteSongModal = function() {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
    }

    store.deleteSong = function(id) {
        console.log(store.songEditActive);
        store.currentList.songs.splice(store.songDeleteActive, 1);
        console.log(store.currentList.songs)
        store.refreshCurrentList(store.currentList._id);
    }

    store.editSong = function(id) {
        let songToEdit = store.songEditActive;
        //console.log(songToEdit.toString().substring(0,6));
        let songTitle = document.getElementById("edit-song-modal-title-textfield").value;
        let songArtist = document.getElementById("edit-song-modal-artist-textfield").value;
        let songYTiD = document.getElementById("edit-song-modal-youTubeId-textfield").value;
        store.currentList.songs[songToEdit].artist = songArtist;
        store.currentList.songs[songToEdit].title = songTitle;
        store.currentList.songs[songToEdit].youTubeId = songYTiD;
        store.refreshCurrentList(store.currentList._id);
    }


    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}
