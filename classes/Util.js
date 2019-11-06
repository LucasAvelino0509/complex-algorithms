const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const SortList = {
    bubble:     0,
    insertion:  1,
    quick:      2,
    merge:      3
}

const genRandomArray = (numOfElements,min = 10, max = 1000) => {
    let finalArray = [];
    for (let i = 0; i < numOfElements; i++) {
        let ret = 0;
        do { ret = Math.floor(Math.random() * max) + 1 } while(ret < min);
        finalArray.push({value: ret,id: i});
    }
    return finalArray;
}

const CreateEvent = (initialState, endState, eventType) => {
    if(eventType == EventType.Movement){
        let diff = {};
        for (const key in initialState) {
            if(initialState[key] != endState[key]){
                diff[key] = endState[key];
            }
        }
        return diff;
    }
}
const EventType = {
    Movement: 0,
    // Comparassion: 1
}


export {SortList, genRandomArray, CreateEvent, EventType};
export default sleep;