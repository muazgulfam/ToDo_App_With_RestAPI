import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';

//await mongoose.connect('mongodb+srv://muazgulfam:Muaz0106@cluster0.wktoila.mongodb.net/myDataBase?retryWrites=true&w=majority');
const app = express()
const port = process.env.PORT || 3000

let todoSchema = new mongoose.Schema({
    text: {type: String, required: true}, // String is shorthand for {type: String}
    classId: String,
    createdOn: { type: Date, default: Date.now }
});

const todoModel = mongoose.model('todos', todoSchema);

app.use(express.json());
app.use(cors())

app.post('/todo', (req, res) => {
    todoModel.create({
        text: req.body.text}, 
        (err, saved) => {
            if (!err) {
                console.log(saved)
                res.send({
                    message: "Your to do is saved"
                })
            }
            else{
                res.status(500).send({
                message: "Server Error"
                })
            }
    })

    //res.send({
        //message: "Your to do is saved",
        //data: todos
    //})
})

app.get('/todos', (req,res) => {
    todoModel.find({}, 
    (err, data) => {
        if(!err){
            res.send({
                message:"Here is your to do list",
                data: data
            })
        }
        else{
            res.server(500).send({
                message:"Server Error"
            })
        }
    });
})


app.delete('/todos', (req,res) => {
    todoModel.deleteMany({}, 
    (err, data) => {
        if(!err){
            res.send({
                message:"All Todo has been Deleted successfully",
            })
        }
        else{
            res.server(500).send({
                message:"Server Error"
            })
        }
    });
})


app.delete('/todo/:id', (req,res) => {
    todoModel.deleteOne({_id: req.params.id}, 
    (err, deletedData) => {
        console.log("deleted: ", deletedData)
        if(!err){
            if(deletedData.deletedCount !== 0){
                res.send({
                message:"Your selected Todo has been Deleted successfully",
                })
            } 
            else{
                res.send({
                message:"No Todo exist with uch Id" + req.params.id,
                })
            } 
        }
        else{
            res.server(500).send({
                message:"Server Error"
            })
        }
    });
})


app.listen(port, () => {
  console.log(`my app listening on port ${port}`)
})



let dbURI = "mongodb+srv://muazgulfam:Muaz0106@cluster0.wktoila.mongodb.net/myDataBase?retryWrites=true&w=majority";
// let dbURI = 'mongodb://localhost/mydatabase';
mongoose.connect(dbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function() {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function() {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function(err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function() {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function() {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});