const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 3000;

// pour que notre app accepte le format JSON
app.use(express.json())

// normalement on devrais une db mais pour l'exemple on vas utiliser un Array
const users = []

// a cet adresse on vas retourner ce qu'il y a dans l'array users
app.get('/users', (req, res)=>{
    res.json(users)
})

// on rajoute 1 user en hashant le password
app.post('/users', async (req, res)=>{
    try{
        // normalement on pourais utiliser cet facon  pour genere un pwd hacher mais bcrypt a une maniere plus simple de le faire
        // const salt = await bcrypt.genSalt(11) 
        // const hashPassword = await bcrypt.hash(req.body.password, salt)

        //  et c'est celle ci en dessous
        const hashPassword = await bcrypt.hash(req.body.password, 11)
        const user = { name: req.body.name, password: hashPassword }
        users.push(user)
        res.status(201).send()
        
    } catch {
        res.status(500).send()
    }
})

// login, on vas compare si le user qui essaye de se connecter exista dans notre pseudo db
app.post('/users/login', async (req, res)=>{
    // le find vas retour vrais ou faux
    const user = users.find(user=> user.name === req.body.name)
    // si c faux il te dira qu'il te connait pas
    if (user == null){
        return res.status(400).send('Cannot find user')
    }
    // sinon il essayera
    try{
        // de compare le pass que tu lui a donner et si ok 
        if (await bcrypt.compare(req.body.password, user.password)){
            // ben tu rentrera
            res.send('Success')
        } else{
            // sinon pas
            res.send('Not allowed')
        }
    }catch{
        // et au cas ou ca marche pas on renvois un code 500
        res.status(500).send()
    }

})

app.listen(PORT, ()=>console.log('server up')) 