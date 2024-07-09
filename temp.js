const fs = require('fs');

// fs.readFile('index.html','utf-8', function(err,data){
//     if(err){
//         console.error(err);
//         return;
//     }
//     console.log(data);
// });

try{
    let data = fs.readFileSync('package.json','utf-8')
    data.replace('index.html','')
}catch(err){
    console.log(err);
}

