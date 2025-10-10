const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'b',
  'strong',
  'i',
  'em',
  'u',
  's',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'ul',
  'ol',
  'li',
  'a',
  'span',
  'div',
  'hr',
  'pre',
  'code',
])

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel']),
  span: new Set(['class', 'style']),
  p: new Set(['class', 'style']),
  div: new Set(['class', 'style']),
  pre: new Set(['class']),
  code: new Set(['class']),
  h1: new Set(['class', 'style']),
  h2: new Set(['class', 'style']),
  h3: new Set(['class', 'style']),
  h4: new Set(['class', 'style']),
  h5: new Set(['class', 'style']),
  h6: new Set(['class', 'style']),
  '*': new Set(['class']),
}

const SAFE_CSS_PROPS = new Set([
  'color',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'text-align',
  'line-height',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'text-decoration',
  'background-color',
])

function stripDangerousStyles(styleValue: string): string {
  return styleValue
    .split(';')
    .filter((declaration) => {
      const [prop, value] = declaration.split(':').map((s) => s.trim())
      if (!prop || !value) return false

      const normalizedProp = prop.toLowerCase()

      // Block Tailwind CSS variables and other unsafe properties
      if (
        normalizedProp.startsWith('--tw-') ||
        normalizedProp.startsWith('--') ||
        !SAFE_CSS_PROPS.has(normalizedProp)
      ) {
        return false
      }

      // Block dangerous value patterns
      const normalizedValue = value.toLowerCase()
      if (
        normalizedValue.includes('expression(') ||
        normalizedValue.includes('javascript:') ||
        normalizedValue.includes('data:text/html') ||
        normalizedValue.includes('data:application/')
      ) {
        return false
      }

      return true
    })
    .join('; ')
    .trim()
}

function stripDangerousAttributes(el: HTMLElement) {
  // Process and clean style attribute
  if (el.hasAttribute('style')) {
    const currentStyle = el.getAttribute('style') || ''
    const cleanedStyle = stripDangerousStyles(currentStyle)

    if (cleanedStyle) {
      el.setAttribute('style', cleanedStyle)
    } else {
      el.removeAttribute('style')
    }
  }

  // Remove data-* and --tw-* attributes
  Array.from(el.attributes).forEach((attr) => {
    if (attr.name.startsWith('data-') || attr.name.startsWith('--tw-') || attr.name.startsWith('--')) {
      el.removeAttribute(attr.name)
    }
  })
}

function isAllowedAttr(tag: string, attr: string): boolean {
  const normalizedTag = tag.toLowerCase()
  const normalizedAttr = attr.toLowerCase()

  return ALLOWED_ATTRS[normalizedTag]?.has(normalizedAttr) ?? (false || ALLOWED_ATTRS['*'].has(normalizedAttr))
}

export function decodeHtml(input: string, maxPasses = 5): string {
  // Only decode entities, not tags
  const el = document.createElement('textarea')
  el.innerHTML = input
  return el.value || el.textContent || input
}

export function sanitizeHtml(html: string): string {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    const traverse = (node: Node) => {
      if (node.nodeType === Node.COMMENT_NODE) {
        node.parentNode?.removeChild(node)
        return
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement
        const tag = el.tagName.toLowerCase()

        if (!ALLOWED_TAGS.has(tag)) {
          const text = doc.createTextNode(el.textContent || '')
          el.parentNode?.replaceChild(text, el)
          return
        }

        Array.from(el.attributes).forEach((attr) => {
          const name = attr.name.toLowerCase()
          if (!isAllowedAttr(tag, name)) {
            el.removeAttribute(attr.name)
            return
          }
        })

        if (tag === 'a') {
          if (!el.getAttribute('rel')) el.setAttribute('rel', 'noopener noreferrer')
          if (!el.getAttribute('target')) el.setAttribute('target', '_blank')
        }

        stripDangerousAttributes(el)
      }

      Array.from(node.childNodes).forEach(traverse)
    }

    traverse(doc.body)

    return doc.body.innerHTML // ✅ will now be real HTML
  } catch {
    return html
  }
}

export default sanitizeHtml
