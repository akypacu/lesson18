const postbtn = document.querySelector('.postbtn')
    const getBtn = document.querySelector('.get')
    const taskContainer = document.querySelector('.task-container')

    const postData = async (url, data) => {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-type': 'application/json' }
      })
      return response.json()
    }

    const getData = async (url) => {
      const response = await fetch(url)
      return response.json()
    }

    postbtn.addEventListener('click', async (e) => {
      e.preventDefault()
      const title = document.getElementById('title').value
      const description = document.getElementById('description').value
      const time = new Date().toLocaleTimeString()
	  const complete = 'uncompleted'

      try {
        const response = await postData('http://localhost:3000/list', {
          title,
          description,
          time,
		  complete
        })
        console.log(response)
        document.getElementById('title').value = ''
        document.getElementById('description').value = ''
      } catch (error) {
        console.error(error)
      }
    })

    getBtn.addEventListener('click', async (e) => {
      e.preventDefault()

      try {
        const tasks = await getData('http://localhost:3000/list')
        taskContainer.innerHTML = ''
        tasks.forEach(task => {
          const taskBlock = document.createElement('div')
          taskBlock.classList.add('task-block')
          taskBlock.innerHTML = `
            <div class block>
              <h3>Title: ${task.title}</h3>
              <p>Description: ${task.description}</p>
              <p>Time: ${task.time}</p>
              <button class="delete" data-id="${task.id}">Delete</button>
              <button class="complete" data-id="${task.id}">Task ${task.complete}</button>
            </div>
          `
          taskContainer.appendChild(taskBlock)
        })

        const deleteBtns = document.querySelectorAll('.delete')
        deleteBtns.forEach(btn => {
          btn.addEventListener('click', async () => {
            const taskId = btn.getAttribute('data-id')
            try {
              await fetch(`http://localhost:3000/list/${taskId}`, {
                method: 'DELETE'
              })
              btn.parentElement.remove()
            } catch (error) {
              console.error(error)
            }
          })
        })
        
        const completeBtns = document.querySelectorAll('.complete')
        completeBtns.forEach(btn => {
          btn.addEventListener('click', async () => {
            const taskId = btn.getAttribute('data-id')
            try {
              const response = await fetch(`http://localhost:3000/list/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ complete : 'completed' })
              })
              console.log(response)
            } catch (error) {
              console.error(error)
            }
          })
        })

      } catch (error) {
        console.error(error)
      }
    })