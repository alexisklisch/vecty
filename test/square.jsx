<svg
  width="1080"
  height="1080"
  viewBox="0 0 1080 1080"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
>
  <vecty:variables content={{
    colors: {
      primary: {
        50: "#FCE8EC",
        100: "#FAD6DC",
        200: "#F5A8B6",
        300: "#F07F94",
        400: "#EC5671",
        500: "#E7284B",
        600: "#CA1737",
        700: "#97112A",
        800: "#650B1C",
        900: "#32060E",
        950: "#1B0308"
      },
      secondary: {
        50: "#FDF5E3",
        100: "#FAEAC2",
        200: "#F5D789",
        300: "#F0C24B",
        400: "#EDB322",
        500: "#CF9911",
        600: "#A57A0E",
        700: "#7A5B0A",
        800: "#553F07",
        900: "#2A1F04",
        950: "#130E02"
      },
      grey: {
        0: "#F1F1F1",
        50: "#F5F5F5",
        100: "#EBEBEB",
        200: "#D9D9D9",
        300: "#C5C5C5",
        400: "#A8A8A8",
        500: "#8C8C8C",
        600: "#707070",
        700: "#545454",
        800: "#383838",
        900: "#1C1C1C",
        950: "#0F0F0F"
      },
      green: {
        50: "#E1FFF6",
        100: "#C3FEEC",
        200: "#81FDD8",
        300: "#45FCC5",
        400: "#09FBB3",
        500: "#03BF86",
        600: "#02825C",
        700: "#015F43",
        800: "#01412E",
        900: "#001E15",
        950: "#000F0B"
      }
    },
    text: {
      operation: {
        type: user?.text?.operation?.type || "Negociación",
        price: user?.text?.operation?.price || "Consultar"
      },
      title: "Excelente oportunidad para aprovechar",
      typology: user?.text?.typology || "Propiedad",
      contact: {
        phone: user?.text?.contact?.phone || "¡Contactame ahora mismo!",
        email: user?.text?.contact?.email || "Vamos a conseguir el mejor precio"
      }
    },
    imgs: {
      logoFlyers: "...base64-logo"
    }
  }} />

  <vecty:metadata content={{
    author: 'Alexis Fleitas Klisch',
    version: '0.0.1'
  }} />
  <defs>
    {/*Definición del gradiente diagonal */}
    <linearGradient id="fondoGradiente" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color={user.colors?.main || template.colors.primary[600]} />
      <stop offset="100%" stop-color={user.colors?.mainDarker || template.colors.primary[800]} />
    </linearGradient>

    {/*Definición del filtro de sombra */}
    <filter id="sombraRoja" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="5" dy="5" stdDeviation="8" flood-color="#650B1C" flood-opacity="0.7" />
    </filter>
  </defs>

  <image xlink:href={user.imgs.property[0]} width="1080" height="611" preserveAspectRatio="xMidYMid slice" />
  <g>
    <rect y="611" width="1080" height="469" fill="#eaeaea" /> {/*Fondo blanco */}
    <g> {/*Precio */}
      <polygon points="0,545 0,706 355,706 490,545" fill={user.colors?.main || template.colors.primary[600]} filter="url(#sombraRoja)" />
      <polygon points="489.5,545 434,611 560,611" fill={user.colors?.mainDarker || template.colors.primary[800]} />
      <plugin:text
        font-family="Rubik"
        font-weight="500"
        font-size="20"
        text-align="left"
        vertical-align="bottom"
        text-transform="uppercase"
        box="30 538 370 66"
        fill={template.colors.grey[0]}
      >Precio de la publicación</plugin:text>
      <plugin:text
        font-family="Rubik"
        font-weight="700"
        box="30 620 370 95"
        font-size="46"
        text-transform="uppercase"
        fill={template.colors.grey[0]}
      >{user.text?.operation?.price
        ? user.text?.operation?.price
        : template.text?.operation?.price
        }</plugin:text>
    </g>

    <g> {/* Info izquierda */}
      <plugin:text
        font-family="Rubik"
        font-weight="600"
        box="30 748 470 65"
        font-size="30"
        line-height="5"
        fill="#383838"
      >{user.text?.title || template.text?.title}
      </plugin:text>

      <g> {/* Features */}

        {
          {
            tag: 'g',
            children: user.text.features.map((current, index) => {
              // Distribuye las features en un array
              const x = index % 2 === 0 ? 34 : 290;
              const initialYExe = 856
              const y = index < 2 ? initialYExe : initialYExe + 42;
              const text = current;
              const radius = 6;
              return ({
                tag: 'g',
                attr: {},
                children: [
                  {
                    tag: 'circle',
                    attr: { cx: `${x}`, cy: `${y}`, r: `${radius}`, fill: template.colors.primary[600] },
                    children: []
                  },
                  {
                    tag: 'plugin:text',
                    attr: {
                      "font-family": 'Rubik',
                      "font-weight": "400",
                      "box": `${x + 17} ${y - 10} 225 26`,
                      "font-size": "26",
                      fill: "#383838"
                    },
                    children: [{ text }]
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
          fill={template.colors.primary[600]} />

        <plugin:text

          font-family="Rubik"
          font-weight="700"
          box="105 945 400 20"
          font-size="20"
          text-transform="uppercase"
          fill={template.colors.primary[900]}
        >¿Te interesa esta propiedad?</plugin:text>

        <plugin:text

          font-family="Rubik"
          font-weight="700"
          box="105 975 400 28"
          font-size="28"
          fill="#0F0F0F"
        >{template.text.contact.phone}</plugin:text>

        <plugin:text

          font-family="Rubik"
          font-weight="400"
          box="105 1010 800 28"
          font-size="28"
          fill="#0F0F0F"
        >{template.text.contact.email}
        </plugin:text>
      </g>
    </g>

    <g> {/* Info derecha */}
      <polygon points="434,610 700,1080 1080,1080 1080,610" fill="url(#fondoGradiente)" />

      <g> {/* Logo inmobiliaria */}
        <circle cy="618" cx="900" r="100" fill="#F5F5F5" />
        {/*Containe image*/}
        <image href={user.imgs.realEstateLogo || user.imgs.brand.flyers} x="830" y="550" width="140" height="140" />
      </g>

      <g> {/* Tipo de casa y operación */}
        <plugin:text
          font-family="Rubik"
          text-align="center"
          font-weight="500"
          text-transform="uppercase"
          box=`636 760 400 ${(function () {
            const dataMaster = user.text.typology ? user : template
            if (dataMaster.text.typology.length > 5) return 80
            return 40
          })()}`
        font-size="46"
        fill={template.colors.grey[50]}
        >{`${user.text?.typology || template.text?.typology} en`}
      </plugin:text>

      <plugin:text
        font-family="Rubik"
        text-align="center"
        font-weight="900"
        text-transform="uppercase"
        box=`636 ${(function () {
          const dataMaster = user.text.typology ? user : template
          if (dataMaster.text.typology.length > 5) return 850
          return 808
        })()} 400 120`
      font-size={template.text.operation.type.length > 5 ? "46" : "78"}
      fill={template.colors.grey[50]}
        >{user.text?.operation?.type || template.text?.operation?.type}
    </plugin:text>
  </g>
</g>
  </g >
</svg >