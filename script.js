//fetching necessary elements
const tbody = document.querySelector('tbody'),
inputPanel = document.getElementById('input'),
inputs = inputPanel.children,
addUpdateBtn = document.getElementById('add_update');



//creating variable
let allProducts = [];


//GET call request
async function getData(id){
    await fetch(`http://localhost:8000/products?id=${id}`)
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        if(id===undefined){
            allProducts = data;
            displayProducts(allProducts)
        } 
        else{
            fillInputPanel(data,"edit")  
        }
    }).catch((error)=>{
      console.log(error)
    })
    
}

//calling POST request
function postData(){
    let product = getInputData();
    inputs[0].value = ((allProducts[allProducts.length-1].id)+1);
    allProducts.push(product);
    displayProducts(allProducts);
    inputPanel.classList.remove('active');
    fetch(`http://localhost:8000/products`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        console.log(data);
    }).catch((error)=>{
      alert(error)
    })
}


//calling PUT request
function putData(product){
    getInputData();
    fetch(`http://localhost:8000/products?id=${product.id}`, {
        method:'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        console.log(data)
    }).catch((error)=>{
      alert(error)
    })
}

//calling Delete Request
function actionDelete(id){
    fetch(`http://localhost:8000/products?id=${id}`,{
       method: "DELETE"
    })
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        trash(id);
        console.log(data)
    }).catch((error)=>{
        console.log(error)
    })
}

function trash(id){
    let productToDeleteIndex =  allProducts.findIndex((oldProduct)=>{
        return Number(oldProduct.id) === Number(id)
    });
    allProducts.splice(productToDeleteIndex,1);
    displayProducts(allProducts)
}

//calling GET for the fist time
getData();


//functionality for create btn
function openInputPanel(){
    inputPanel.classList.add('active');
    inputPanel.reset();
    addUpdateBtn.setAttribute('onclick', 'postData()');
    addUpdateBtn.textContent = "ADD";
    inputs[0].setAttribute('readonly', true);
    inputs[0].style.backgroundColor = 'lightgray';
    inputs[0].style.cursor = 'no-drop';
    inputs[0].value = ((allProducts[allProducts.length-1].id)+1);
    console.log(inputs[0].value)
    addUpdateBtn.disabled = true;
}

//functionality for edit btn
function actionEdit(id){
    getData(id);
    inputPanel.classList.add('active');
    addUpdateBtn.setAttribute('onclick', 'updateProduct()');
    addUpdateBtn.textContent = 'Update';
    addUpdateBtn.disabled = false;
 }

//filling the Input through GET request by id
function fillInputPanel(data,action){
    if(action==='edit'){
        inputs[0].value = data.id;
        inputs[0].setAttribute('readonly', true);
        inputs[0].style.backgroundColor = 'lightgray';
        inputs[0].style.cursor = 'no-drop';
        inputs[1].value = data.name;
        inputs[2].value = data.quantity;
        inputs[3].value = data.price;
    }
}

//getting Input Data

function getInputData(){
    let product={};
    product.id = Number(inputs[0].value);
    product.name = inputs[1].value;
    product.quantity = Number(inputs[2].value);
    product.price = Number(inputs[3].value);
    return product;
}

//functionality to update product in backend
function updateProduct(){
    let product = getInputData()
    putData(product);
    let productToUpdateIndex =  allProducts.findIndex((oldProduct)=>{
        return Number(oldProduct.id) === Number(product.id)
    });
    allProducts[productToUpdateIndex] = product;
    displayProducts(allProducts)
    inputPanel.classList.remove('active')
}

//functionality for displaying products
function displayProducts(products){
    
    tbody.innerHTML = ''

    products.forEach((product,index)=> {
        
        let row = document.createElement('tr');

            let serialNo = document.createElement('td');
            serialNo.append(index+1);

            let name = document.createElement('td');
            name.append(product.name);

            let quantity = document.createElement('td');
            quantity.append(product.quantity);

            let price = document.createElement('td');
            price.append(product.price);

            let action = document.createElement('td');
                let edit = document.createElement('i');
                edit.className ="fa-solid fa-pen-to-square";
                edit.onclick = actionEdit.bind(this,product.id);

                let trash = document.createElement('i');
                trash.className ="fa-solid fa-trash";
                trash.onclick = actionDelete.bind(this,product.id);


            action.append(edit, trash)

        row.append(serialNo, name, quantity, price, action);
        tbody.append(row);

    });


}




