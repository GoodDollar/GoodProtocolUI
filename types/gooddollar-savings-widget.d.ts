import 'react'

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'gooddollar-savings-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
        }
    }
}
