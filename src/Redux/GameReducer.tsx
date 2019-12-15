

const DefaultText = {
    reload: false,
    whoturn: "Please waiting",
    exit: false
}


const TabViewReducer = (state = DefaultText, action: any) => {
    switch (action.type) {
        case "reload":
            return {
                ...state,
                reload: action.payload
            }
        case "whoturn":
                return {
                    ...state,
                    whoturn: action.payload
                }
        case "exit":
            return {
                ...state,
                exit: action.payload
            }
        default:
            return state;
    }
}

export default TabViewReducer;