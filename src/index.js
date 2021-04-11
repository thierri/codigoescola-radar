import dovenv from "dotenv";

import nodeCache from "node-cache";
import obterComentarios from "./adaptadores/youtube/obterComentarios.js";


dovenv.config();

const cache = new NodeCache();
const comentarios = obterComentarios();

cache.set("comentariosNoCache", comentarios, 10000);

comentariosNoCache = cache.get("comentariosNoCache");
if (comentariosNoCache == undefined) {
    // handle miss!
}
