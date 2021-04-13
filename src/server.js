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
            texto: item.snippet.topLevelComment.snippet.textOriginal,
            autor: item.snippet.topLevelComment.snippet.authorDisplayName.substring(0, 3) + "***",
            criadoEm: item.snippet.topLevelComment.snippet.publishedAt,
            likes: item.snippet.topLevelComment.snippet.likeCount,
            videoId: item.snippet.topLevelComment.snippet.videoId,
            hashtag: Math.random() < 0.5 ? 'sugestaoVideo' : 'mandouBem',
        }
    };
    return _.map(comentariosSujos, tratarObjeto);;
}

app.get('/comentarios', async (req, res) => {
    const comentariosNoCache = cache.get("comentariosNoCache");
    if (comentariosNoCache) {
        console.log(`Usando cache`);
        res.json(comentariosNoCache)
    } else {
        const comentarios = limparComentarios(await obterComentarios());
        cache.set("comentariosNoCache", comentarios, 60 * 5);
        res.json(comentarios);
    }
})

app.listen(3000, () => {
    console.log(`Aplicativo rodando 😅`)
})
