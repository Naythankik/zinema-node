const ModelCollectionExist = async (model, queryObject) => {
    const collection = await model.findOne(queryObject);

    return collection ? true : false;
}

const successResponseWithData = (res, data, message, status = 200) => {
    return res.status(status).json({
        data: {
            data,
            message,
        },
        status
    })
}

const successResponse = (res, message, status = 200) => {
    return res.status(status).json({
        message,
        status
    })
}

const errorResponse = (res, message, status = 400) => {
   return res.status(status).json({
        error : message,
        status
    })
}

module.exports = {
    ModelCollectionExist,
    successResponseWithData,
    errorResponse,
    successResponse
}