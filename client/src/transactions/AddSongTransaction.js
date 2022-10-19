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
export default class AddSongTransaction extends jsTPS_Transaction {
    constructor(initStore, size) {
        super();
        this.store = initStore
        this.playlstSize = size;
    }

    doTransaction() {
        this.store.addSong();
    }
    
    undoTransaction() {
        this.store.addSongUndo(this.playlstSize);
    }
}