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
          .map(({id, name, publisher }) => ({ id, name, publisher })),
      },
    });
    response.code(200);
    return response;
  }
  // ! Check whether the book read status is true or false
  if (reading === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter(({ reading }) => reading === false)
          .map(({id, name, publisher }) => ({ id, name, publisher })),
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
          .map(({id, name, publisher }) => ({ id, name, publisher })),
      },
    });
    response.code(200);
    return response;
  }
  // ! Check whether the book finished status is true or false
  if (finished === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter(({ finished }) => finished === false)
          .map(({id, name, publisher }) => ({ id, name, publisher })),
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
          .map(({id, name, publisher }) => ({ id, name, publisher })),
      },
    });
    response.code(200);
    return response;
  }
  // ? returning the book value
  const response = h.response({
    status: 'success',
    data: {
      books: books.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((nbook) => nbook.id === bookId)[0];
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  // * initialize book
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);
  // * make sure that the book not out of bound
  if (index !== -1) {
    if (!request.payload.name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    const finished = (pageCount === readPage);
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
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
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  // * make sure that the book not out of bound
  if (index !== -1) {
    // ! splice purpose to removing array element
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  // ! condition if the id not responding
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// * exporting module
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
