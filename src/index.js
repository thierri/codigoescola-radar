import dovenv from "dotenv";

import nodeCache from "node-cache";
import   express  from "express";
import obterComentarios from "./adaptadores/youtube/obterComentarios.js";


dovenv.config();


const cache = new nodeCache();
const app = express()

const processarComentarios = async () =>{
    const comentarios = await obterComentarios();
    cache.set("comentariosNoCache", comentarios, 60 * 5);
    return comentarios;
}


app.get('/', async (req, res) => {
    const comentariosNoCache = cache.get("comentariosNoCache");
    if (comentariosNoCache == undefined) {
        res.json(await processarComentarios());
    } else {
        console.log(`Usando cache`);
        res.json(comentariosNoCache)
    }
})

app.listen(3000, () => {
    console.log(`Aplicativo rodando 😅`)
})
