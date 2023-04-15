const books = require("./books");
const { nanoid } = require("nanoid");

const addBooksHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (!name) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);

    return response;
  }

  if (readPage > pageCount) {
    const response = h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);

    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

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

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      })
      .code(201);

    return response;
  }

  const response = h
    .response({
      status: "fail",
      message: "Buku gagal ditambahkan",
    })
    .code(500);

  return response;
};

const getAllBooksHandler = (req, h) => {
  const { name, reading, finished } = req.query;

  let filterBooks = books;

  if (name) {
    filterBooks = filterBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading) {
    filterBooks = filterBooks.filter(
      (book) => book.reading === Boolean(Number(reading))
    );
  }

  if (finished) {
    filterBooks = filterBooks.filter(
      (book) => book.finished === Boolean(Number(finished))
    );
  }

  const response = h
    .response({
      status: "success",
      data: {
        books: filterBooks.map((book) => {
          const { id, name, publisher } = book;
          return {
            id,
            name,
            publisher,
          };
        }),
      },
    })
    .code(200);

  return response;
};

const getBookByIdHandler = (req, h) => {
  const { bookId: id } = req.params;

  const book = books.filter((book) => book.id === id)[0];

  if (!book) {
    const response = h
      .response({
        status: "fail",
        message: "Buku tidak ditemukan",
      })
      .code(404);
    return response;
  }

  return {
    status: "success",
    data: {
      book,
    },
  };
};

const editBookByIdHandler = (req, h) => {
  const { bookId: id } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;
  const updatedAt = new Date().toISOString();

  const indexBook = books.findIndex((book) => book.id === id);
  if (!(indexBook + 1)) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      })
      .code(404);

    return response;
  }

  if (!name) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);

    return response;
  }

  if (readPage > pageCount) {
    const response = h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);

    return response;
  }

  books[indexBook] = {
    ...books[indexBook],
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

  const response = h
    .response({
      status: "success",
      message: "Buku berhasil diperbarui",
    })
    .code(200);
  return response;
};

const deleteBookByIdHandler = (req, h) => {
  const { bookId: id } = req.params;

  const indexBook = books.findIndex((book) => book.id === id);
  if (!(indexBook + 1)) {
    const response = h
      .response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      })
      .code(404);

    return response;
  }

  books.splice(indexBook, 1);
  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });
  response.code(200);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
