const fs = require('fs');   //file system module
const json = fs.readFileSync(`${__dirname}/data/data.json`,  'utf-8'); //read the content of the file data.json
const http = require('http'); //http module
const url = require('url');
const laptopData = JSON.parse(json); //convert to JS objects
const port = process.env.PORT || 8080;


//create the server
const server = http.createServer((req, res) =>{
    /*Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: '?Id=1',
  query: [Object: null prototype] { Id: '1' },
  pathname: '/products',
  path: '/products?Id=1',
  href: '/products?Id=1'
}*/ 
    const pathName = url.parse(req.url, true).pathname;  //grabing the query string and converting it to JS object
    const id = url.parse(req.url, true).query.id;  // url{query: {id: '2'}} => id = '2'
    
    //PRODUCTS OVERVIEW
    if(pathName === '/products' || pathName === '/'|| pathName === '/template-overview.html'){
        res.writeHead(200, {'content-type': 'text/html'});

        //read the template-overview.html
        fs.readFile(`${__dirname}/template/template-overview.html`, 'utf-8', (err, data) =>{
            
            let overviewOutput = data;
            fs.readFile(`${__dirname}/template/template-card.html`, 'utf-8', (err, data)=>{
                //mapping through all the laptops
                const cardsOutput = laptopData.map(el =>replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                res.end(overviewOutput);
            });
        });
    }

    //LAPTOP DETAIL
    else if (pathName === '/laptop' && id < laptopData.length && id >=0){
        res.writeHead(200, {'content-type': 'text/html'});
        
        //read file template-laptop.html
        fs.readFile(`${__dirname}/template/template-laptop.html`, 'utf-8', (err, data)=>{
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            res.end(output);
        });
    }

    //ROUTE FOR IMAGES
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)){
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data)=>{
            res.writeHead(200, {'content-type': 'text/html'});
            res.end(data);
           
        });
    }
    
    //URL NOT FOUND
    else{
        res.writeHead(404, {'content-type': 'text/html'});
        res.end('URL not found');
    }
});

server.listen(port)
console.log(`server started`);



function replaceTemplate(originalHtml, laptop){
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}
