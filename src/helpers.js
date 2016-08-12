/* globals Promise */

export function sendKodiCommand(connection, method, params) {
    if (!connection || !connection.run) {
        return Promise.reject('IP not set');
    }

    if (!method) {
        return Promise.reject('No command to send to Kodi');
    }

    return connection.run(method, params);
}

export function sendKodiBatch(connection, batchArray) {
    if (!connection || !connection.run) {
        return Promise.reject('IP not set');
    }

    if (!batchArray || !batchArray.length) {
        return Promise.reject('No batch to send to Kodi');
    }

    const batch = connection.batch();

    // build array of batch functions
    // turns an array of
    //      batch.run('VideoLibrary.GetMovies', ({properties: ['title']}))
    // into
    //      batch.VideoLibrary.GetTVShows({properties: ['title']})
    const commands = batchArray.map(command => {
        const keys = command[0].split('.');
        const method = keys.reduce((b, key) => {
            return b[key];
        }, batch);
        return {
            method,
            params: command[1]
        };
    });

    const promises = commands.map(command => {
        return command.method(command.params);
    });

    batch.send();

    return Promise.all(promises);
}
