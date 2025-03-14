export const feedConfig = {
    production: {
        feedFilter: {
            context: process.env.REACT_APP_FEEDCONTEXT_PROD,
            tag: 'publishDapp',
        },
    },
}
