const { nanoid } = require('nanoid');
const books = require('./books');

// * Adding book
const addBookHandler = (request, h) => {
  // ? initialize book params
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // ? validation name params
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  // ! check whether the readpage surpass the page count
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  // * automatically generated value
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage);

  // * initialize new book
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  // ! validating whether the book valid before add
  if (pageCount >= readPage) {
    books.push(newBook);
  }

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);

  return response;
};

const getAllBooksHandler = (request, h) => {
  const {
    name, reading, finished,
  } = request.query;
  if (name) {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter(({ name }) => name.toLowerCase().includes(name.toLowerCase()))
          .map(({id, name, publisher }) => ({
            id: id,
            name: name,
            publisher: publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  if (reading === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter(({ reading }) => reading === true)
          .map(({id, name, publisher }) => ({
            id: id,
            name: name,
            publisher: publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  if (reading === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter(({ reading }) => reading === false)
          .map(({id, name, publisher }) => ({
            id: id,
            name: name,
            publisher: publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }
  
  if (finished === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter(({ finished }) => finished === true)
          .map(({id, name, publisher }) => ({
            id: id,
            name: name,
            publisher: publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  if (finished === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter(({ finished }) => finished === false)
          .map(({id, name, publisher }) => ({
            id: id,
            name: name,
            publisher: publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }
  
  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// * exporting module
module.exports = {
  addBookHandler,
  getAllBooksHandler,

};
