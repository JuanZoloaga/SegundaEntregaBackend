import express from "express";
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import viewsRouter from "./routes/views.routes.js"
import {Server} from "socket.io"



const app = express();
const PORT = 9099;

app.use(express.json());
app.use(express.urlencoded({extended: true}))

const productos =[
    {
        title:"Alfajor",
        description: "de dulce de leche",
        price: 800,
    },
    {
        title:"Galletitas",
        description: "de chocolate",
        price: 1500,
    },
    {
        title:"Gaseosa",
        description: "Coca Cola",
        price: 2000,
    }
]

//configuración HBS
app.engine("handlebars",  handlebars.engine())
app.set("views", __dirname+ "/views")
app.set("view engine", "handlebars")

app.use(express.static(__dirname+'/public'))

//mantener el server abierto
const httpServer = app.listen(PORT, ()=>{
    console.log(`servidor funcionando en el puerto ${PORT}`)
})

app.get("/", (req,res) =>{
    res.render("home", {productos})
})

app.use("/realtimeproducts", viewsRouter)


//chequeo si el servidor está funcionando
app.get('/ping', (req, res)=>{
    res.send('pong')
})

//Iniciamos socket Server
const socketServer = new Server(httpServer)

socketServer.on("connection", socket =>{

    socketServer.emit("productos", {productos})

    socket.on("mensaje", data=>{
        console.log("Recibiendo producto: ", data)
        const validacion = productos.some((producto)=>producto.title.toLowerCase() === data.title.toLowerCase())
        if (validacion) {
            socket.emit("mensaje", "soy el server")
            const index = productos.findIndex(producto => producto.title.toLowerCase() === data.title.toLowerCase())
            productos.splice(index, 1, )
            socketServer.emit("productosAct", {productos})
        } else {
            socket.emit("mensaje", "soy el server")
            productos.push(data)
            socketServer.emit("productosAct", {productos})
        }

    })
})
