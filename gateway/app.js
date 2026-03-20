const express=require('express');
const app=express();
const expressProxy=require('express-http-proxy');
const usersProxy = expressProxy('http://localhost:3001');
const userProxy = expressProxy('http://localhost:3001', {
    proxyReqPathResolver: (req) => `/users${req.url}`
});
const captainsProxy = expressProxy('http://localhost:3002');
const captainProxy = expressProxy('http://localhost:3002', {
    proxyReqPathResolver: (req) => `/captains${req.url}`
});

app.use('/user', userProxy);
app.use('/users', usersProxy);
app.use('/captain', captainProxy);
app.use('/captains', captainsProxy);
app.listen(3000,()=>{
    console.log("Gateway is running on port 3000");
})