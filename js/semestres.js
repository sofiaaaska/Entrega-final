const resumen = document.querySelector(".lead");
const tabla = document.querySelector("#mencion");
const palabreo = document.querySelector("#palabreo");

function desviacionEstandar(criterio) {
    const n = criterio.length;
    const mean = criterio.reduce((a, b) => a + b) / n;
    return Math.sqrt(criterio.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

function mediana(numbers) {
    const sorted = Array.from(numbers).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

function semetral(criterio){
    if (criterio == "2024-2"){
        return("segundo semestre del 2024");
    } else if (criterio == "2024-1"){
        return("primer semestre del 2024");
    } else if (criterio == "2023-2"){
        return("segundo semestre del 2023");
    } else if (criterio == "2023-1"){
        return("primer semestre del 2023");
    } else if (criterio == "2022-2"){
        return("segundo semestre del 2022");
    } else if (criterio == "2022-1"){
        return("primer semestre del 2022");
    } else {
        return("segundo semestre del 2021");
    }
}

async function datos(criterio) {
    var seleccion = [];
    var notas = [];
    const consulta = await fetch("https://raw.githubusercontent.com/sofiaaaska/trabajo_final/refs/heads/main/data.json");
    const data = await consulta.json();
    console.log("Lo que sigue son todos los datos:");
    console.log(data);

    data.data.titulos.forEach((d) => {
        if (d.semestre_examen == criterio) {
            seleccion.push(d);
        }
    });

    seleccion.sort(function (a, b) {
        if (a.nota_proyecto < b.nota_proyecto) {
            return 1;
        }
        if (a.nota_proyecto > b.nota_proyecto) {
            return -1;
        }
        return 0;
    });

    seleccion.forEach((s, i) => {
        if (s.repositorio_academico) {
            tabla.innerHTML += `
                    <tr><td>${s.nombre}</td><td class="d-none d-md-table-cell">${s.profe_guia}</td><td>${s.titulo_profesional}</td><td><a href="${s.repositorio_academico}" target="_blank">${s.proyecto}</a></td><td class="text-center">${s.nota_proyecto.toFixed(
                1
            ).replace(".",",")}</td></tr>`;
        } else {
            tabla.innerHTML += `<tr><td>${s.nombre}</td><td class="d-none d-md-table-cell">${s.profe_guia}</td><td>${s.titulo_profesional}</td><td>${s.proyecto}</td><td class="text-center">${s.nota_proyecto.toFixed(1).replace(".",",")}</td></tr>`;
        }
        notas.push(s.nota_proyecto);
    });

    var i = 0;
    var total = 0;
    notas.forEach((n) => {
        total += n;
        i++;
    });
    var promedio = (total / i).toFixed(1);

    console.log(promedio);

    resumen.innerHTML = `Fueron <em>${notas.length}</em> los proyectos aprobados el ${semetral(criterio)}. El promedio de las notas de aprobación fue de <em>${promedio.replace(".",",")}</em> (con una desviación estándar es de <em>${desviacionEstandar(notas).toFixed(2).replace(".",",")}</em>).`


    var words = "";
    seleccion.forEach((s) => {
        s.proyecto = s.proyecto.replace(".", "");
        s.proyecto = s.proyecto.toLowerCase();
        words = words + " " + s.proyecto;
    });
    var palabras = words.split(" ");
    palabras = palabras.sort();
    const nopalabras = [
        "",
        ":",
        "a",
        "al",
        "ante",
        "así",
        "base",
        "basado",
        "como",
        "con",
        "contra",
        "de",
        "De",
        "del",
        "dentro",
        "desde",
        "e",
        "el",
        "El",
        "en",
        "entre",
        "esta",
        "este",
        "esto",
        "estos",
        "fin",
        "hacia",
        "la",
        "las",
        "le",
        "les",
        "lo",
        "los",
        "más",
        "mediante",
        "no",
        "o",
        "para",
        "por",
        "que",
        "qué",
        "se",
        "sin",
        "sobre",
        "son",
        "su",
        "sus",
        "tanto",
        "través",
        "un",
        "una",
        "unas",
        "unos",
        "vez",
        "y",
        "Una",
        "bajo",
        "partir",
        "puesta",
    ];
    const sacaPalabras = (arreglo, sacar) => {
        return arreglo.filter((palabra) => {
            return !sacar.includes(palabra);
        });
    };
    var palabrasAcotadas = sacaPalabras(palabras, nopalabras);
    const cuentaRepeticiones = (arreglo = []) => {
        const resultado = [];
        arreglo.forEach((el) => {
            const index = resultado.findIndex((obj) => {
                return obj["name"] === el;
            });
            if (index === -1) {
                resultado.push({
                    name: el,
                    count: 1,
                });
            } else {
                resultado[index]["count"]++;
            }
        });
        return resultado;
    };
    var total = cuentaRepeticiones(palabrasAcotadas);
    var texto = "";
    total.forEach((x) => {
        if (x.count > 2) {
            texto = texto + `<span class="badge text-bg-primary">${x.name}</span> `;
        }
    });
    if (texto) {
        palabreo.innerHTML = `<p>Se revisan los nombres de los proyectos en el grupo buscando palabras repetidas dos veces o más (omitiendo artículos, adverbios, preposiciones y conjunciones). El resultado:</p>
                        <p>${texto}</p>`;
    } else {
        palabreo.innerHTML = `<p>Se revisan los nombres de los proyectos en el grupo, pero <em>no</em> se encuentran palabras repetidas.</p>`;
    }
}

datos("2024-2").catch((error) => console.error(error));

document.querySelectorAll("select")[0].addEventListener("change", (event) => {
    tabla.innerHTML = " ";
    palabreo.innerHTML = " ";
    console.clear();
    var seleccion = [];
    var notas = [];
    datos(event.target.value).catch((error) => console.error(error));
});
