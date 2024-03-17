
import User from './user.js';

export default class Admin extends User{
    static usernames=[]

    constructor(u,p){
        super(u,p);
        Admin.usernames.push(u);
    }


}



