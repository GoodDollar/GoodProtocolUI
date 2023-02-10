"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicativeAPIWebSdk = void 0;
// EXAMPLE OF INDICATIVE.COM SNIPPET TO USE WITH THIS LIBRARY
// DO NOT INITIALIZE IT BY API KEY JUST ADD ASYNC SCRIPT
//
// <script type="text/javascript">
//         (function() {
//                 var ind = document.createElement('script');
//                 ind.src = '//cdn.indicative.com/js/1.0.2/Indicative.min.js';
//                 ind.type = 'text/javascript';
//                 ind.async = 'true';
//
//                 var s = document.getElementsByTagName('script')[0];
//                 s.parentNode.insertBefore(ind, s);
//         })();
// </script>
function hasIndicativeSnippet() {
    return document.querySelectorAll('script[src*="//cdn.indicative.com"]').length > 0;
}
async function isIndicativeLoaded() {
    const ts = Date.now();
    const timeout = 5 * 1000;
    return new Promise(resolve => {
        const check = () => {
            if ("Indicative" in window) {
                resolve(true);
                return;
            }
            if (Date.now() - ts >= timeout) {
                resolve(false);
                return;
            }
            requestIdleCallback(check);
        };
        check();
    });
}
class IndicativeAPIWeb {
    async initialize(apiKey) {
        const isLoaded = await isIndicativeLoaded();
        if (!isLoaded) {
            throw new Error("Error loading indicative.com snippet");
        }
        const api = window.Indicative;
        const { apiKey: initializedWithKey } = api;
        // workaround for typo in indicative library currently existing
        const initKey = 'initalized' in api ? 'initalized' : 'initialized';
        const initialized = api[initKey];
        if (initialized && initializedWithKey !== apiKey) {
            throw new Error("indicative.com already initialized with the different API key");
        }
        if (!initialized) {
            api.initialize(apiKey);
        }
        this.api = api;
        return api[initKey];
    }
    addProperties(props) {
        this.api.addProperties(props);
    }
    setUniqueID(id) {
        this.api.setUniqueID(id);
    }
    buildEvent(eventName, props) {
        this.api.buildEvent(eventName, props);
    }
}
exports.IndicativeAPIWebSdk = hasIndicativeSnippet() ? IndicativeAPIWeb : null;
//# sourceMappingURL=api.js.map