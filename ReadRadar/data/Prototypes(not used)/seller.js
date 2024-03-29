import User from './user.js';

export default class Seller extends User{
    #id;
    static class_id = 0;
    #account_Balance = 0;
    static usernames = [];
    #onsale_items=[];
    #sold_items=[];

    constructor(username,password){
        super(username,password)
        Seller.usernames.push(username);
        this.#id = ++Seller.class_id;
        }

    getID(){
        return this.#id;
    }

    setBalance(b){
        this.#account_Balance = b;
    }

    getBalance(){
        return this.#account_Balance;
    }

    addBook(book){
        this.#onsale_items.push(book);
    }

    removeBook(bookid){
        const index = this.#onsale_items.findIndex(b => b.getID() == bookid )
        if(index>=0){
            this.#onsale_items.splice(index,1);
        }
        
    }

    moveBookToSold(bookid){
        const index = this.#onsale_items.findIndex(b => b.getID() == bookid )
        const book = this.#onsale_items[index];
        this.#onsale_items.splice(index,1);
        this.#sold_items.push(book);
    }


        

    

}