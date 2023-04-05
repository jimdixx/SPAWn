export function validateEmail(email: string): boolean {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
}

export function validatePassword(password: string, passwordRepeat: string): boolean {
    return (password !== "" || password.length < 6) && password === passwordRepeat;
}

