
import  googleApis  from "googleapis";

const obterComentarios = () => {
    console.log(`Buscando comentários no Google`);
    
    if (!process.env.googleAuthToken) {
        throw Error('Variável de ambiente googleAuthToken indisponível');
    }

    if (!process.env.channelId) {
        throw Error('Variável de ambiente channelId indisponível');
    }


    const youtubeService = googleApis.google.youtube({
        version: 'v3',
        auth: process.env.googleAuthToken
    });

    const commentThreadsListOptions = {
        "part": [
            "snippet,replies"
        ],
        "allThreadsRelatedToChannelId": process.env.channelId,
        "maxResults": 100
    };

    return youtubeService.commentThreads
        .list(commentThreadsListOptions)
        .then(
            (response) => response.data.items
        );
}
export default obterComentarios;