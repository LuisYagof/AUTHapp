const INPUTmail = document.querySelector("#email")
const INPUTpass = document.querySelector("#password")

// ---------------------------------------------SIGN UP  

// http://127.0.0.1:8080/Public/login.html

document.querySelector("#signup")
    .addEventListener("click", () => signup() )
    
    function signup() {
        fetch("http://127.0.0.1:8080/signup", {
            method: 'POST',
            body: JSON.stringify({email: INPUTmail.value, pass: INPUTpass.value}),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => {
            if (res.status == 200) {
                console.log("Nicely done")
                setTimeout(() => window.location.href = "http://127.0.0.1:8080/Public/login.html", 1000)
            } else if (res.status == 400) {
                console.log("You exist")
                setTimeout(() => window.location.href = "http://127.0.0.1:8080/Public/login.html", 1000)
            } else if (res.status == 406) {
                console.log(res.status)
            } else if (res.status == 500) {
                console.log(res.status)
            }
        })
        .catch(err => console.log("Internal server error. Sorry :(", err))
}


document.querySelector("#login")
    .addEventListener("click", () => window.location.href = "http://127.0.0.1:8080/Public/login.html" )