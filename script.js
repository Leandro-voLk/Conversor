const btn = document.getElementById("btnConverter")
const input = document.getElementById("inputValue")

const selectFrom = document.getElementById("selectFrom")
const selectTo = document.getElementById("selectTo")

const valorFrom = document.getElementById("valorFrom")
const valorTo = document.getElementById("valorTo")

const nomeFrom = document.getElementById("nomeFrom")
const nomeTo = document.getElementById("nomeTo")

const imgFrom = document.getElementById("imgFrom")
const imgTo = document.getElementById("imgTo")


/* imagens das moedas */
const imagens = {
    BRL: "./assets/brasil 2.png",
    USD: "./assets/dolar.png",
    EUR: "./assets/euro.png",
    BTC: "./assets/bitcoin 1.png"
}

/* nomes */
const nomes = {
    BRL: "Real",
    USD: "Dólar Americano",
    EUR: "Euro",
    BTC: "Bitcoin"
}


function trocarImagem(img, novaSrc) {
    img.classList.add("fade")

    setTimeout(() => {
        img.src = novaSrc
        img.classList.remove("fade")
    }, 200)
}


function atualizarVisual() {

    trocarImagem(imgFrom, imagens[selectFrom.value])
    trocarImagem(imgTo, imagens[selectTo.value])

    nomeFrom.textContent = nomes[selectFrom.value]
    nomeTo.textContent = nomes[selectTo.value]
}


function formatar(valor, moeda) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: moeda === "BTC" ? "USD" : moeda
    }).format(valor)
}


async function converter() {

    const valor = Number(input.value)
    if (!valor) return

    btn.textContent = "Convertendo..."

    const res = await fetch(`https://open.er-api.com/v6/latest/${selectFrom.value}`)
    const data = await res.json()

    const taxa = data.rates[selectTo.value]
    const resultado = valor * taxa

    valorFrom.textContent = formatar(valor, selectFrom.value)
    valorTo.textContent = formatar(resultado, selectTo.value)

    atualizarVisual()

    btn.textContent = "Converter"
}


btn.addEventListener("click", converter)

selectFrom.addEventListener("change", atualizarVisual)
selectTo.addEventListener("change", atualizarVisual)

input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") converter()
})
