module.exports = (string) => {
    let array = string;
    if (typeof string === 'string') {
        array = [string];
    }
    return array;
};