import { expect, test } from 'vitest'
import { XMLBuilder } from '@/utils/xmlParser/xmlBuilder'
import { SimpleXMLParser } from '@/utils/xmlParser/xmlParser';

test('Dasarma y vuelve a armar un SVG complejo', () => {

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="tiny" id="svg-root" width="100%" height="100%" viewBox="0 0 480 360"><SVGTestCase xmlns:testcase="http://www.w3.org/2000/02/svg/testsuite/description/" xmlns="http://www.w3.org/2000/02/svg/testsuite/description/" reviewed="YES" reviewer="CN" owner="SH" desc="tests support for         moveto and closepath path commands" status="accepted" version="$Revision: 1.2 $" testname="$RCSfile: paths-data-08-t.svg,v $"><OperatorScript><Paragraph>
  Verify the basic capability to handle the 'path' element, and its data attribute (d)
  in combination with the straight-line path commands.
  Two pairs of concentric equilateral triangles are drawn using 
  M and Z.  No L commands are used in this test as they are implied after
  an M or Z command.  The shapes are identical, with one stroked and
  one filled.  The fill-mode default of "even-odd" means that 
  the inner triangle is hollow.  
        </Paragraph><Paragraph>
  The rendered picture should match the reference image exactly, except for possible
  variations in the labelling text (per CSS2 rules).  
        </Paragraph><Paragraph>
  The test uses the 'path' element, as well as basic fill (solid primary colors), 
  stroke (black 1-pixel lines), font-family (Arial) and font-size properties.
        </Paragraph></OperatorScript></SVGTestCase><title id="test-title">paths-data-08-t</title><desc id="test-desc">Test that viewer has the basic capability to handle the &lt;path&gt; element and data (d) attribute in combination with the moveto and closepath commands - M and Z.</desc><g id="test-body-content"><text font-family="Arial" font-size="24" x="75" y="34">Lines drawn with commands:</text><text font-family="Arial" font-size="24" x="180" y="64">M and Z</text><g transform="scale(1.8)"><path id="Triangle_stroke_MZ" fill="none" stroke="#000000" d="   M   62.00000   56.00000    113.96152  146.00000   10.03848  146.00000    62.00000   56.00000   Z    M   62.00000  71.00000   100.97114  138.50000   23.02886  138.50000   62.00000  71.00000   Z  "/><rect x="60.00000" y="54.00000" width="4" height="4" fill="#00C000" stroke="none"/><rect x="111.96152" y="144.00000" width="4" height="4" fill="#00C000" stroke="none"/><rect x="8.03848" y="144.00000" width="4" height="4" fill="#00C000" stroke="none"/><rect x="60.00000" y="69.00000" width="4" height="4" fill="#00C000" stroke="none"/><rect x="98.97114" y="136.50000" width="4" height="4" fill="#00C000" stroke="none"/><rect x="21.02886" y="136.50000" width="4" height="4" fill="#00C000" stroke="none"/><text font-family="Arial" font-size="12" x="42" y="162">stroked</text><path id="Triangle_fill_MZ" fill="#FF0000" stroke="none" fill-rule="evenodd" d="   M  177.00000   56.00000    228.96152  146.00000   125.03848  146.00000    177.00000   56.00000   Z    M  177.00000  71.00000   215.97114  138.50000   138.02886  138.50000   177.00000  71.00000   Z  "/><rect x="175.00000" y="54.00000" width="4" height="4" fill="#00C000" stroke="none"/><rect x="226.96152" y="144.00000" width="4" height="4" fill="#00C000" stroke="none"/><rect x="123.03848" y="144.00000" width="4" height="4" fill="#00C000" stroke="none"/><rect x="175.00000" y="69.00000" width="4" height="4" fill="#00C000" stroke="none"/><rect x="213.97114" y="136.50000" width="4" height="4" fill="#00C000" stroke="none"/><rect x="136.02886" y="136.50000" width="4" height="4" fill="#00C000" stroke="none"/><text font-family="Arial" font-size="12" x="162" y="162">filled</text></g></g><text id="revision" x="10" y="340" font-size="40" stroke="none" fill="black">$Revision: 1.2 $</text><rect id="test-frame" x="1" y="1" width="478" height="358" fill="none" stroke="#000000"/></svg>`
      const parser = new SimpleXMLParser(svg)
      const jsonStructure = parser.parse()


      const builder = new XMLBuilder();
      const xmlOutput = builder.build(jsonStructure)


      expect(xmlOutput).toBe(svg)
})