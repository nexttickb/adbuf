class Store
{
    set(k,v){  
        if( v === undefined ) {
			return this.remove(k);
		};  
        localStorage.setItem(k,JSON.stringify(v));    
    }  
    getLength(){
		return localStorage.length;  
	}
    key(i){  
        return localStorage.key(i);  
    }
    get(k){  
        return JSON.parse(localStorage.getItem(k));    
    }
    remove(k){  
        localStorage.removeItem(k);   
    }
    clear(){  
        localStorage.clear();   
    }
    each(fn){  
        for (var i = 0; i < this.getLength(); i++){    
            fn.call(this,this.key(i),JSON.parse( localStorage.getItem( this.key(i) )) );  
        };  
    }
}


export default Store