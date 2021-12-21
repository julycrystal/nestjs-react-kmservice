module.exports = {
    client: {
        include: [
            "./src/**/*.{tsx,ts}"
        ],
        tagName: "gql",
        service: {
            name: "ecommerce-backend",
            url: "http://localhost:4000/graphql"
        }
    }
};