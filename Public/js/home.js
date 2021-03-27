const DATAbox = document.querySelector("#dataBox")

// ----------------------------------------------------------PRIVATE

document.querySelector("#private")
    .addEventListener("click", () => readPriv() )
    
function readPriv() {
    if ( DATAbox.classList.contains("dissap") ) {
        fetch("/private", {
            headers: {
                'authorization': `Bearer: ${sessionStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.status == 200){
                printData(data.data)
            }
            if (data.status == 401){
                alert(data.data)
                setTimeout(window.location.href = data.url, 1500)
            }
            if (data.status == 500){
                alert(data.data)
            }
        })
        .catch(err => console.log("Internal server error. Sorry :(", err))
    }
}

function printData(data) {
    let mail = document.createElement("p")
    let mailCon = document.createTextNode(`Mail: ${data.email}`)
    mail.appendChild(mailCon)
    DATAbox.appendChild(mail)
    
    let pass = document.createElement("p")
    let passCon = document.createTextNode(`Password: ${data.pass}`)
    pass.appendChild(passCon)
    DATAbox.appendChild(pass)
    
    // let br = document.createElement("br")
    // DATAbox.appendChild(br)

    // let secret = document.createElement("p")
    // let secretCon = document.createTextNode(`Secret: ${data.secret}`)
    // secret.appendChild(secretCon)
    // DATAbox.appendChild(secret)

    DATAbox.classList.remove("dissap")
}

// ----------------------------------------------------------LOGOUT

document.querySelector("#logout")
    .addEventListener("click", () => logout() )
    
function logout() {
    fetch("/logout", {
        method: 'PUT',
        headers: {
            'authorization': `Bearer: ${sessionStorage.getItem('token')}`
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.status == 200){
            alert(data.data)
            setTimeout(window.location.href = data.url, 1500)
        }
        if (data.status == 400){
            alert(data.data)
            setTimeout(window.location.href = data.url, 1500)
        }
        if (data.status == 401){
            alert(data.data)
            setTimeout(window.location.href = data.url, 1500)
        }
        if (data.status == 500){
            alert(data.data)
        }
    })
    .catch(err => console.log("Internal server error. Sorry :(", err))
}

// ----------------------------------------------------------DELETE

document.querySelector("#erase")
    .addEventListener("click", () => erase() )
    
function erase() {
    fetch("/delete", {
        method: 'DELETE',
        headers: {
            'authorization': `Bearer: ${sessionStorage.getItem('token')}`
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.status == 200){
            alert(data.data)
            setTimeout(window.location.href = data.url, 1500)
        }
        if (data.status == 401){
            alert(data.data)
            setTimeout(window.location.href = data.url, 1500)
        }
        if (data.status == 500){
            alert(data.data)
        }
    })
    .catch(err => console.log("Internal server error. Sorry :(", err))
}
