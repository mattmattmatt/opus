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

export function getHostImage(ip, uri) {
    return uri ? 'http://' + ip + '/image/' + encodeURIComponent(uri) : '';
}

export function prepareAlbumsForNormalization(albums, ip) {
    return albums.map((album) => {
        album.artists = album.artist.map((artist, index) => {
            return {
                artist,
                artistid: album.artistid[index]
            };
        });
        delete album.artist;
        delete album.artistid;
        album.thumbnail = getHostImage(ip, album.thumbnail);
        return album;
    });
}

export function prepareArtistsForNormalization(artists, ip) {
    return artists.map((artist) => {
        artist.thumbnail = getHostImage(ip, artist.thumbnail);
        artist.fanart = getHostImage(ip, artist.fanart);
        return artist;
    });
}

export function getFallbackImage(text, width = 600, height = 400, bgColor = '000', textColor = 'fff') {
    return `http://dummyimage.com/${width}x${height}/${bgColor}/${textColor}.png&text=${encodeURIComponent(text)}`;
}
