

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



const imagens = {
    BRL: "./assets/brasil 2.png",
    USD: "./assets/dolar.png",
    EUR: "./assets/euro.png",
    BTC: "./assets/bitcoin.png"
}

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

    /* Bitcoin personalizado */
    if (moeda === "BTC") {
        return "₿ " + valor.toFixed(6)
    }

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: moeda
    }).format(valor)
}




async function getFiatRate(from, to) {
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`)
    const data = await res.json()
    return data.rates[to]
}

async function getBtcRate(from, to) {

    const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,brl,eur"
    )

    const data = await res.json()
    const btc = data.bitcoin

    const rates = {
        BTC: 1,
        USD: btc.usd,
        BRL: btc.brl,
        EUR: btc.eur
    }

    return rates[to] / rates[from]
}




async function converter() {

    const valor = Number(input.value)

    if (!valor) {
        valorFrom.textContent = formatar(0, selectFrom.value)
        valorTo.textContent = formatar(0, selectTo.value)
        return
    }

    btn.textContent = "Convertendo..."

    let taxa

    try {

        /* se tiver bitcoin usa coingecko */
        if (selectFrom.value === "BTC" || selectTo.value === "BTC") {
            taxa = await getBtcRate(selectFrom.value, selectTo.value)
        }

        /* senão usa fiat */
        else {
            taxa = await getFiatRate(selectFrom.value, selectTo.value)
        }

        const resultado = valor * taxa

        valorFrom.textContent = formatar(valor, selectFrom.value)
        valorTo.textContent = formatar(resultado, selectTo.value)

        atualizarVisual()

    } catch (e) {
        console.error(e)
        valorTo.textContent = "Erro"
    }

    btn.textContent = "Converter"
}




btn.addEventListener("click", converter)


input.addEventListener("input", converter)


selectFrom.addEventListener("change", () => {
    atualizarVisual()
    converter()
})

selectTo.addEventListener("change", () => {
    atualizarVisual()
    converter()
})



atualizarVisual()
