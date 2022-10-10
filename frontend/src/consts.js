const createRoute = (routeName) => {
    return window.location.host.includes('localhost') ?
        `http://localhost:5000/${routeName}`
        : `/${routeName}`
}

const tagColors = ["#8CDFD6", "#1481BA", "#EEC584", "#2A7F62", "#BEA7E5", "#695958", "#B74F6F"]

const randomColor = () => {
    return tagColors[Math.floor(Math.random() * tagColors.length)];
}

module.exports = {
    CREATE_ROUTE: createRoute,
    TAG_COLORS: tagColors,
    RANDOM_COLOR: randomColor
}