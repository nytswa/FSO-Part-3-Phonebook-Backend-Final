module.exports = (error, request, response) => {
    // console path
    console.log(request.path)
    console.error(error)
    // console.log(error.name, error.message)

    // Bad Request
    if (error.name === "CastError") {
        response.status(400).send({ error: 'id used is malformed' })
    } else {  // (error.name === "Error")
        response.status(500).send({ error: 'Internal Server Error' })
    }
}