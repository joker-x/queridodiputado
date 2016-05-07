$(function() {

  function dameId() {
    var id = window.location.search;
    if (id.indexOf('id=') > -1) {
      id=id.split('id=');
      id=parseInt(id[1]);
    } else {
      id=1;
    }
    return id;
  }

  function dameDestinatarios(csv) {
    var res = [];
    csv = csv.split('\n');
    for (i=0; i<csv.length; i++) {
      var dipu = csv[i].split(',');
      if (dipu.length > 1) res.push( { "twitter": dipu[0], "partido": dipu[1] } );
    }
    return res; 
  }

  function ordenarAleatorio(arreglo) {
    return arreglo.sort(function() { return 0.5 - Math.random();});
  }

  function generarMenu(menu) {
    var html = '';
    _.each(menu, function(opcion) {
      html += "\t\t"+'<li><a href="'+opcion.enlace+'">'+opcion.titulo+'</a></li>'+"\n";
    });
    return html;
  }

  function generarTweets(mensaje, hashtag, imagen, destinatarios) {
    var disponible = 140,
    voypor = 0,
    num_destinatarios = destinatarios.length,
    seleccion = '',
    html = '';

    while (voypor < num_destinatarios) {
	  disponible = 140-mensaje.length-hashtag.length-2;
	  html += "\n\t\t"+'<div class="row twit">'+
      "\n\t\t"+'<div class="col-xs-3 col-md-2"><img src="'+imagen+'"></div>'+
	  "\n\t\t"+'<div class="col-xs-9 col-md-8">';
      while ((voypor < num_destinatarios) && (disponible > destinatarios[voypor].length+2)) {
        html += '<a class="diputwi btn btn-default" href="https://twitter.com/'+destinatarios[voypor]+'" target="_blank">@'+destinatarios[voypor]+'</a> '
        seleccion += '@'+destinatarios[voypor]+' ';
        disponible -= destinatarios[voypor].length+2;
        voypor++;
      }
      html += mensaje+' #'+hashtag+'</div>'+
      "\n\t\t"+'<div class="col-xs-3 col-md-2"><a class="btn btn-danger enviar" href="https://twitter.com/intent/tweet?text='+seleccion+mensaje+'&hashtags='+hashtag+'" target="_blank">Enviar</a></div>'+
      "\n\t\t"+'</div>';
      seleccion = '';
    }

    return html;
    //$('#diputados').html(html);
  }

  function activarEnvios() {
    $('.enviar').on('click',function(e) {
      var fila = $(this).parents('.twit')
        , menciones = _.compact(fila.find('a.diputwi').text().split('@'))
        , incremento = menciones.length
        , actuales = parseInt($('.num-enviados').text())
        , dir = $(this).attr('href')
        , winTop = (screen.height / 2) - (350 / 2)
        , winLeft = (screen.width / 2) - (520 / 2);
      if (actuales == 0) {
        alert ("Twitter puede considerar como spam el simple hecho de publicar varios tweets seguidos con menciones a perfiles que no te sigan.\n\nPara evitar que suspendan tu cuenta te recomendamos espaciar los tweets enviados con menciones todo lo posible e intercalar otros tweets.\n\n¡Que no te callen!");
      }
      e.preventDefault();
      window.open (dir, 'twitter', 'top='+winTop+',left='+winLeft+',toolbar=0,status=0,width=520,height=350');
      localStorage['queridodiputado-'+dameId()] = _.concat(localStorage['queridodiputado-'+dameId()].split(','), menciones);
      $('.num-enviados').text(actuales+incremento);
      $(fila).slideUp('slow');
    });
  };

  $('.empezar').on('click', function(e) {
    localStorage.removeItem('queridodiputado-'+dameId());
    location.reload();
  });

  $.getJSON('data/'+dameId()+'.json', function(json) {
    // generamos menu
    $('#menu').prepend(generarMenu(json.menu));
    // activamos botón "ver menciones"
    $('a.hashtag').attr('href', 'https://twitter.com/search/realtime?q=%23'+json.hashtag+'&src=hash');
    // cargamos la página de intro de la campaña
    $.ajax({url: json.intro, dataType: 'text'})
    .done(function(intro) {
      $('#info').prepend(marked(intro));
    });
    // cargamos todas las listas de destinatarios
    $.when.apply($, _.map(json.listas, function(url) {
      return $.ajax(url.enlace, {dataType: 'text'});
    })).done(function() {
      var destinatarios = []
        , enviados = localStorage['queridodiputado-'+dameId()];
      // si hay más de una lista, arguments = [[data,statusText,jqXHR],...]
      if (_.isArray(arguments[0])) {
        for (var i = 0; i < arguments.length; i++) {
          destinatarios = _.concat(destinatarios, _.map(dameDestinatarios(arguments[i][0]), 'twitter'));
        }
      // si hay solo una lista, arguments = [data, statusText,jqXHR]
      } else {
          destinatarios = _.concat(destinatarios, _.map(dameDestinatarios(arguments[0]), 'twitter'));
      }
      // limpiamos repetidos
      destinatarios = _.uniq(destinatarios);
      if (enviados) {
        enviados = _.compact(enviados.split(','));
      } else {
        enviados = [];
      }
      $('.num-destinatarios').text(destinatarios.length);
      $('.num-enviados').text(enviados.length);
      var diferencia = _.difference(destinatarios, enviados);
      $('#diputados').html(generarTweets(json.mensaje, json.hashtag, json.imagen, ordenarAleatorio(diferencia)));
      localStorage['queridodiputado-'+dameId()] = enviados;
      activarEnvios();
    }).fail( function (jqXHR, status, error) {
      alert(error);
    });
  });

});

