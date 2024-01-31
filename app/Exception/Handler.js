const ModelCollectionExist = async (model, queryObject) => {
    const collection = await model.findOne(queryObject);

    return collection ? true : false;
}

const successResponse = (data = [], message, status = 200) => {
    return {
        data : {
            data,
            message
        },
        status
    };
}

module.exports = {
    ModelCollectionExist,
    successResponse
}