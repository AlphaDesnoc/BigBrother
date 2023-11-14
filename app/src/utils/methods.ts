export function show_hide_password(): boolean {
    const input = document.getElementById('password-input') as HTMLInputElement;
    const target = document.getElementById('password-control') as HTMLElement;
    if (input.getAttribute('type') === 'password') {
        target.classList.add('view');
        input.setAttribute('type', 'text');
    } else {
        target.classList.remove('view');
        input.setAttribute('type', 'password');
    }
    return false;
}