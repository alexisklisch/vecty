<svg width="1080" height="1080" viewBox="0 0 1080 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
  <manifest vecty>
    <variables>
      {
        {
          "colors": {
            "primary": {
              "50": "#FCE8EC",
              "100": "#FAD6DC",
              "200": "#F5A8B6",
              "300": "#F07F94",
              "400": "#EC5671",
              "500": "#E7284B",
              "600": "#CA1737",
              "700": "#97112A",
              "800": "#650B1C",
              "900": "#32060E",
              "950": "#1B0308"
            },
            "secondary": {
              "50": "#FDF5E3",
              "100": "#FAEAC2",
              "200": "#F5D789",
              "300": "#F0C24B",
              "400": "#EDB322",
              "500": "#CF9911",
              "600": "#A57A0E",
              "700": "#7A5B0A",
              "800": "#553F07",
              "900": "#2A1F04",
              "950": "#130E02"
            },
            "grey": {
              "0": "#F1F1F1",
              "50": "#F5F5F5",
              "100": "#EBEBEB",
              "200": "#D9D9D9",
              "300": "#C5C5C5",
              "400": "#A8A8A8",
              "500": "#8C8C8C",
              "600": "#707070",
              "700": "#545454",
              "800": "#383838",
              "900": "#1C1C1C",
              "950": "#0F0F0F"
            },
            "green": {
              "50": "#E1FFF6",
              "100": "#C3FEEC",
              "200": "#81FDD8",
              "300": "#45FCC5",
              "400": "#09FBB3",
              "500": "#03BF86",
              "600": "#02825C",
              "700": "#015F43",
              "800": "#01412E",
              "900": "#001E15",
              "950": "#000F0B"
            }
          },
          "publication": {
            "operation": {
              "type": "Venta",
              "price": "Consultar"
            }
          }
        }
      }
    </variables>
  </manifest>
  <defs>
    {/*Definición del gradiente diagonal */}
    <linearGradient id="fondoGradiente" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color={user.colors?.main || system.colors.primary[600]}/>
      <stop offset="100%" stop-color={user.colors?.mainDarker || system.colors.primary[800]}/>
    </linearGradient>

    {/*Definición del filtro de sombra */}
    <filter id="sombraRoja" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="5" dy="5" stdDeviation="8" flood-color="#650B1C" flood-opacity="0.7"/>
    </filter>
  </defs>

  <image href={user.imgs.photo} width="1080" height="611" preserveAspectRatio="xMidYMid slice"/>
  <g>
    <rect y="611" width="1080" height="469" fill="#eaeaea"/> {/*Fondo blanco */}
    <g> {/*Precio */}
      <polygon points="0,545 0,706 355,706 490,545" fill={user.colors?.main || system.colors.primary[600]} filter="url(#sombraRoja)"/>
      <polygon points="489.5,545 434,611 560,611" fill={user.colors?.mainDarker || system.colors.primary[800]}/>
      <text
        vecty:expand
        font-family="Montserrat"
        font-weight="500"
        font-size="20"
        vecty:text-align="left"
        vecty:vertical-align="bottom"
        vecty:text-transform="uppercase"
        vecty:box="30 545 370 66"
        fill={system.colors.grey[0]}
      >Precio de la publicación</text>
      <text
        vecty:expand
        font-family="Montserrat"
        font-weight="700"
        vecty:box="30 610 370 95"
        font-size="46"
        vecty:text-transform="uppercase"
        fill={system.colors.grey[0]}
      >{user.publication?.operation?.price && user.publication?.operation?.currency
        ? `${user.publication.operation.currency} ${(user.publication.operation.price).toLocaleString('es-AR')}`
        : system.publication.operation.price
      }</text>
    </g>

    <g> {/* Info izquierda */}
      <text
        vecty:expand
        font-family="Montserrat"
        font-weight="600"
        vecty:box="30 730 470 65"
        font-size="30"
        vecty:line-height="5"
        fill="#383838"
      >Departamento en venta - 3 ambientes - Financiamiento
      </text>

      <g> {/* Features */}

        {
          {
            tag: 'g',
            attr: {},
            children: user.features.map((current, index) => {
              // Distribuye las features en un array
              const x = index % 2 === 0 ? 30 : 290;
              const y = index < 2 ? 846 : 896;
              const text = current;
              const radius = 6;
              return ({
                tag: 'g',
                attr: {},
                children: [
                  {
                    tag: 'circle',
                    attr: {cx: `${x}`, cy: `${y}`, r: `${radius}`, fill: system.colors.primary[600]},
                    children: []
                  },
                  {
                    tag: 'text',
                    attr: {
                      "vecty:expand": '',
                      "font-family": 'Montserrat',
                      "font-weight": "400",
                      "vecty:box": `${x + 17} ${y - 16} 225 26`,
                      "font-size": "26",
                      fill: "#383838"
                    },
                    children: [{text}]
                  }
                ]
              })
            })
          }
          
        }

      </g>

      <g> {/* Footer left */}
        <path
          d="M0.999418 0.755397C0.990502 0.823149 0.957228 0.885339 0.905811 0.930352C0.854394 0.975365 0.788349 1.00012 0.720013 1C0.323006 1 4.5244e-07 0.676996 4.5244e-07 0.279993C-0.000122049 0.211656 0.0246352 0.145612 0.0696483 0.0941956C0.114661 0.0427787 0.176852 0.00950531 0.244605 0.000589888C0.261738 -0.00150209 0.279088 0.002003 0.294065 0.0105819C0.309042 0.0191608 0.320843 0.0323534 0.327706 0.0481903L0.433308 0.283943V0.284543C0.438562 0.296665 0.440732 0.309901 0.439624 0.323067C0.438516 0.336233 0.434165 0.348919 0.426958 0.359993C0.426058 0.361343 0.425108 0.362593 0.424108 0.363843L0.320006 0.487245C0.357457 0.563345 0.437058 0.642246 0.514159 0.679796L0.635861 0.576245C0.637057 0.575241 0.638309 0.574306 0.639611 0.573445C0.650676 0.566066 0.663407 0.561561 0.676651 0.560338C0.689894 0.559116 0.703234 0.561215 0.715463 0.566445L0.716113 0.566745L0.951667 0.672296C0.967532 0.679135 0.980757 0.690926 0.989364 0.705905C0.997971 0.720884 1.0015 0.738247 0.999418 0.755397Z"
          transform="translate(30,970) scale(42)"
          fill={system.colors.primary[600]}/>

        <text
          vecty:expand
          font-family="Montserrat"
          font-weight="700"
          vecty:box="105 945 400 20"
          font-size="20"
          vecty:text-transform="uppercase"
          fill={system.colors.primary[900]}
        >¿Te interesa esta propiedad?</text>

        <text
          vecty:expand
          font-family="Montserrat"
          font-weight="700"
          vecty:box="105 975 400 28"
          font-size="28"
          fill="#0F0F0F"
        >+5411 2456 4562</text>

        <text
          vecty:expand
          font-family="Montserrat"
          font-weight="400"
          vecty:box="105 1010 800 28"
          font-size="28"
          fill="#0F0F0F"
        >inmobiliariapredrito@gmail.com
        </text>
      </g>
    </g>

    <g> {/* Info derecha */}
      <polygon points="434,610 700,1080 1080,1080 1080,610" fill="url(#fondoGradiente)"/>
      
      <g> {/* Logo inmobiliaria */}
        <circle cy="618" cx="900" r="100" fill="#F5F5F5"/>
        <rect y="550" x="830" width="140" height="140" fill="{{expr('lime'), later()}}" stroke="red" />
      </g>

      <g> {/* Tipo de casa y operación */}
        <text
          vecty:expand
          font-family="Montserrat"
          vecty:text-align="center"
          font-weight="500"
          vecty:text-transform="uppercase"
          vecty:box="650 780 360 50"
          font-size="46"
          fill={system.colors.grey[50]}
        >Casa en
        </text>
        <text
          vecty:expand
          font-family="Montserrat"
          vecty:text-align="center"
          font-weight="900"
          vecty:text-transform="uppercase"
          vecty:box="650 830 360 78"
          font-size="78"
          fill={system.colors.grey[50]}
        >Venta
        </text>
      </g>
    </g> 
  </g>
  <rect width="1080" height="1080" stroke="magenta"/>
</svg>