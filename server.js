const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
app.use(bodyParser.urlencoded({extended : true}))

mongoose.connect('mongodb+srv://demouser:demo123@cluster0.ap4zayq.mongodb.net/chitkara_login?retryWrites=true&w=majority&appName=Cluster0',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>console.log('Connect to Mongoose server')
).catch(()=>console.log('Error connecting to Mongoose server'))

const login_schema =new mongoose.Schema({
    email : String,
    password : String
})

const LoginUser = mongoose.model('Login', login_schema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'Login.html'));
})
app.post('/',(req,res)=>{
    console.log(req.body);
    const newUser = new LoginUser({
        email : req.body.email,
        password : req.body.password
    })
    newUser.save()
    .then(()=>{
        console.log('User saved:', newUser);
        res.send('User successfully registered!');
    }).catch((err)=>{
        console.error('Error saving user:', err);
        res.status(500).send('Error saving user.');
    })
})


app.get('/view-users', (req, res) => {
    res.sendFile(path.join(__dirname, 'viewUsers.html')); 
});

app.get('/users', async (req, res) => {
    try {
        const users = await LoginUser.find(); // Fetch all users from the database
        res.json(users); // Send users as JSON response
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});


app.listen(3000,(err)=>{
    if(err) console.log(err);
    else
    console.log('Server is running on port 3000');
})
