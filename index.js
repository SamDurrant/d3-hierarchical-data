// modal setup
const openModalButton = document.getElementById('open-modal')
const closeModalButton = document.getElementById('close-modal')
const modal = document.getElementById('modal')

function openModal() {
  modal.style = 'display: block; opacity: 1;'
}

function closeModal() {
  modal.style = 'display: none; opacity: 0;'
}

openModalButton.addEventListener('click', openModal)

closeModalButton.addEventListener('click', closeModal)

const form = document.querySelector('#employee-form')
const name = document.querySelector('#name')
const parent = document.querySelector('#parent')
const department = document.querySelector('#department')

form.addEventListener('submit', (e) => {
  e.preventDefault()

  db.collection('employees').add({
    name: name.value,
    parent: parent.value,
    department: department.value,
  })

  closeModal()
  form.reset()
})
