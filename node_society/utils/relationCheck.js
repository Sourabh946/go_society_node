const preventDeleteIfExists = async (Model, where, message) => {
    const count = await Model.count({ where });
    if (count > 0) {
        throw new Error(message);
    }
};

module.exports = { preventDeleteIfExists };
