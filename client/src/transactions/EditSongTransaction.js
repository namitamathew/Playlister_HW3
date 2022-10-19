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
export default class EditSongTransaction extends jsTPS_Transaction {
    constructor(initStore, songIndex, osongTitle, osongArtist, osongYtID, nsongTitle, nsongArtist, nsongYtID) {
        super();
        this.store = initStore;
        this.index = songIndex;
        this.oldTitle = osongTitle;
        this.oldArtist = osongArtist;
        this.oldYTiD = osongYtID;
        this.newTitle = nsongTitle;
        this.newArtist = nsongArtist;
        this.newYTiD = nsongYtID;
    }

    doTransaction() {
        this.store.editSongT(this.index, this.newTitle, this.newArtist, this.newYTiD);
    }
    
    undoTransaction() {
        this.store.editSongT(this.index, this.oldTitle, this.oldArtist, this.oldYTiD);
    }
}