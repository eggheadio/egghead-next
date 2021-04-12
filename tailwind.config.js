const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const {spacing, fontFamily} = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  darkMode: 'class',
  purge: {
    enabled: true,
    content: ['./src/**/*.js', './src/**/*.mdx', './src/**/*.tsx'],
    options: {
      safelist: ['dark'], //specific classes
    },
  },
  theme: {
    colors: {
      ...defaultTheme.colors,
      ...colors,
      gray: {...colors.coolGray, 1000: '#0A0F19'},
      // red: colors.red,
      // blue: colors.blue,
      // yellow: colors.amber,
    },
    extend: {
      typography: (theme) => ({
        default: {
          css: {
            color: theme('colors.black'),
            a: {
              color: theme('colors.blue.600'),
              '&:hover': {
                color: theme('colors.blue.700'),
              },
              '*': {
                color: theme('colors.blue.600'),
              },
              code: {color: theme('colors.blue.600')},
            },
            'strong > a': {
              color: theme('colors.blue.600'),
            },
            code: {
              padding: '3px 5px',
              borderRadius: 5,
              background: theme('colors.gray.100'),
            },
            h1: {
              fontSize: theme('fontSize.3xl'),
              lineHeight: theme('lineHeight.tight'),
              fontWeight: theme('fontWeight.bold'),
            },
            h2: {
              fontSize: theme('fontSize.xl'),
              lineHeight: theme('lineHeight.snug'),
              fontWeight: theme('fontWeight.bold'),
            },
            h3: {
              fontSize: theme('fontSize.lg'),
              lineHeight: theme('lineHeight.normal'),
              fontWeight: theme('fontWeight.extrabold'),
            },
            'h2,h3,h4': {
              'scroll-margin-top': spacing[32],
            },
            mark: {
              background: theme('colors.pink.100'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.white'),
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
              code: {color: theme('colors.blue.400')},
              '*': {
                color: theme('colors.blue.400'),
                '&:hover': {
                  color: theme('colors.blue.300'),
                },
              },
            },
            'strong > a': {
              color: theme('colors.blue.400'),
            },
            blockquote: {
              borderLeftColor: theme('colors.gray.700'),
              color: theme('colors.gray.100'),
            },
            h1: {
              color: theme('colors.white'),
            },
            'h2,h3,h4': {
              color: theme('colors.white'),
              'scroll-margin-top': spacing[32],
            },
            code: {
              padding: '3px 5px',
              borderRadius: 5,
              color: theme('colors.white'),
              background: theme('colors.gray.800'),
            },
            'pre > code': {
              background: 'none',
              padding: 0,
            },
            hr: {borderColor: theme('colors.gray.700')},
            strong: {color: theme('colors.white')},
            thead: {
              color: theme('colors.gray.100'),
            },
            tbody: {
              tr: {
                borderBottomColor: theme('colors.gray.700'),
              },
            },
            mark: {
              background: theme('colors.yellow.100'),
            },
          },
        },
      }),
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
        print: {raw: 'print'},
      },
      fontSize: {
        // Set in Major Third typescale (1.25)
        base: '1em',
        lg: '1.25em',
        xl: '1.563em',
        '2xl': '1.953em',
        '3xl': '2.441em',
        '4xl': '3.052em',
        '5xl': '3.815em',
      },
      lineHeight: {
        tighter: 1.1,
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/ui'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/custom-forms'),
  ],
}
