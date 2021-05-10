const { offline } = require("../model/mongo");

async function getOffLineMessage(userId) {
    return await offline.find({to: userId})
}

async function deleteOffLineMessage(userId) {
    return await offline.deleteMany({to: userId})
}

async function addOffLineMessage(data) {
    return await offline.create(data)
}

module.exports = {
    getOffLineMessage,
    deleteOffLineMessage,
    addOffLineMessage
}