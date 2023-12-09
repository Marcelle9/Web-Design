const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_aniver')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_aniver", JSON.stringify(dbClient))

// CRUD - create read update delete
const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage()

const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const saveClient = () => {
    debugger
    if (isValidFields()) {
		let userDate = document.getElementById('dateBirth').value.split('-'),
		parsedDate = new Date((`${userDate[1]}-${userDate[2]}-${userDate[0]}`));
		var ano = parsedDate.getFullYear();
		var dia = parsedDate.getDate();
		var mes = parsedDate.getMonth();
		
        const client = {
            nome: document.getElementById('nome').value,
            date: dia+"/"+(mes+1)+"/"+ano,
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
}
const createRow = (client, index) => {
    const newRow = document.createElement('tr');
     var temp = new Date()
	var ano = temp.getFullYear();
	var dia = temp.getDate();
	var mes = temp.getMonth();
	console.log(client.date == (dia+"/"+(mes+1)+"/"+ano))
    if (client.date !== (dia+"/"+(mes+1)+"/"+ano)) {
        newRow.innerHTML = `
        <td class="purple-input bigText">${client.nome}</td>
        <td class="purple-input bigText">${client.date}</td>
        
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    } else {
        newRow.innerHTML = `
        <td class="bigText">${client.nome}</td>
        <td class="bigText">${client.date}</td>
        
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
           `
    }

    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const createRow1 = (client, index) => {
    const newRow = document.createElement('tr');
    var temp = new Date()
	var ano = temp.getFullYear();
	var dia = temp.getDate();
	var mes = temp.getMonth();
    if (client.date !== (dia+"/"+(mes+1)+"/"+ano)) {
        newRow.innerHTML = `
        <td  class="bigText">${client.nome}</td>
        <td  class="bigText">${client.date}</td>
        
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
	    document.querySelector('#tableClient>tbody').appendChild(newRow)
    } 
}

const createRow2 = (client, index) => {

     
                var query = document.getElementById('search').value;
                const dbClient = getLocalStorage()
                clearTable()
                for (const key in dbClient) {
					 const newRow = document.createElement('tr');
                     var a = dbClient[key]
					 var temp = new Date()
					 var ano = temp.getFullYear();
					 var dia = temp.getDate();
					 var mes = temp.getMonth();
                    if (`${a.date}`=== (dia+"/"+(mes+1)+"/"+ano))
                    {
                        newRow.innerHTML = `
						<td class="purple-input bigText">${a.nome}</td>
						<td class="purple-input bigText">${a.date}</td>
						
						<td>
							<button type="button" class="button green" id="edit-${key}">Editar</button>
							<button type="button" class="button red" id="delete-${key}" >Excluir</button>
						</td>`
    
						document.querySelector('#tableClient>tbody').appendChild(newRow)
                    }
                }
         
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
	createRow2()
    dbClient.forEach(createRow1)
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('dateBirth').value = client.date
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o telefone de ${client.nome}`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}


updateTable()


// Eventos
document.getElementById('cadastrarAniver')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click',saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)


document.getElementById('search')
    .addEventListener('keyup',
        function () {
            if (document.getElementById('search').value == '') {
                clearTable()
                updateTable()
            }
        });
document.getElementById('search')
    .addEventListener('keydown',
        function () {
            if (document.getElementById('search').value == '') {
                clearTable()
                updateTable()
            } else {
                var query = document.getElementById('search').value;
                const dbClient = getLocalStorage()
                clearTable()
                for (const key in dbClient) {
                    
                    var a = dbClient[key]
                    if (`${a.nome}`.includes(query))
                    {
                        createRow(a, key)
                    }
                }
            }
        });

