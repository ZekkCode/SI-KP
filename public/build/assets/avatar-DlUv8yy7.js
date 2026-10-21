function r(t){return t?t.startsWith("http://")||t.startsWith("https://")?t:`/storage/${t.replace(/^\/+/,"")}`:null}export{r as g};
