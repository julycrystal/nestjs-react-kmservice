export const getErrorMessage = (error: any) => {
    if (error?.response) {
        let statusCode = error?.response.data.statusCode;
        let errorMessage = error?.response.data.message;
        return `${statusCode} : ${errorMessage}`
    }
    return error?.message
}