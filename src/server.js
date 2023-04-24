//Import semua library yang dibutuhkan
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

//Buat function untuk mengatur server menggunakan framework HAPI
const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.route(routes);

    await server.start();

    console.log(`Server berjalan pada ${server.info.uri}`);
}

//inisialisasi nilai function tersebut
init();