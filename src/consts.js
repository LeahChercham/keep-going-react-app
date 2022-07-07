const createRoute = (routeName) => {
    return window.location.host.includes('localhost') ?
        `http://localhost:7777/${routeName}`
        : `/${routeName}`
}

module.exports = {
    CREATE_ROUTE: createRoute
}