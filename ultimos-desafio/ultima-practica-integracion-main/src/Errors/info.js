export const generateUserErrorInfo = (users) =>{
    return  `One or more properties where incomplete or not valid.
    List of require properties:
    
    *first_name: needs to be a String, recived ${users.first_name}
    *last_name : needs to be a String, recived ${users.last_name}
    *email: need to be a String, recived ${users.email}

    `

}
export const generateProductErrorInfo = (product) =>{
    return `One or more properties where incomplete or not valid.
    List of require properties:
    
    *title: needs to be a String, recived ${product.title}
    *description : needs to be a String, recived ${product.description}
    *price : needs to be a Number, recived ${product.price}
    *thumbnail : needs to be a Image, recived ${product.thumbail}
    *code : needs to be a String, recived ${product.code}
    *stock : needs to be a Number, recived ${product.stock}
    *category : needs to be a String, recived ${product.category}
    *status : needs to be a Boolean, recived ${product.status}

    `

}