
const galleryDiv = document.querySelector('#gallery');
const searhDiv = document.querySelector('.search-container');
let modalView = false;
let searchMode = false;

// Featching data from web
fetch('https://randomuser.me/api/?results=12&nat=gb,us')
            .then(respose => respose.json())
            .then(data => {
              data.results.forEach((data,i) => createCards(data,i));
              data.results.forEach((data,i) => createModals(data,i));
            }).catch(error => console.log(error));

// Create card for each person return from API
function createCards(details,i){
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card', i);
  let cardHTML  = `<div class="card-img-container ${i}">
                      <img class="card-img ${i}" src="${details.picture.medium}" alt="profile picture">
                    </div>
                    <div class="card-info-container ${i}">
                      <h3 id="name" class="card-name cap ${i}">${details.name.first} ${details.name.last}</h3>
                      <p class="card-text ${i}">${details.email}</p>
                      <p class="card-text cap ${i}">${details.location.city} ${details.location.state}</p>
                    </div>
                  </div>`
  cardDiv.innerHTML = cardHTML;
  galleryDiv.appendChild(cardDiv);
};

// Create modal for each person return from API
function createModals(details,i){
  const modalDiv = document.createElement('div');
  modalDiv.classList.add('modal-container');
  modalDiv.setAttribute('id',i)
  let modalHTML  = `<div class="modal">
                      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                      <div class="modal-info-container">
                          <img class="modal-img" src="${details.picture.large}" alt="profile picture">
                          <h3 id="name" class="modal-name cap">${details.name.first} ${details.name.last}</h3>
                          <p class="modal-text">${details.email}</p>
                          <p class="modal-text cap">${details.location.city}</p>
                          <hr>
                          <p class="modal-text">${details.phone}</p>
                          <p class="modal-text">${details.location.city} ${details.location.state}</p>
                          <p class="modal-text">Birthday:${details.dob.date}</p>
                      </div>
                  </div>

                  <div class="modal-btn-container">
                      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                      <button type="button" id="modal-next" class="modal-next btn">Next</button>
                  </div>`;
  document.querySelector('body').insertBefore(modalDiv, document.querySelector('body script')); // insert "modalDiv" after galleryDiv
  modalDiv.innerHTML = modalHTML;
  modalDiv.style.display = 'none'; // Hide the modal
};

// Search function
function search(){
  const cardNames = document.querySelectorAll('.card-name')
  let searchedWord = document.querySelector('#search-input').value;
  cardNames.forEach(card => {
    card.parentElement.parentElement.style.display = ''; // Hide all the card
    if (!card.innerHTML.toLowerCase().includes(searchedWord)){
      card.parentElement.parentElement.style.display = 'none' // Display matched card
    };
  });
};

// Create next and previous function executed when user click the buttons.
function prev_next(step,e){
  if(searchMode == false){
    const modalContianers = Array.from(document.querySelectorAll('.modal-container'));
    let selectedIndex = modalContianers.indexOf(e.target.parentElement.parentElement);   // Get index of displaying modal
    if (selectedIndex + step >= 0 && selectedIndex + step <= modalContianers.length -1){ // Display next or previous modal as long as "current index +step" from 0 to modalContianers.lenght -1
      modalContianers[selectedIndex].style.display = 'none';
      modalContianers[selectedIndex + step].style.display = '';
    }
  } else {
    const modalContianers = Array.from(document.querySelectorAll('.modal-container'));
    let searchedWord = document.querySelector('#search-input').value;
    let filteredModalContainers = modalContianers.filter(modal => modal.querySelector('h3').innerHTML.toLowerCase().includes(searchedWord)); // Create new array contains match card after search.
    let selectedIndex = filteredModalContainers.indexOf(e.target.parentElement.parentElement); // Get index of displaying modal
    if (selectedIndex + step >= 0 && selectedIndex + step <= filteredModalContainers.length -1){ // Display next or previous modal as long as "current index +step" from 0 to filteredModalContainers.lenght -1
      filteredModalContainers[selectedIndex].style.display = 'none';
      filteredModalContainers[selectedIndex + step].style.display = '';
    }
  }
}

// Display the modal view when particular card is clicked.
galleryDiv.addEventListener('click',(e)=>{
  if(e.target.className != "gallery"){
    document.getElementById(`${e.target.className.replace(/\D/g,'')}`).style.display = ''; // Display modal of selected card
  };
  return modalView = true;
});

// Quit modal and Modal toggle
document.addEventListener('click',(e)=>{
  if(modalView){
    if (e.target.className == "modal-container" || e.target.className == "modal-close-btn" || e.target.tagName == "STRONG"){
      document.querySelectorAll('.modal-container').forEach(modal => modal.style.display = 'none');
      modalView = false;
    };
    if (e.target.id == 'modal-prev'){prev_next(-1,e)}
    if (e.target.id == 'modal-next'){prev_next(1,e)}
  };
});

// Display the result from searching.
searhDiv.addEventListener('click', (e) =>{
  if (e.target.id == 'search-submit'){
    e.preventDefault();
    document.querySelectorAll('.card').forEach(card => card.style.display = '');
    if(document.querySelector('#search-input').value !== ""){
      search();
      searchMode = true;
    } else{
      searchMode = false;
    }
  }
  return searchMode
})
