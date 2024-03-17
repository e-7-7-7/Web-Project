import User from './user.js';

export default class Customer extends User{
    #id;
    static class_id = 0;
    #name;
    #surName;
    #balance = 0;
    static usernames =[]

    constructor(username,password,name,surName){
        super(username,password);
        Customer.usernames.push(username);
        this.setName(name);
        this.setSurName(surName);
        this.#id = ++Customer.class_id
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

    setUsername(username){
        super.setUsername(username);
    }


}