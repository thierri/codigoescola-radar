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
const { PORT = 3000, PWD } = process.env

/**
 * Servindo frontend
 */
const diretorioFrontend = path.join(PWD, 'src/frontend')
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
        res.json(comentariosNoCache);
    } else {
        const comentarioSujos = await obterComentarios()
        const comentariosLimpos = limparComentarios(comentarioSujos);
        cache.set("comentariosNoCache", comentariosLimpos, 60 * 5);
        res.json(comentariosLimpos);
    }
})

app.listen(PORT, () => {
    console.log(`Aplicativo rodando 😅`)
})
