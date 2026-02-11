const formulario = document.querySelector("#formulario");
const selectCriptomoneda = document.querySelector("#criptomonedas");
const selectMoneda = document.querySelector("#moneda");
const resultado = document.querySelector("#resultado")

const obj = {
    moneda: "",
    criptomoneda: ""
}

const mostrarSpinner = () => {
    limpiarHTML(resultado)
    const spinner = document.createElement("DIV")
    spinner.classList.add("spinner")

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `

    resultado.appendChild(spinner)
}

const limpiarHTML = (referencia) => {
    while (referencia.firstChild) {
        referencia.removeChild(referencia.firstChild)
    }
}

const mostrarCotizacionHTML = (cotizacion) => {
    limpiarHTML(resultado)

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion

    const precio = document.createElement("P");
    precio.classList.add("precio")
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`

    const precioAlto = document.createElement("P");
    precioAlto.innerHTML = `El precio más alto del día: <span>${HIGHDAY}</span>`

    const precioBajo = document.createElement("P");
    precioBajo.innerHTML = `El precio más bajo del día: <span>${LOWDAY}</span>`

    const ultimasHoras = document.createElement("P");
    ultimasHoras.innerHTML = `Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}</span>`

    const ultimaActualización = document.createElement("P");
    ultimaActualización.innerHTML = `Última actualización: <span>${LASTUPDATE}</span>`

    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultimasHoras)
    resultado.appendChild(ultimaActualización)
}

const consultarAPI = () => {
    const { moneda, criptomoneda } = obj;
    const URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner()

    fetch(URL)
        .then(response => response.json())
        .then(data => mostrarCotizacionHTML(data.DISPLAY[criptomoneda][moneda]))
}

const mostrarAlerta = (text) => {
    const existeError = document.querySelector(".error")
    if (!existeError) {
        const divMensaje = document.createElement("DIV")
        divMensaje.classList.add("error")
        divMensaje.textContent = text

        formulario.appendChild(divMensaje)

        setTimeout(() => {
            divMensaje.remove()
        }, 3000);
    }

}

const cotizar = (e) => {
    e.preventDefault();

    if (Object.values(obj).some(valor => valor.trim() === "")) {
        mostrarAlerta("Ambos campos son obligatorios")
        return;
    }

    consultarAPI()
}

const datosBusqueda = (e) => {
    // Computed Property Names
    obj[e.target.name] = e.target.value;
}

const selectCriptomonedas = (criptomonedas) => {
    criptomonedas.forEach(cripto => {
        const { CoinInfo: { FullName, Name } } = cripto;
        const option = document.createElement("OPTION");
        option.value = Name
        option.textContent = FullName

        selectCriptomoneda.appendChild(option)
    })
}

const obtenerCriptomonedas = (criptomonedas) => {
    return new Promise(resolve => {
        resolve(criptomonedas)
    })
}

const consultarCriptomonedas = () => {
    const URL = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD"
    fetch(URL)
        .then(response => response.json())
        .then(data => obtenerCriptomonedas(data.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

document.addEventListener("DOMContentLoaded", () => {
    consultarCriptomonedas();
    selectMoneda.addEventListener("change", datosBusqueda);
    selectCriptomoneda.addEventListener("change", datosBusqueda);
    formulario.addEventListener("submit", cotizar)
});
