import dovenv from "dotenv";
import nodeCache from "node-cache";
import express from "express";
import path from "path";
import morgan from "morgan";
import _ from "lodash";

import obterComentarios from "./adaptadores/youtube/obterComentarios.js";

/**
 * Inicialização
 */
dovenv.config();
const cache = new nodeCache();
const app = express()
app.use(morgan('tiny'));


/**
 * Servindo frontend
 */
const diretorioFrontend = path.join(process.env.PWD, 'src/frontend')
app.use(express.static(diretorioFrontend))


const limparComentarios = (comentariosSujos) => {
    let tratarObjeto = item => {
        return {
            id: item.id,
            texto: item.snippet.topLevelComment.snippet.textDisplay,
            autor: item.snippet.topLevelComment.snippet.authorDisplayName,
            criadoEm: item.snippet.topLevelComment.snippet.publishedAt,
            likes: item.snippet.topLevelComment.snippet.likeCount,
            videoId: item.snippet.topLevelComment.snippet.videoId,
        }
    };
    return _.map(comentariosSujos, tratarObjeto);;
}

app.get('/comentarios', async (req, res) => {
    const comentariosNoCache = cache.get("comentariosNoCache");
    if (comentariosNoCache == undefined) {
        const comentarios = limparComentarios(await obterComentarios());
        cache.set("comentariosNoCache", comentarios, 60 * 5);
        res.json(comentarios);
    } else {
        console.log(`Usando cache`);
        res.json(comentariosNoCache)
    }
})

app.listen(3000, () => {
    console.log(`Aplicativo rodando 😅`)
})
