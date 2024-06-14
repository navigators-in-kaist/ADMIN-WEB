
const replaceObjKey = (obj, key, afterKey) => {
    obj[afterKey] = obj[key];
    delete obj[key];
    return obj;
};

const checkIsAllTrue = (obj) => {
    // If not object, check if it's true value
    if (typeof obj !== 'object' || obj === null) {
        return obj === true;
    }
    // recursively check
    for (let key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            if (!checkIsAllTrue(obj[key])) {
                return false;
            }
        }
    }
    return true;
};

const updateHelper = async (setState, key, value) => {
    await setState(prevState => {
        let newState = {...prevState};
        newState[key] = value;
        return newState;
    });
};

const isEmptyStr = (value) => {
    return ((typeof value === "undefined") || (value == null) || value === "");
};


const Utils = {
    replaceObjKey,
    checkIsAllTrue,
    updateHelper,
    isEmptyStr
};

export default Utils;