export const evaluateExpression = (condition: string, context: Record<string, any>, currentVariant?: string) => {
  try {
    // Función auxiliar para extraer variables de la condición
    function extractVariables(expression: string) {
      // Busca identificadores válidos que no sean palabras reservadas
      const regex = /[a-zA-Z_$][a-zA-Z0-9_$]*/g;
      const reservedWords = new Set([
        'true', 'false', 'null', 'undefined', 'return', 'if',
        'else', 'var', 'let', 'const', 'function', 'new'
      ]);

      const matches = expression.match(regex) || [];
      return [...new Set(matches)].filter(word => !reservedWords.has(word));
    }
    // Extraer todas las variables usadas en la condición
    const usedVariables = extractVariables(condition)

    // Crear un nuevo contexto que incluya todas las variables necesarias
    const fullContext: Record<string, any> = {};
    for (const variable of usedVariables) {
      // Si la variable existe en el contexto original, usa ese valor
      // Si no existe, la establece como undefined
      fullContext[variable] = context.hasOwnProperty(variable) ? context[variable] : undefined;
    }
    const assignable = new Assignable({ currentVariant, variables: fullContext });
    fullContext.$assign = assignable.$assign.bind(assignable)

    // Creamos una nueva función con el contexto completo
    const fn = new Function(
      ...Object.keys(fullContext),
      `return ${condition};`
    )

    return fn(...Object.values(fullContext));
  } catch (error) {
    console.error(`Error evaluando la condición: ${condition}`, error);
    return undefined;
  }
}

class Assignable {
  [key: string]: any;

  constructor({ currentVariant, variables }: { currentVariant?: string, variables?: Record<string, any> }) {
    this.currentVariant = currentVariant || undefined
    this.variables = variables || {}
  }

  $assign(
    attributes: Record<string, any>,
    defaultValue: any,
    currentVariant: string | undefined = this.currentVariant,
    variables: Record<string, any> = this.variables
  ) {
    Object.assign(this, variables);
    return this.currentVariant
      ? attributes[currentVariant] || defaultValue
      : defaultValue

  }
}