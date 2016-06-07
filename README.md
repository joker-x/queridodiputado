# queridodiputado

Herramienta para la interpelación colectiva y distribuida de parlamentarios con menciones en twitter.

Se aplicó por primera vez para la convocatoria 25S "Rodea el congreso": [Hackeo al Congreso|lavanguardia.com](http://blogs.lavanguardia.com/guerreros-del-teclado/hackeo-al-congreso-12)

Posteriormente también se utilizó para promover la ILP de la PAH: [europapress.es](http://www.europapress.es/nacional/noticia-partidarios-dacion-pago-toman-redes-sociales-instando-diputados-pp-ciu-upn-apoyar-iniciativa-20130211132907.html)

## Estructura de directorios

```
├── data
│   ├── 1.json
│   ├── img
│   │   └── leoncito.png
│   ├── listas
│   │   ├── congreso.csv
│   │   └── prueba.csv
│   └── paginas
│       └── intro.md
├── index.html
```

Dentro del directorio *data* se encuentran los archivos json que personalizan la campaña.
Al abrir index.html?id=1 cargará el archivo data/1.json y así sucesivamente.

```
{
  "mensaje": "¿Votará usted a favor de la ILP o nos obliga a señalarlo como culpable?",
  "hashtags": ["ILPoAlaCalle", "GenocidioFinanciero"],
  "imagen": "data/img/leoncito.png",
  "intro": "data/paginas/intro.md",
  "menu": [{
    "titulo": "PAH",
    "enlace": "http://afectadosporlahipoteca.com"
  },{
    "titulo": "Oiga.me",
    "enlace": "https://oiga.me/es/campaigns/exige-al-pp-que-vote-a-favor-de-la-ilp-contra-los-desahucios"
  }],
  "listas": [{
    "titulo": "Congreso de los Diputados",
    "enlace": "data/listas/congreso.csv"
  }]
}
``` 

El texto de presentación de la campaña se carga desde un archivo con formato markdown.

Soporta tantas listas de destinatarios como quieras, cada una de ellas consiste en un archivo .csv
(separado por comas) con el twitter y el partido al que pertenece.



