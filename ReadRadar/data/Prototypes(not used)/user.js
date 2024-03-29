

export default class User{
    #username;
    #password;

    constructor(u,p){
        this.#username = u;
        this.#password = p;
    }

    getUsername(){
        return this.#username;
    }

    getPassword(){
        return this.#password;
    }

    setUsername(username){
        this.#username= username;
    }

    setPassword(password){
        this.#password = password;
    }

}











