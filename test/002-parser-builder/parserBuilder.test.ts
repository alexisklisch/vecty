import { expect, test } from 'vitest'
import { XMLBuilder } from '../../src/utils/xmlParser/xmlBuilder'
import { SimpleXMLParser } from '../../src/utils/xmlParser/xmlParser';

test('Dasarma y vuelve a armar un SVG complejo', () => {

      const svg = `<div>
  {/* Ejemplo de texto simple */}
  <h1>¡Hola, Mundo!</h1>

  {/* Ejemplo de párrafo */}
  <p>Este es un párrafo de texto con algo de información.</p>

  {/* Ejemplo de lista desordenada */}
  <ul>
    <li>Elemento 1</li>
    <li>Elemento 2</li>
    <li>Elemento 3</li>
  </ul>

  {/* Ejemplo de lista ordenada */}
  <ol>
    <li>Primer paso</li>
    <li>Segundo paso</li>
    <li>Tercer paso</li>
  </ol>

  {/* Ejemplo de un enlace */}
  <a href="https://www.ejemplo.com" target="_blank" rel="noopener noreferrer">
    Visitar Ejemplo.com
  </a>

  {/* Ejemplo de una imagen (asegúrate de tener la ruta correcta) */}
  <img src="/ruta/a/tu/imagen.jpg" alt="Descripción de la imagen" />

  {/* Ejemplo de un input de texto */}
  <input type="text" placeholder="Escribe algo aquí" />

  {/* Ejemplo de un botón */}
  <button onClick={() => alert('¡Botón clickeado!')}>Haz clic</button>

  {/* Ejemplo de un div con estilos en línea */}
  <div style={{ backgroundColor: 'lightblue', padding: '10px', borderRadius: '5px' }}>
    Este div tiene estilos en línea.
  </div>

  {/* Ejemplo de un fragmento (para agrupar elementos sin un nodo padre extra) */}
  <>
    <p>Este es el primer elemento en el fragmento.</p>
    <p>Este es el segundo elemento en el fragmento.</p>
  </>

  {/* Ejemplo de un componente personalizado (asumiendo que ya está definido) */}
  <MiComponente nombre="Usuario" />

  {/* Ejemplo de renderizado condicional */}
  {true ? <p>Este texto se muestra porque la condición es verdadera.</p> : <p>Este texto no se muestra.</p>}

  {/* Otro ejemplo de renderizado condicional con && */}
  {false && <p>Este texto tampoco se muestra.</p>}

  {/* Ejemplo de renderizado de una lista de datos */}
  <ul>
    {['Manzana', 'Banana', 'Naranja'].map((fruta, index) => (
      <li key={index}>{fruta}</li>
    ))}
  </ul>
</div>`
      const parser = new SimpleXMLParser(svg)
      const jsonStructure = parser.parse()
      console.log('JSON -> ', JSON.stringify(jsonStructure, null, 2))


      const builder = new XMLBuilder();
      const xmlOutput = builder.build(jsonStructure)


      expect(xmlOutput).toBe(svg)
})