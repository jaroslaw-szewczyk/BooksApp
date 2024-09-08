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

  function books(data) {

    //list from the DOM
    const booksList = document.querySelector(select.bookHTML.booksList);

    //Loop over each element in the data array 
    for(const item of data){

      // Conversion of assessment to a percentage scale
      const ratingWidth = (item.rating * 10) + '%';

      // Determining the background based on the evaluation
      const ratingBgc = determinRatingBgc(item.rating);
      
      //adding value to an object
      item.ratingWidth = ratingWidth;
      item.ratingBgc = ratingBgc;

      //Generation of HTML code for a single book
      const generatedHTML = templates.books(item);

      const element = utils.createDOMFromHTML(generatedHTML);

      console.log(item);

      booksList.appendChild(element);
    }    
  }

  function initAction() {

    //Selecting image book from DOM 
    const books = document.querySelector(select.bookHTML.booksList);

    //Selecting books filters from DOM
    const booksFilters = document.querySelector(select.sectionFilters.filters);

    //Listening to the book list
    books.addEventListener('dblclick', event => {
      event.preventDefault();

      //finding the book img parent
      const bookImgParent = event.target.closest(select.bookHTML.bookImage);

      //Checking whether the clicked element is valid, i.e. contains the book__image class
      if(bookImgParent.classList.contains('book__image')){

        //Getting the book id from the data-id
        const bookId = bookImgParent.getAttribute(select.bookHTML.bookAttribute);
                
        //Checking whether the Id is already in the favoriteBooks array
        if(settings.favoriteBooks.includes(bookId)){
          //removing a favourite class to a clicked element
          bookImgParent.classList.remove(select.book.favorite);
                    
          //finding an index in an array 
          const idIndex = settings.favoriteBooks.indexOf(bookId);

          //removing bookId to favoriteBooks array
          settings.favoriteBooks.splice(idIndex, 1);
        } else {
          //adding a favourite class to a clicked element
          bookImgParent.classList.add(select.book.favorite);

          //Adding bookId to favoriteBooks array
          settings.favoriteBooks.push(bookId);    
        }  
      } 
    });
    
    //Listening to the books filters
    booksFilters.addEventListener('click', event =>{
    
      // Checking whether the clicked field is correct
      if(event.target.tagName == 'INPUT' 
          && event.target.type == 'checkbox' 
          && event.target.name == 'filter') {
                
        //Checking whether a given value is in an array
        if(event.target.checked){
          //Adding value to array
          settings.booksFilter.push(event.target.value);
          filter();
        } else {
          //removing vallue from array
          const indexOfInput = settings.booksFilter.indexOf(event.target.value);
          settings.booksFilter.splice(indexOfInput, 1);
          filter();
        }
      }
    });
  }

  function filter() {
    
    console.log(settings.booksFilter);

    for(const book of dataSource.books){
      
      let shouldBeHidden = false;

      for(const bookFilter of settings.booksFilter){
        
        if(book.details[bookFilter]) {
          shouldBeHidden = true;
          break;
        }
      }

      const correctBook = document.querySelector('.book__image[data-id="' + book.id + '"]');
      
      if(shouldBeHidden === true){
        correctBook.classList.add(select.book.hidden);
      } else {
        correctBook.classList.remove(select.book.hidden);
      }
    }
  }

  function determinRatingBgc(rating){
    if(rating < 6) {
      return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
    } else if(rating <= 8) {
      return 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
    } else if(rating <= 9){
      return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    } else {
      return 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%);';
    }
  }

  books(dataSource.books);
  initAction();
}