import User from './user.js';

export default class Seller extends User{
    #id;
    static class_id = 0;
    #account_Balance = 0;
    static usernames = [];
    constructor(username,password){
        super(username,password)
        this.usernames.push(username);
        this.#id = ++this.class_id;
        }

    getUsername(){
        return super.getUsername();
    }

    getPassword(){
        return super.getPassword();
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
        

    

}