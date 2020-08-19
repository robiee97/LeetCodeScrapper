const express= require("express");
const app= express();
const puppeteer = require("puppeteer");
const fs = require("fs");

app.listen(3000, function(){
    console.log("running...");
});

app.get('/' ,function(req,res){
    res.sendFile( __dirname + '/index.html');
});

app.get('/search', function(req, res, next){
    let d= req.query.dif;
    let t=req.query.topics;
    let url = "https://leetcode.com/problemset/all/?difficulty="+d+"&topicSlugs="+t;
    fn(url);
    res.sendFile(__dirname+'/out.html');
});

async function fn(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    let result = await page.evaluate(() => {
        let anchors = document.querySelectorAll('tr td div a');
        let resultSet = [];
        anchors.forEach((e) => {
            resultSet.push(e.innerHTML+" | https://leetcode.com"+e.getAttribute('href'));
        });
        return resultSet; 
    });
    let stringAns="";
    for(let i=0;i<result.length;i++){
        stringAns+=(i+1)+" "+result[i]+"\n";
    }
    fs.writeFileSync("data.txt","LIST OF QUESTIONS : \n"+stringAns,function(err){
        if(err) throw err;
        console.log("stopped");
    });
    console.log("completed");
    await browser.close();
}

