const isNonNull = (v) => v !== undefined && v !== null;
const isNull = (v) => !isNonNull(v);

module.exports = {
    isNonNull: isNonNull,
    isNull: isNull
}
