export const checkAuth = () => {
    let token = sessionStorage.getItem('app_token') ? sessionStorage.getItem('app_token') : null
    if (token == null) {
        window.location.href = '/'
        localStorage.setItem('tokenstatus', 'expired')
    }
}

export const removeToken = () => {
    sessionStorage.removeItem('app_token')
}