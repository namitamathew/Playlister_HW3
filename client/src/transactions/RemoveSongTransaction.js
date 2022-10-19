import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * MoveSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class RemoveSongTransaction extends jsTPS_Transaction {
    constructor(initStore, songIndex, osongTitle, osongArtist, osongYtID) {
        super();
        this.store = initStore;
        this.index = songIndex;
        this.oldTitle = osongTitle;
        this.oldArtist = osongArtist;
        this.oldYTiD = osongYtID;
    }

    doTransaction() {
        this.store.deleteSong();
    }
    
    undoTransaction() {
        this.store.undoDeleteSong(this.index, this.oldTitle, this.oldArtist, this.oldYTiD);
    }
}