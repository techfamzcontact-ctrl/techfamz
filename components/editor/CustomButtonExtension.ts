import { mergeAttributes, Node } from '@tiptap/core'

export interface CustomButtonOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customButton: {
      setCustomButton: (attributes: {
        text: string
        url: string
        bgColor: string
        textColor: string
        borderRadius: string
        size: string
      }) => ReturnType
    }
  }
}

export const CustomButtonExtension = Node.create<CustomButtonOptions>({
  name: 'customButton',

  group: 'inline',
  inline: true,
  selectable: true,
  draggable: true,
  atom: true, // Treated as a single uneditable unit by the core editor

  addAttributes() {
    return {
      text: { default: 'Click Me' },
      url: { default: '#' },
      bgColor: { default: '#3b82f6' },
      textColor: { default: '#ffffff' },
      borderRadius: { default: '8' },
      size: { default: 'md' }, // sm, md, lg
    }
  },

  parseHTML() {
    return [
      {
        tag: 'a[data-custom-button]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { text, url, bgColor, textColor, borderRadius, size } = HTMLAttributes;
    
    let padding = '0.5rem 1rem';
    let fontSize = '0.875rem';
    
    if (size === 'sm') {
      padding = '0.375rem 0.75rem';
      fontSize = '0.75rem';
    } else if (size === 'lg') {
      padding = '0.75rem 1.5rem';
      fontSize = '1rem';
    }

    return [
      'a',
      mergeAttributes(
        {
          'data-custom-button': '',
          href: url,
          target: '_blank',
          rel: 'noopener noreferrer',
          contenteditable: 'false', // Button shouldn't be edited like text inline
          style: `
            display: inline-block;
            background-color: ${bgColor};
            color: ${textColor} !important;
            border-radius: ${borderRadius}px;
            padding: ${padding};
            font-size: ${fontSize};
            text-decoration: none !important;
            font-weight: 600;
            text-align: center;
            margin: 0.25rem 0.125rem;
            line-height: 1.5;
            transition: opacity 0.2s;
            cursor: pointer;
            border: none;
            box-shadow: 0 4px 14px 0 rgba(0,0,0,0.1);
          `,
          onmouseover: "this.style.opacity='0.85'",
          onmouseout: "this.style.opacity='1'",
        },
        this.options.HTMLAttributes
      ),
      text,
    ]
  },

  addCommands() {
    return {
      setCustomButton: (attributes) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        })
      },
    }
  },
})
