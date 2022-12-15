const words = [
    "okno", "kiełbasa", "jądro ziemi", "banan", "naleśniki", "poziomica", "pora roku", "monitor", "słownik", "pies", "kamera", "drukarka", "jajko", "prąd elektryczny", "butelka wody", "słuchawki", "telefon", "ręka", "latarnia morska", "kieliszek wódki", "buraki", "frytki", "kotlet schabowy"
]
let randomWord = null
let wordSplit = []
let mistakes = null
let points = null
randomize()
document.querySelector("body").addEventListener("click", e => {
    if(e.target.id == "try-again-btn") {
        reset()
    }
    if(e.target.id != "letter" || e.target.className == "disabled" || mistakes >= 8 || points == wordSplit.length) {
        return 0
    }
    clickedBtn = e.target
    enteredLetter = clickedBtn.textContent
    console.log(`Clicked letter ${clickedBtn.textContent}`)
    
    const exists = wordSplit.includes(enteredLetter)
    if(exists) {
        i = 0;
        wordSplit.forEach(letter => {
            if(letter == enteredLetter) {
                console.log(`Letter ${enteredLetter} found at ${i}.`)
                document.getElementsByClassName("letter-on-display")[i].textContent = enteredLetter
                clickedBtn.className = "disabled"
                points = points+1
                if(points == wordSplit.length) {
                    console.log("Victory!!!")
                    victory()
                }
            }
            i = i+1
        });
    } else {
        console.error(`Letter ${enteredLetter} not exists`)
        clickedBtn.className = "disabled"
        updateMistakes()
        return 0
    }
})



//Functions
function createField(spacer = false) {
    const field = document.createElement("div")
    field.innerHTML = "<div>"
    field.className = spacer ? "spacer" : "letter-on-display"
    document.querySelector("#word-display").appendChild(field)
}
function randomize() {
    randomizedWord = words[Math.round((words.length - 1) * Math.random())]
    if(randomizedWord == randomWord) {
        randomize()
        return 0
    }
    randomWord = randomizedWord
    randomWord.split("").forEach(letter => {
        if(letter != " ") createField(false)
        else createField(true)
    });
    wordSplit = (randomWord.replace(/ /g, "")).split("")
    mistakes = 0
    points = 0
}
function victory() {
    i=0
    wordSplit.forEach(letter => {
        document.querySelectorAll(".letter-on-display")[i].textContent = letter
        console.log(document.querySelectorAll(".letter-on-display")[i].style.color = "#0f6")
        i=i+1
    })
    
    document.querySelector("#info-text").textContent = `Udało ci się! Gratulacje.`
    document.querySelector("#info").style.display = "flex"
}
function reset() {
    console.clear()
    console.log("Reset")
    i=null
    document.querySelector("#word-display").innerHTML = ""
    document.querySelector("#info-text").innerHTML = ""
    document.querySelector("#info").style.display = "none"
    document.querySelector("img").src = `assets/0.gif`
    document.querySelectorAll(".disabled").forEach(letterbtn => {
        letterbtn.className = "letters"
    })
    randomize()
}
function updateMistakes() {
    if(mistakes < 7) {
        console.warn(`Updated mistakes: ${mistakes} >>> ${mistakes+1}`)
        mistakes = mistakes+1
        document.querySelector("img").src = `assets/${mistakes}.gif`
        console.log(document.querySelector("img").src)
    } else {
        mistakes = mistakes+1
        document.querySelector("img").src = `assets/8.gif`
        console.error("Defeat")
        i=0
        wordSplit.forEach(letter => {
            document.querySelectorAll(".letter-on-display")[i].textContent = letter
            console.log(document.querySelectorAll(".letter-on-display")[i].style.color = "#c33")
            i=i+1
        })
        document.querySelector("#info-text").textContent = `Nie udało ci się odgadnąć hasła. Wisisz!`
        document.querySelector("#info").style.display = "flex"
    }
}

//Dev only
function dev() {
    console.log(randomWord)
}