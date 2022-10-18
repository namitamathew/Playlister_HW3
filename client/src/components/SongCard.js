import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [draggedTo, setDraggedTo] = useState(0);

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";

    function handleDragStart(event) {
        event.dataTransfer.setData("item", event.target.id);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("item");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        setDraggedTo(false);
        console.log(parseInt(sourceId.substring(0,1)));
        console.log(targetId);
        store.moveSong(parseInt(sourceId.substring(0,1)), parseInt(targetId.substring(0,1)));
    }

    function handleEdit(event) {
        let _id = event.target;
        console.log(index);
        editSong(index);
    }

    function editSong(_id) {
        store.showEditSongModal(_id);
        //store.editSong(_id);
    }

    function handleDelete(event) {
        let _id = event.target;
        console.log(index);
        deleteSong(index);
    }

    function deleteSong(_id) {
        store.showDeleteSongModal(_id);
        //store.editSong(_id);
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDoubleClick={handleEdit}
            draggable="true"
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                onClick={handleDelete}
                value={"\u2715"}
            />
        </div>
    );
}

export default SongCard;