import mongoose from 'mongoose';

//Boilerplate
mongoose.connect(
    "mongodb://localhost:27017/licks_db",
    { useNewUrlParser: true }
);

const db = mongoose.connection;

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

//define schema
const lickSchema = mongoose.Schema({
    key: { type: String, required: false },
    chord: { type: String, required: false },
    progression: { type: String, required: false },
    sentiment: { type: String, required: false },
    tab: { type: String, required: true }
});

const Lick = mongoose.model("Lick", lickSchema)

//Create
const createLick = async ({key, chord, progression, sentiment, tab}) => {
    const lick = new Lick({key: key, chord: chord, progression: progression, sentiment: sentiment, tab: tab})
    return lick.save()
}
//retrieve
const retrieveLick = async () => {
    const query = Lick.find()
    return query.exec()
}

//retrieve one lick
const retrieveOneLick = async (id) => {
    console.log("id", id)
    const query = await Lick.findById(id).exec()
    return query
}
//update
const updateLick = async (conditions, update, options) => {
    const query = await Lick.findOneAndupdate(conditions, update, options)

    if(query){
        query.save()
        return query
    } else {
        return 0
    }
}
//Delete
const deleteLick = async(id) => {
    const item = await Lick.deleteOne(id)
    return item
}

export {createLick, retrieveLick, retrieveOneLick, updateLick, deleteLick};