/* eslint-disable max-len */
/* eslint-disable no-const-assign */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (Request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = Request.payload;
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
    return response;
  }
  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.filter((bookz) => bookz.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,

      },
    }).code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};
const getAllBooksHandler = (Request, h) => {
  const { reading, finished } = Request.query;
  if (reading === '1') {
    return h.response({

      status: 'success',

      data: {

        books: books.filter((bookz) => bookz.reading === true).map((bookz) => (
          {
            id: bookz.id,
            name: bookz.name,
            publisher: bookz.publisher,
          })),

      },
    });
  } if (reading === '0') {
    return h.response({

      status: 'success',

      data: {

        books: books.filter((bookz) => bookz.reading === false).map((bookz) => (
          {
            id: bookz.id,
            name: bookz.name,
            publisher: bookz.publisher,
          })),

      },
    });
  }
  if (finished === '1') {
    return h.response({

      status: 'success',

      data: {

        books: books.filter((bookz) => bookz.finished === true).map((bookz) => (
          {
            id: bookz.id,
            name: bookz.name,
            publisher: bookz.publisher,
          })),

      },
    });
  } if (finished === '0') {
    return h.response({

      status: 'success',

      data: {

        books: books.filter((bookz) => bookz.finished === false).map((bookz) => (
          {
            id: bookz.id,
            name: bookz.name,
            publisher: bookz.publisher,
          })),

      },
    });
  }
  const response = h.response({
    status: 'success',
    data: {
      books: books.map((bookz) => ({
        id: bookz.id,
        name: bookz.name,
        publisher: bookz.publisher,
      })),
    },
  });
  response.code(200);

  return response;
};
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];

  if (book) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);

  return response;
};
const editBookByIdByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((bookz) => bookz.id === id);

  if (index !== -1) {
    if (!name) {
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
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdByIdHandler,
  deleteBookByIdHandler,
};
