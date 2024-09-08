{
  //Handlebars script from DOM
  const templates = {
    books: Handlebars.compile(document.querySelector('#template-book').innerHTML),
  };
    
  const select = {
    book: {
      favorite: 'favorite',
      hidden: 'hidden',
    },

    bookHTML: {
      bookImage: '.book__image',
      booksList: '.books-list',
      bookAttribute: 'data-id',
      bookRating: '.book__rating__fill'
    },

    sectionFilters: {
      filters: '.filters',
      checkbox: 'input[type="checkbox"]',
    }
  };

  const settings = {
    favoriteBooks: [],
    booksFilter: [],
  };

  class BookList {
    constructor(data) {
      this.data = data;
      this.booksList = document.querySelector(select.bookHTML.booksList);
      this.favoriteBooks = settings.favoriteBooks;
      this.filters = settings.booksFilter;
  
      // Initialize
      this.initData();
      this.initActions();
    }
  
    // Function to initialize data
    initData() {
      this.renderBooks(this.data);
    }
  
    // Rendering books
    renderBooks(data) {
      for (const item of data) {
        const ratingWidth = (item.rating * 10) + '%'; // Convert rating to percentage scale
        const ratingBgc = this.determineRatingBgc(item.rating); // Determine background based on rating
  
        item.ratingWidth = ratingWidth;
        item.ratingBgc = ratingBgc;
  
        // Generate HTML for each book
        const generatedHTML = templates.books(item);
        const element = utils.createDOMFromHTML(generatedHTML);
  
        this.booksList.appendChild(element);
      }
    }
  
    // Function to determine background color based on rating
    determineRatingBgc(rating) {
      if (rating < 6) {
        return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
      } else if (rating <= 8) {
        return 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
      } else if (rating <= 9) {
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else {
        return 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';
      }
    }
  
    // Function to handle user actions (clicks, filters)
    initActions() {
      const booksFilters = document.querySelector(select.sectionFilters.filters);
  
      // Listen for double-click on book images to add/remove favorites
      this.booksList.addEventListener('dblclick', event => {
        event.preventDefault();
  
        const bookImgParent = event.target.closest(select.bookHTML.bookImage);
  
        if (bookImgParent.classList.contains('book__image')) {
          const bookId = bookImgParent.getAttribute(select.bookHTML.bookAttribute);
  
          // Check if the book is already in the favorites
          if (this.favoriteBooks.includes(bookId)) {
            bookImgParent.classList.remove(select.book.favorite);
            const idIndex = this.favoriteBooks.indexOf(bookId);
            this.favoriteBooks.splice(idIndex, 1);
          } else {
            bookImgParent.classList.add(select.book.favorite);
            this.favoriteBooks.push(bookId);
          }
        }
      });
  
      // Listen for clicks on filters
      booksFilters.addEventListener('click', event => {
        if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter') {
          if (event.target.checked) {
            this.filters.push(event.target.value);
          } else {
            const indexOfInput = this.filters.indexOf(event.target.value);
            this.filters.splice(indexOfInput, 1);
          }
          this.filterBooks();
        }
      });
    }
  
    // Function to filter books based on selected filters
    filterBooks() {
      for (const book of this.data) {
        let shouldBeHidden = false;
  
        for (const bookFilter of this.filters) {
          if (book.details[bookFilter]) {
            shouldBeHidden = true;
            break;
          }
        }
  
        const correctBook = document.querySelector('.book__image[data-id="' + book.id + '"]');
  
        if (shouldBeHidden) {
          correctBook.classList.add(select.book.hidden);
        } else {
          correctBook.classList.remove(select.book.hidden);
        }
      }
    }
  }
  
  // Initialize the BookList class
  const app = new BookList(dataSource.books);
  app;
}