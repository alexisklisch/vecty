<svg width="1080" height="1080" viewBox="0 0 1080 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
  <manifest vecty>
    <variables>
      {{
        "colors": {
          "gradient1": "red",
          "gradient2": "blue"
        }
      }}
    </variables>
  </manifest>
  <defs>
    {/*Definición del gradiente diagonal */}
    <linearGradient id="fondoGradiente" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="#CA1737"/>
      <stop offset="100%" stop-color="#650B1C"/>
    </linearGradient>

    {/*Definición del filtro de sombra */}
    <filter id="sombraRoja" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="5" dy="5" stdDeviation="8" flood-color="#650B1C" flood-opacity="0.7"/>
    </filter>
  </defs>

  {/* <image href="{{expr(user$$imagenCasa), later()}}" width="1080" height="611" preserveAspectRatio="xMidYMid slice"/> */}
  <g>
    <rect y="611" width="1080" height="469" fill="#eaeaea"/> {/*Fondo blanco */}
    <g> {/*Precio */}
      <polygon points="0,545 0,706 355,706 490,545" fill={user.colors?.gradient1 || system.colors.gradient1} filter="url(#sombraRoja)"/>
      <polygon points="489.5,545 434,611 560,611" fill={user.colors?.gradient2 || system.colors.gradient2}/>
      <text
        vecty:expand
        vecty:stroke="yellow"
        font-family="Montserrat"
        vecty:font-weightweight="500"
        vecty:box-size="30 545 1370 66"
        vecty:font-size="46"
        vecty:vertical-align="bottom"
        vecty:text-transform="uppercase"
        fill="white"
      >Precio de la publicación</text>
      <poster-textbox
        poster:font-family="Montserrat"
        poster:font-weight="700"
        poster:box-size="30 610 370 95"
        poster:font-size="46"
        poster:text-transform="uppercase"
        fill="#F5F5F5"
      >USD 220.000</poster-textbox>
    </g>
  </g>
  <rect width="1080" height="1080" stroke="magenta"/>
</svg>