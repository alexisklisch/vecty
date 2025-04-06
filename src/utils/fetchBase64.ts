export async function fetchBase64(input: string) {
  // Fetch para URL remotas
  const response = await fetch(input);
  if (!response.ok) throw new Error('Error al cargar la imagen');
  const contentType = response.headers.get('content-type');
  const buffer = await response.arrayBuffer();


  const base64String = Buffer.from(buffer).toString('base64');
  return `data:${contentType};base64,${base64String}`;
}