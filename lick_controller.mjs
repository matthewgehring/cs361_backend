import * as Licks from './lick_model.mjs'
import express from 'express'
import got from 'got';

const app = express()
const PORT = 3000
app.use(express.json({limit: "30mb",extended:true}));
app.use(express.urlencoded({limit: "30mb",extended:true}));

//request microservice sentiment
const getSentiment = async (text) => {
    const data = await got.post('https://restsent-app.herokuapp.com/sentiment', {
	json: text
    }).json();
    return data;
}

//create
app.post("/licks", (req, res) => {
    Licks.createLick(req.body)
    .then(Lick => {
        res.status(201).send({Lick: Lick, message: "Created Successfully"})
    })
    .catch(error => {
        console.log(error)
        res.status(500).send({error: "Request Failed"})
    })
})

//read
app.get("/licks", (req, res) => {
    Licks.retrieveLick()
    .then(Licks => {
        res.send(Licks)
    })
    .catch(error => {
        console.log(error)
        res.status(500).send({error: "Request Failed"})
    })
    
})

//filter
app.post("/licks/filter", (req, res) => {
    const params = Object.entries(req.body).reduce((a,[k,v]) => (v == null ? a : (a[k]=v, a)), {})
    Licks.filterLick(params)
    .then(licks => {
        res.send(licks)
    })
    .catch(error => {
        console.log(error)
        res.status(500).send({error: "Request Failed"})
    })
})

//read One
app.get("/licks/:id", (req, res) => {
    const id = req.params.id;
    Licks.retrieveOneLick(id)
    .then(lick => {
        res.send(lick)
        console.log('check', lick)
    })
    .catch(error => {
        console.log(error)
        res.status(500).send({error: "Request Failed"})
    })
})

//update
app.put("/licks/:id", (req, res) => {
    const id = req.params.id
    Licks.updateLick({"_id": id}, {$set: { ...req.body}}, {new : true})
    .then(modified => {
        if(modified){
            res.send({Lick: modified, message: "Updated Successfully"});
        }else{
            res.send({message: "Failed to Update"})
    }})
        .catch(error => {
            console.log(error)
            res.status(500).send({error: "Request Failed"})
        });
})

//delete
app.delete("/licks/:id", (req, res) => {
    const _id = req.params.id
    Licks.deleteLick({"_id": _id})
        .then(Lick => {
            res.status(204).send()
        })
        .catch(error => {
            console.log(error)
            res.status(500).send({error: "Request Failed"})
        })
})

//get sentiment
app.post('/sentiment', (req, res)=>{
    let text = req.body;
    console.log(text)
    getSentiment(text).then(sentiment => {
        console.log("sentiment", sentiment)
        res.send(sentiment)
    })

})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});