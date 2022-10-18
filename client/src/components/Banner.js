import EditToolbar from "./EditToolbar";
import EditSongModal from "./EditSongModal";
import DeleteSongModal from "./DeleteSongModal";
/*
    Our Application's Banner, note we are using function-style
    React. Our banner just has a left-aligned heading and a
    right-aligned toolbar for undo/redo and close list buttons.
    
    @author McKilla Gorilla
*/
function Banner(props) {
    return (        
        <div id="playlister-banner">
            Playlister
            <EditToolbar />
            <EditSongModal/>
            <DeleteSongModal/>
        </div>
    );
}

export default Banner;