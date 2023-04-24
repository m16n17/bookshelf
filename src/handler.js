//Import semua library yang dibutuhkan
const {nanoid} = require('nanoid');
const books = require('./books');

/**
 * Tambah data books
 */ 
const addBooksHandler = (request, h) => {
    const{name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };

    //Mengecek jika client tidak melampirkan properti 'name' pada request body
    if(typeof name === 'undefined'){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    //Mengecek jika nilai properti 'readPage' lebih besar dari nilai properti 'pageCount'
    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    //Mengecek jika nilai dari 'isSuccess' bernilai true
    if(isSuccess){
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        });
        response.code(201);
        return response;
    }

    //Bila request gagal
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan'
    });

    response.code(500);
    return response;
};


/**
 * Tampilkan semua data books
 */
const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    //Mengecek jika panjang dari buku sama dengan 0 / kosong
    if(books.length === 0){
        const response = h.response({
            status: 'success',
            data:{
                books: [],
            },
        });
        response.code(200);
        return response;
    }

    //Melakukang filter dari properti 'name', 'reading' dan 'finished'
    let filteringBook = books;

    if(typeof name !== 'undefined'){
        filteringBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    if(typeof reading !== 'undefined'){
        filteringBook = books.filter((book) => Number(book.reading) === Number(reading));
    }

    if(typeof finished !== 'undefined'){
        filteringBook = books.filter((book) => Number(book.finished) === Number(finished));
    }

    //Buat variable 'listOfBook' untuk menampung beberapa properti
    const listOfBook = filteringBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    const response = h.response({
        status: 'success',
        data: {
            books: listOfBook,
        },
    });

    response.code(200);
    return response;
}

/**
 * Tampilkan data books sesuai bookid
 */
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((b) => b.id === bookId)[0];

    //Mengecek jika nilai dari book tidak sama dengan undefined
    if(typeof book !== 'undefined'){
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    //Bila request gagal
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
};

/**
 * Edit data books sesuai bookid
 */
const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const{ name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);

    //Mengecek jika client tidak melampirkan properti 'name' pada request body
    if(typeof name === 'undefined'){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    //Mengecek jika nilai properti 'readPage' lebih besar dari nilai properti 'pageCount'
    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    //Mengecek jika nilai dari 'index' tidak -1
    if(index !== -1){
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    //Bila request gagal
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;

};

/**
 * Hapus data books sesuai bookid
 */
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    //Mengecek jika nilai dari 'index' tidak -1
    if(index !== -1){
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    //Bila request gagal
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};


//Export nilai
module.exports = {
    addBooksHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
}