const INPUTmail = document.querySelector("#email")
const INPUTpass = document.querySelector("#password")

// ---------------------------------------------SIGN UP  

document.querySelector("#signup")
    .addEventListener("click", () => signup() )
    
function signup() {
    fetch("/signup", {
        method: 'POST',
        body: JSON.stringify( {email: INPUTmail.value, pass: INPUTpass.value} ),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.status == 200){
            alert(data.data)
            setTimeout(window.location.href = data.url, 1500)
        }
        if (data.status == 400){
            alert(data.data + ". Redirecting to login")
            setTimeout(window.location.href = data.url, 1500)
        }
        if (data.status == 406){
            alert(data.data)
        }
        if (data.status == 500){
            alert(data.data)
        }
    })
    .catch(err => console.log("Internal server error. Sorry :(", err))
}


    document.querySelector("#login")
    .addEventListener("click", () => window.location.href = "/login" )


// ------------------------------------------------PRUEBAS PREVIAS

    // http://127.0.0.1:8080/Public/login.html
    // /login
    // /signup

    // .then(res => {
    //     if (res.status == 200) {
    //         console.log("Nicely done")
    //         setTimeout(() => window.location.href = "/login.html", 1000)
    //     } else if (res.status == 400) {
    //         console.log("You exist")
    //         setTimeout(() => window.location.href = "/login", 1000)
    //     } else if (res.status == 406) {
    //         console.log(res.status)
    //     } else if (res.status == 500) {
    //         console.log(res.status)
    //     }
    // })
    // .then(async res => {
    //     if (res.status == 400) {
    //         const data = await res.json();
    //         return {status: res.status, objectResponse: data}
    //     }
    // })
    // .then(data => {
    //     console.log(data.objectResponse.url);
    //     //window.location.href = data.objectResponse.url;
    //     // if (data.status == 400) {
    //     // }
    // })