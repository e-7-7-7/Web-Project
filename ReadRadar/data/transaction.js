
export default class Transaction{
    #id;
    static class_id = 0;
    #books=[];
    #seller_id;
    #customer_id;
    #amount;

    constructor(seller,customer,book_arry){
        this.setSeller(seller);
        this.setCustomer(customer);
        this.setBooks(book_arry);
        this.setAmount();
        this.#id = ++this.class_id;
    }

    setSeller(seller_id){
        this.#seller_id = seller_id;
    }

    setCustomer(c){
        this.#customer_id = c;
    }

    setAmount(){
        this.#amount= this.#books.reduce((acc,curr) => acc+curr.getPrice(),0)
    }

    getCustomer(){
        return this.#customer_id;
    }

    getSeller(){
        return this.#seller_id; 
    }

    getAmount(){
        return this.#amount;
    }

    getID(){
        return this.#id;
    }





} 











