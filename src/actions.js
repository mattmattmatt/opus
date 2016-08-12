export const REQUEST_PLAY_STATUS = 'REQUEST_PLAY_STATUS'
export const RECIEVE_PLAY_STATUS = 'RECIEVE_PLAY_STATUS'
export const CHANGE_PLAY_STATUS = 'CHANGE_PLAY_STATUS'

export function getCurrentStatus() {
    return {
        type: REQUEST_PLAY_STATUS,
    }
}
    
export function recieveCurrentStatus(json) {
    return {
        type: RECIEVE_PLAY_STATUS,
        status: json.status,
        receivedAt: Date.now()
    }
}
    
export function changePlayStatus(status) {
    return {
        type: CHANGE_PLAY_STATUS,
        status,
    }
}