const http = require('http'),
port = process.env.PORT || 8000,
fs = require('fs'),
url = require('url');

let products = JSON.parse(fs.readFileSync('./products.json',  {encoding: 'utf-8'}));

http.createServer((request, response)=>{
    
    response.writeHead(200,{
        "Access-Control-Allow-Origin":"*",
        'Access-Control-Allow-Methods':"POST, PUT, DELETE",
        'Access-Control-Allow-Headers':"*"
    })
    
    let siteUrl = url.parse(request.url,true);
    let id = siteUrl.query.id
    let resProducts = JSON.stringify(products);


    
        if(request.method==='OPTION' && siteUrl.pathname === '/products'){
            response.end();
        }
        else if(request.method==='GET' && siteUrl.pathname === '/products'){
            console.log(siteUrl)
            if(id!==undefined && id!=='' && id!=='undefined'){
                let searchedProduct = products.find((product)=>{
                    return Number(product.id) === Number(id);
                })
                if(searchedProduct!==undefined){
                let product = JSON.stringify(searchedProduct)
                    response.write(product);
                }
                else{
                    response.write(JSON.stringify({message:'invalid Id'}));
                };
            }else{
                response.write(resProducts);
            };
            response.end();    

        }
        else if(request.method==='POST' && siteUrl.pathname === '/products'){
            let data='';
            request.on('data',(chunck)=>{
                data+=chunck;
            })
            request.on('end',()=>{
                let newProduct = JSON.parse(data);
                products.push(newProduct);

                fs.writeFile('./products.json',JSON.stringify(products),(err)=>{
                    if(err===null){
                        response.write(JSON.stringify({message: ' new product has been added'}));
                    }else{
                        response.write(JSON.stringify({message:'some error adding product'}));
                        
                    };
                    response.end();
                });

            });
        }
        else if(request.method==='PUT' && siteUrl.pathname === '/products'){
            if(id!==undefined){
                let productToEdit = products.findIndex((product)=>{
                    return Number(product.id)===Number(id)
                })
                let data='';
                request.on('data',(chunck)=>{
                    data+=chunck;
                })
                request.on('end',()=>{
                    let replaceProduct = JSON.parse(data);
                    if(productToEdit!==(-1)){
                        products[productToEdit]=replaceProduct;
    
                        fs.writeFile('./products.json',JSON.stringify(products),(err)=>{
                            if(err===null){
                                response.write(JSON.stringify({message:'product updated'}));
                                response.end();
                            }else{
                                response.write(JSON.stringify({message:' error while product update'}));
                                response.end();
                                
                            };
                        });
                    }
                    else{
                        response.write(JSON.stringify({message:'some error pass valid id'}));
                        response.end();
                    }
                });
            }else{
                response.write(JSON.stringify({message:'some error pass id in url to modify'}));
                response.end();
            }

        }
        else if(request.method==='DELETE' && siteUrl.pathname === '/products'){
            
            if(id!==undefined){
                let trashProduct = products.findIndex((product)=>{
                    return Number(product.id) === Number(id);
                })
                if(trashProduct!==-1){
                    // console.log(trashProduct);
                    products.splice(trashProduct,1);
                    // response.write(JSON.stringify(products));
                    fs.writeFile('./products.json',JSON.stringify(products),(err)=>{
                        if(err===null){
                            response.write(JSON.stringify({message:' sucessfully deleted '}));
                        }else{
                            response.write(JSON.stringify({message:' error while deleting product'}));
                        };
                        response.end();
                    });
                }else{
                    response.write(JSON.stringify({message:' delete id invalid'}));
                    response.end();
                };
                
            }else{
                response.write(JSON.stringify({message:'hi i am DELETE request plz pass id in URL to delete'}));
                response.end();
            };
        }
        else {
            response.write(JSON.stringify({message:'error 404: NOT FOUND'}));
            response.end();    
        };
    
}).listen(port, ()=>{
    console.log('server is running');
});