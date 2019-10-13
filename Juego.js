class Juego {

  constructor() {
    this.inicializar()
    this.generarSecuencia()
    //Para que el juego no empiece repentinamente se hace un delay de 700 ms
    setTimeout(this.siguienteNivel, 700)
  }

//se oculta el boton de empezar, se empieza en nivel 1 y se guardan los colores en un objeto
  inicializar(){
    //con bind se cambia la referencia del this a otra referencia
    //se reeemplaza el this del objeto window por el this del juego
    this.siguienteNivel = this.siguienteNivel.bind(this)
    //se reeemplaza el this del div del color por el this del juego
    this.elegirColor = this.elegirColor.bind(this)
    this.inicializar = this.inicializar.bind(this)
    this.visibilidadBtnEmpezar()
    this.aciertos = 0
    this.nivel = 1
    this.visibilidadNivel()
    this.visibilidadPuntos()
    puntos.innerHTML = `Puntos: ${this.aciertos}`
    display_nivel.style.color = "white"
    display_nivel.innerHTML = `Nivel: ${this.nivel}`

    this.colores = {
      celeste,
      violeta,
      naranja,
      verde
    }

  }

  generarSecuencia(){
    //se crea un array de 10 elementos, inicializados en 0
    //fill es una función que rellena todos los elementos de un arreglo con un valor determinado
    //map retorna un nuevo array con los elementos (n) modificados
    //cada número (0 al 3) representan 4 colores diferentes
    //Math.random genera un numero aleatorio entre 0 (incluido) y 1 (excluido) (0,5 - 0.7 - 0.9)
    //para generar un número del 0 a 3 (4 colores) se lo multiplica por 4
    //Math.floor rendodea hacia abajo el número resultante (3.6 = 3)
    //para cada elemento del nuevo array se genera un número random del 1 al 3
    this.secuencia = new Array(ULTIMO_NIVEL).fill(0).map(n => Math.floor(Math.random() * 4))
  }

  visibilidadBtnEmpezar(){
    if(btnEmpezar.classList.contains('hide')){
      btnEmpezar.classList.remove('hide')
    } else{
      btnEmpezar.classList.add('hide')
    }
  }

  visibilidadNivel(){
    if(display_nivel.style.display === "block"){
      display_nivel.style.display = "none"
    } else{
      display_nivel.style.display = "block"
    }
  }

  visibilidadPuntos(){
    if(puntos.style.display === "block"){
      puntos.style.display = "none"
    } else{
      puntos.style.display = "block"
    }
  }


//cada vez que se llegue a un nuevo nivel se ilumina la secuencia
//una vez iluminado los colores se agregan los eventos de click para cada color
  siguienteNivel(){
    //empieza en 0 en cada uno de los niveles
    this.subnivel = 0
    this.iluminarSecuencia()
    this.agregarEventosClick()
  }

//recorre el array de la secuencia hasta el nivel que se encuentre el usuario
//se trasnforma un numero de la secuencia en un color, y se llama una función para que lo ilumine
  iluminarSecuencia(){
    for(let i = 0; i < this.nivel; i++){
      const color = this.transformarNumeroAcolor(this.secuencia[i])
      //1000 ms es igual a 1 segundo
      //el delay entre cada iluminación de color es de 1 segundo (0 -> 1 -> 2)
      //si no se pone un delay entonces se mostrarían todos al mismo tiempo (ya que el for se ejecuta muy rápido)
      setTimeout(() => this.iluminarColor(color), 1000 * i)
    }
  }

//se ilumina el color agregando la clase light de css(celeste.light)
//una vez iluminado, se debería apagar en un tiempo determinado (después de 350 ms)
  iluminarColor(color){
    this.colores[color].classList.add('light')
    setTimeout(() => this.apagarColor(color), 350)
  }

//se apaga el color removiendo la clase light
  apagarColor(color){
    this.colores[color].classList.remove('light')
  }

//se agrega un escuchador de eventos para cada color, mediante el evento click
//si se hace click en un color, se ejecuta la función elegirColor
  agregarEventosClick(){
    this.colores.celeste.addEventListener('click', this.elegirColor)
    this.colores.violeta.addEventListener('click', this.elegirColor)
    this.colores.naranja.addEventListener('click', this.elegirColor)
    this.colores.verde.addEventListener('click', this.elegirColor)
  }

//se elimina el escuchador de eventos para cada color
  eliminarEventosClick(){
    this.colores.celeste.removeEventListener('click', this.elegirColor)
    this.colores.violeta.removeEventListener('click', this.elegirColor)
    this.colores.naranja.removeEventListener('click', this.elegirColor)
    this.colores.verde.removeEventListener('click', this.elegirColor)
  }

//se devuelve por paráemtro ev, que contiene la información del evento ocurrido
//se obtiene el color que se eligió y el número que corresponde a ese color
//una vez apretado el color, se ilumina
  elegirColor(ev){
    const nombreColor = ev.target.dataset.color
    const numeroColor = this.transformarColorAnumero(nombreColor)
    this.iluminarColor(nombreColor)

//si el usuario eligió el color correcto del subnivel entonces se pasa al siguiente subnivel
    if(numeroColor === this.secuencia[this.subnivel]){
      this.subnivel++
      this.aciertos++
      puntos.innerHTML = `Puntos: ${this.aciertos}`

      //si se completaron todos los subniveles de un nivel se pasa de nivel
      if(this.subnivel === this.nivel){
        this.nivel++
        this.eliminarEventosClick()

        //Si llegó hasta el nivel 11 entonces ganó
        if(this.nivel === (ULTIMO_NIVEL+1)){
          display_nivel.style.color = "yellow";
          this.ganoElJuego()
        } else{
          //Después de 1,5 seg se pasa al siguiente nivel
          //no se ponen los paréntesis porque es una referencia, no se está invocando
          display_nivel.innerHTML = `Nivel: ${this.nivel}`
          setTimeout(this.siguienteNivel, 1500)
        }
      }
    } else{
      this.perdioEljuego()
    }
  }

//cada numero de la secuencia (0 al 3) corresponde a un color
  transformarNumeroAcolor(num){
    switch (num) {
      case 0:
      return 'celeste'
      case 1:
      return 'violeta'
      case 2:
      return 'naranja'
      case 3:
      return 'verde'
    }
  }

  //cada color corresponde a un numero en la secuencia
  transformarColorAnumero(color){
    switch (color) {
      case 'celeste':
      return 0
      case 'violeta':
      return 1
      case 'naranja':
      return 2
      case 'verde':
      return 3
    }
  }

//Si pierde o gana se muestra un mensaje y se muestra el boton de empezar a jugar
//como swal es una promesa y al finalizar su ejecución de forma exitosa se ejecuta la función .then
  ganoElJuego(){
    swal("¡Felicitaciones, has ganado el juego!", "Puntaje: "+this.aciertos, "success")

    .then(()=>{
      this.eliminarEventosClick()
      this.inicializar()
    })
  }

  perdioEljuego(){
    swal("Oops, has perdido :(","Puntaje: "+this.aciertos, "error")

    .then(()=>{
      this.eliminarEventosClick()
      this.inicializar()
    })
  }

}
