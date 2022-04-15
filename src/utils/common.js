export const getUser = () => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) return userStr;
    else return null
}

export const getToken = () => {
    return sessionStorage.getItem('token ') || null
}

export const setUserSession = (token) => {
    localStorage.setItem('ballotbox_token', token)
    // sessionStorage.setItem('token', token);
}

export const removeUserSession = () => {
    localStorage.removeItem('ballotbox_token')
    // sessionStorage.removeItem('token');
}