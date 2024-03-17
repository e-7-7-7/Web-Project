import User from './user.js';

export default class Customer extends user{
    #id;
    #name;
    #surName;
    #balance = 0;

    constructor(username,password,name,surName){

    }

    getID(){
        return this.#id;
    }

    getName(){
        return this.#name;
    }

    getSurName(){
        return this.#surName;
    }

    getBalance(){
        return this.#balance;
    }

    setName(name){
        this.#name = name;
    }

    setSurName(name){
        this.#surName = name;
    }

    setBalance(balance){
        this.#balance = balance;
    }

    getUsername(){
        return super.getUsername();
    }

    getPassword(){
        return super.getPassword();
    }

}